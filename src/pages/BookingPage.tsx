import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { verifyIdentity, createBooking, fetchResources, fetchServices } from '../api/booking-api';
import { logFunnel } from '../lib/funnel';
import { Stepper } from '../components/booking/Stepper';
import { ServiceSelector } from '../components/booking/ServiceSelector';
import { PartySizeAndStaff } from '../components/booking/PartySizeAndStaff';
import { Calendar } from '../components/booking/Calendar';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { GuestForm } from '../components/booking/GuestForm';
import { BookingConfirm } from '../components/booking/BookingConfirm';
import { Loading } from '../components/ui/Loading';
import type {
  Service,
  TimeSlot,
  GuestInfo,
  CompanionInfo,
  Resource,
  StaffSelectionMode,
  GroupDiscount,
} from '../types';

const BOOKING_RETURN_KEY = 'wb_booking_return';

interface BookingReturnPayload {
  merchantCode?: string;
  serviceId?: string | null;
  staffId?: string | null;
  date?: string;
  time?: string;
}

export function BookingPage() {
  const { merchant, merchantCode } = useMerchant();
  const { token, setAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [staffMode, setStaffMode] = useState<StaffSelectionMode>('hidden');
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  // Initialize restoring=true synchronously if this is a LINE-Login return, so we don't render
  // ServiceSelector before the restore effect completes (auto-select-on-single-service would clobber state).
  const [restoring, setRestoring] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('restored') !== 'true') return false;
      return !!sessionStorage.getItem(BOOKING_RETURN_KEY);
    } catch {
      return false;
    }
  });

  // Group booking 設定（驅動 Step 2 的人數區塊是否顯示）
  const groupBooking = merchant?.booking_rules?.group_booking;
  const activeResources = useMemo(() => resources, [resources]); // EF 已過濾 inactive
  const maxPeople = Math.min(
    activeResources.length || 1,
    groupBooking?.max_people ?? 1,
  );
  const groupEnabled = groupBooking?.enabled === true && maxPeople >= 2;
  const groupDiscount = (merchant?.pricing_rules?.group_discount
    || ((merchant?.pricing_info as Record<string, unknown>)?.group_discount as
      | GroupDiscount
      | undefined));

  // hasPartyStep: 有任何東西要在 Step 2 選 → 顯示 step
  const hasPartyStep = staffMode !== 'hidden' || groupEnabled;
  const booking = useBooking({ hasPartyStep });

  // Funnel: landing + abandoned tracking
  useEffect(() => {
    if (!merchantCode) return;
    logFunnel('landing');
  }, [merchantCode]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (booking.step === 'confirm' && booking.slot) return;
      logFunnel('abandoned', {
        failure_reason: 'user_closed',
        metadata: { at_step: booking.step },
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [booking.step, booking.slot]);

  // 載入師傅清單 + staff_selection_mode
  // ⚠️ 必須在 ServiceSelector 渲染前 resolve，否則單服務 auto-select 會讀到 stale mode='hidden' 跳過 staff 步驟
  useEffect(() => {
    if (!merchantCode) return;
    fetchResources(merchantCode)
      .then((data) => {
        setStaffMode(data.staff_selection_mode);
        setResources(data.resources || []);
      })
      .catch(() => {
        setStaffMode('hidden');
        setResources([]);
      })
      .finally(() => setResourcesLoaded(true));
  }, [merchantCode]);

  // Restore booking state after LINE Login redirect (/s/:merchantCode?restored=true)
  useEffect(() => {
    if (!resourcesLoaded || !merchantCode) return;
    if (searchParams.get('restored') !== 'true') return;

    let rawReturn: string | null = null;
    try {
      rawReturn = sessionStorage.getItem(BOOKING_RETURN_KEY);
    } catch {
      rawReturn = null;
    }
    try {
      sessionStorage.removeItem(BOOKING_RETURN_KEY);
    } catch { /* ignore */ }
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('restored');
    setSearchParams(nextParams, { replace: true });

    if (!rawReturn) {
      setRestoring(false);
      return;
    }
    let payload: BookingReturnPayload;
    try {
      payload = JSON.parse(rawReturn);
    } catch {
      setRestoring(false);
      return;
    }
    if (payload.merchantCode && payload.merchantCode !== merchantCode) {
      setRestoring(false);
      return;
    }
    if (!payload.serviceId || !payload.date || !payload.time) {
      setRestoring(false);
      return;
    }

    setRestoring(true);
    fetchServices(merchantCode)
      .then(({ services }) => {
        const svc = services.find((s) => s.id === payload.serviceId);
        if (!svc) return;
        const staff = payload.staffId ? resources.find((r) => r.id === payload.staffId) : null;
        booking.restoreState({
          service: svc,
          staffId: staff?.id ?? null,
          staffName: staff?.name ?? null,
          date: payload.date!,
          slot: { time: payload.time!, available: true, available_resources: 1 },
          sessions: 1,
          step: 'info',
        });
      })
      .catch(() => { /* fall through to fresh flow */ })
      .finally(() => setRestoring(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourcesLoaded, merchantCode]);

  const handleSelectService = useCallback((service: Service) => {
    booking.selectService(service);
  }, [booking.selectService]);

  const handleSelectDate = useCallback((date: string) => {
    booking.selectDate(date);
  }, [booking.selectDate]);

  const handleSelectSlot = useCallback((slot: TimeSlot, sessions: number) => {
    booking.selectSlot(slot, sessions);
  }, [booking.selectSlot]);

  const handleGuestSubmit = useCallback((info: GuestInfo, companion?: CompanionInfo) => {
    if (companion) {
      booking.setCompanionInfo(companion);
    }
    booking.setGuestInfo(info);
  }, [booking.setGuestInfo, booking.setCompanionInfo]);

  const handleConfirm = useCallback(async () => {
    if (!booking.service || !booking.slot) return;

    try {
      let authToken = token;
      if (!authToken) {
        const authResult = await verifyIdentity(merchantCode, {
          mode: 'guest',
          name: booking.guestInfo.name,
          phone: booking.guestInfo.phone,
          gender: booking.guestInfo.gender,
        });
        authToken = authResult.session_token;
        setAuth(authResult.session_token, {
          id: authResult.customer.id,
          name: authResult.customer.name,
          phone: authResult.customer.phone,
        }, 'guest');
      }

      const result = await createBooking(authToken!, merchantCode, {
        service_id: booking.service.id,
        date: booking.date,
        time: booking.slot.time,
        sessions: booking.sessions,
        people: booking.people,
        customer_name: booking.guestInfo?.name,
        customer_phone: booking.guestInfo?.phone,
        customer_gender: booking.guestInfo?.gender,
        ...(booking.staffId ? { resource_id: booking.staffId } : {}),
        ...(booking.people >= 2 && booking.companionInfo?.name
          ? { companion_name: booking.companionInfo.name, companion_gender: booking.companionInfo.gender || undefined }
          : {}),
      });

      logFunnel('success', {
        service_id: booking.service.id,
        resource_id: booking.staffId ?? undefined,
        booking_id: result?.booking?.id,
      });

      navigate(`/s/${merchantCode}/success`, {
        state: { bookingResult: result },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logFunnel('error', {
        service_id: booking.service?.id,
        resource_id: booking.staffId ?? undefined,
        failure_reason: 'create_booking_failed',
        failure_detail: msg.slice(0, 300),
      });
      throw err;
    }
  }, [booking, token, merchantCode, navigate, setAuth]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1
          className="theme-title"
          style={{ fontSize: '1.35rem', color: 'var(--t-primary)' }}
        >
          {merchant?.display_name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--t-sub)' }}>
          線上{merchant?.terminology?.booking || '預約'}
        </p>
        <div className="theme-gold-divider" />
      </div>

      <Stepper current={booking.step} hasPartyStep={hasPartyStep} />

      {/* 等 fetchResources 先 resolve，避免 ServiceSelector 單服務 auto-select 跑在 mode='hidden' 閉包下 */}
      {/* restoring: 跳過所有 step UI，避免 ServiceSelector 的單服務 auto-select 覆蓋回來的狀態 */}
      {(!resourcesLoaded || restoring) && <Loading text="載入中..." />}

      {/* Step 1: Select service */}
      {resourcesLoaded && !restoring && booking.step === 'service' && (
        <ServiceSelector onSelect={handleSelectService} />
      )}

      {/* Step 2: Party size + staff */}
      {booking.step === 'party' && (
        <PartySizeAndStaff
          resources={activeResources}
          staffMode={staffMode}
          groupEnabled={groupEnabled}
          maxPeople={maxPeople}
          groupDiscount={groupDiscount}
          people={booking.people}
          staffId={booking.staffId}
          onChangePeople={booking.setPeople}
          onChangeStaff={booking.setStaff}
          onConfirm={booking.confirmParty}
          onBack={booking.goBack}
        />
      )}

      {/* Step 3: Pick date */}
      {booking.step === 'date' && booking.service && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="theme-title text-lg">選擇日期</h2>
            <button
              onClick={booking.goBack}
              className="text-sm hover:underline"
              style={{ color: 'var(--t-primary)' }}
            >
              ← 上一步
            </button>
          </div>
          {merchant?.booking_rules?.allow_same_day === false && merchant?.phone && (
            <div
              className="theme-card p-4 text-center mb-3"
              style={{ background: 'var(--t-primary-soft)' }}
            >
              <p className="font-medium" style={{ color: 'var(--t-primary)' }}>
                ⏰ 不接受當日預約
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--t-sub)' }}>
                當日預約請來電{' '}
                <a href={`tel:${merchant.phone}`} className="underline">
                  {merchant.phone}
                </a>
              </p>
            </div>
          )}
          <BookingSummaryCard
            service={booking.service}
            people={booking.people}
            staffName={booking.staffName}
          />
          <Calendar
            serviceId={booking.service.id}
            selectedDate={booking.date}
            people={booking.people}
            onSelectDate={handleSelectDate}
          />
        </div>
      )}

      {/* Step 4: Pick time slot */}
      {booking.step === 'time' && booking.service && booking.date && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="theme-title text-lg">選擇時段</h2>
            <button
              onClick={booking.goBack}
              className="text-sm hover:underline"
              style={{ color: 'var(--t-primary)' }}
            >
              ← 換日期
            </button>
          </div>
          <BookingSummaryCard
            service={booking.service}
            people={booking.people}
            staffName={booking.staffName}
          />
          <TimeSlotGrid
            serviceId={booking.service.id}
            date={booking.date}
            people={booking.people}
            resourceId={booking.staffId}
            onSelect={handleSelectSlot}
          />
        </div>
      )}

      {/* Step 5: Fill info */}
      {booking.step === 'info' && (
        <GuestForm
          people={booking.people}
          merchant={merchant}
          merchantCode={merchantCode}
          bookingReturnState={{
            serviceId: booking.service?.id ?? null,
            staffId: booking.staffId,
            date: booking.date,
            time: booking.slot?.time,
          }}
          initialGuestInfo={booking.guestInfo}
          initialCompanionInfo={booking.companionInfo}
          onSubmit={handleGuestSubmit}
          onBack={booking.goBack}
        />
      )}

      {/* Step 6: Confirm */}
      {booking.step === 'confirm' && booking.service && booking.slot && (
        <BookingConfirm
          service={booking.service}
          date={booking.date}
          slot={booking.slot}
          sessions={booking.sessions}
          people={booking.people}
          guestInfo={booking.guestInfo}
          companionInfo={booking.people >= 2 ? booking.companionInfo : undefined}
          staffName={booking.staffName}
          onConfirm={handleConfirm}
          onBack={booking.goBack}
        />
      )}
    </div>
  );
}

function BookingSummaryCard({
  service,
  people,
  staffName,
}: {
  service: Service;
  people: number;
  staffName: string | null;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2 mb-3 text-sm"
      style={{ background: 'var(--t-primary-soft)' }}
    >
      <span className="font-medium" style={{ color: 'var(--t-primary)' }}>
        {service.name}
      </span>
      <span className="ml-2" style={{ color: 'var(--t-sub)' }}>
        {service.duration_minutes}分鐘 · NT${service.price}
      </span>
      {people >= 2 && (
        <span className="ml-2" style={{ color: 'var(--t-primary)' }}>
          · {people} 人同行
        </span>
      )}
      {people === 1 && staffName && (
        <span className="ml-2" style={{ color: 'var(--t-primary)' }}>
          · {staffName}
        </span>
      )}
    </div>
  );
}
