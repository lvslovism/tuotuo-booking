import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { verifyIdentity, createBooking, fetchResources, fetchServices } from '../api/booking-api';
import { Stepper } from '../components/booking/Stepper';
import { ServiceSelector } from '../components/booking/ServiceSelector';
import { StaffSelector } from '../components/booking/StaffSelector';
import { PeopleSelector } from '../components/booking/PeopleSelector';
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
  const [selectedDate, setSelectedDate] = useState('');
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
  const booking = useBooking(staffMode);

  const groupBooking = merchant?.booking_rules?.group_booking;
  const groupEnabled = groupBooking?.enabled === true && (groupBooking?.max_people ?? 1) > 1;
  const groupDiscount = merchant?.pricing_rules?.group_discount
    || (merchant?.pricing_info as Record<string, unknown>)?.group_discount as import('../types').GroupDiscount | undefined;

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
        // 失敗就當 hidden，功能退化但不 block
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
    // Clear the marker regardless — one-shot
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
        booking.selectService(svc);
        if (payload.staffId) {
          const staff = resources.find((r) => r.id === payload.staffId);
          if (staff) booking.selectStaff(staff);
        } else if (staffMode !== 'hidden') {
          booking.selectStaff(null);
        }
        booking.selectSlot(
          payload.date!,
          { time: payload.time!, available: true, available_resources: 1 },
          1,
        );
        setSelectedDate(payload.date!);
        // Stay on 'info' step — LINE doesn't provide phone/gender; GuestForm will prefill name
        booking.setStep('info');
      })
      .catch(() => { /* fall through to fresh flow */ })
      .finally(() => setRestoring(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourcesLoaded, merchantCode]);

  const handleSelectService = useCallback((service: Service) => {
    booking.selectService(service);
  }, [booking.selectService]);

  const handleSelectStaff = useCallback((resource: Resource | null) => {
    booking.selectStaff(resource);
  }, [booking.selectStaff]);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleSelectSlot = useCallback((slot: TimeSlot, sessions: number) => {
    booking.selectSlot(selectedDate, slot, sessions);
  }, [booking.selectSlot, selectedDate]);

  const handleGuestSubmit = useCallback((info: GuestInfo, companion?: CompanionInfo) => {
    if (companion) {
      booking.setCompanionInfo(companion);
    }
    booking.setGuestInfo(info);
  }, [booking.setGuestInfo, booking.setCompanionInfo]);

  const handleConfirm = useCallback(async () => {
    if (!booking.service || !booking.slot) return;

    // Step 1: Verify identity (guest mode) to get JWT
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

    // Step 2: Create booking — 有選師傅就帶入 resource_id
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

    navigate(`/s/${merchantCode}/success`, {
      state: { bookingResult: result },
    });
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

      <Stepper current={booking.step} mode={staffMode} />

      {/* 等 fetchResources 先 resolve，避免 ServiceSelector 單服務 auto-select 跑在 mode='hidden' 閉包下 */}
      {/* restoring: 跳過所有 step UI，避免 ServiceSelector 的單服務 auto-select 覆蓋回來的狀態 */}
      {(!resourcesLoaded || restoring) && <Loading text="載入中..." />}

      {/* Step 1: Select service */}
      {resourcesLoaded && !restoring && booking.step === 'service' && (
        <ServiceSelector onSelect={handleSelectService} />
      )}

      {/* Step 1.5: Select staff (optional/required) */}
      {booking.step === 'staff' && (
        <StaffSelector
          resources={resources}
          mode={staffMode}
          onSelect={handleSelectStaff}
          onBack={booking.goBack}
        />
      )}

      {/* Step 2: Select date + time (with optional people selector) */}
      {booking.step === 'datetime' && booking.service && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="theme-title text-lg">選擇日期與時段</h2>
            <button
              onClick={booking.goBack}
              className="text-sm hover:underline"
              style={{ color: 'var(--t-primary)' }}
            >
              ← {staffMode === 'hidden'
                ? `換${merchant?.terminology?.service || '服務'}`
                : `換${merchant?.terminology?.provider || '服務人員'}`}
            </button>
          </div>
          <div
            className="rounded-lg px-3 py-2 mb-3 text-sm"
            style={{ background: 'var(--t-primary-soft)' }}
          >
            <span className="font-medium" style={{ color: 'var(--t-primary)' }}>
              {booking.service.name}
            </span>
            <span className="ml-2" style={{ color: 'var(--t-sub)' }}>
              {booking.service.duration_minutes}分鐘 · NT${booking.service.price}
            </span>
            {booking.staffName && (
              <span className="ml-2" style={{ color: 'var(--t-primary)' }}>
                · {booking.staffName}
              </span>
            )}
          </div>

          {/* People selector — visible when group_booking is enabled */}
          {groupEnabled && (
            <PeopleSelector
              people={booking.people}
              maxPeople={groupBooking?.max_people || booking.service.max_party_size || 2}
              groupDiscount={groupDiscount ?? { enabled: true, discount_per_session: 0, min_people_or_sessions: 2, description: '' }}
              terminology={{ booking: merchant?.terminology?.booking }}
              onChange={booking.setPeople}
            />
          )}

          <Calendar
            serviceId={booking.service.id}
            selectedDate={selectedDate}
            people={booking.people}
            onSelectDate={handleSelectDate}
          />
          <TimeSlotGrid
            serviceId={booking.service.id}
            date={selectedDate}
            people={booking.people}
            resourceId={booking.staffId}
            onSelect={handleSelectSlot}
          />
        </div>
      )}

      {/* Step 3: Fill info */}
      {booking.step === 'info' && (
        <GuestForm
          people={booking.people}
          merchant={merchant}
          merchantCode={merchantCode}
          bookingReturnState={{
            serviceId: booking.service?.id ?? null,
            staffId: booking.staffId,
            date: booking.date || selectedDate,
            time: booking.slot?.time,
          }}
          initialGuestInfo={booking.guestInfo}
          initialCompanionInfo={booking.companionInfo}
          onSubmit={handleGuestSubmit}
          onBack={booking.goBack}
        />
      )}

      {/* Step 4: Confirm */}
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
