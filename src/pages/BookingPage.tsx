import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { verifyIdentity, createBooking } from '../api/booking-api';
import { Stepper } from '../components/booking/Stepper';
import { ServiceSelector } from '../components/booking/ServiceSelector';
import { PeopleSelector } from '../components/booking/PeopleSelector';
import { Calendar } from '../components/booking/Calendar';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { GuestForm } from '../components/booking/GuestForm';
import { BookingConfirm } from '../components/booking/BookingConfirm';
import type { Service, TimeSlot, GuestInfo, CompanionInfo } from '../types';

export function BookingPage() {
  const { merchant, merchantCode } = useMerchant();
  const { token, setAuth } = useAuth();
  const navigate = useNavigate();
  const booking = useBooking();
  const [selectedDate, setSelectedDate] = useState('');

  const groupBooking = merchant?.booking_rules?.group_booking;
  const groupEnabled = groupBooking?.enabled === true && (groupBooking?.max_people ?? 1) > 1;
  const groupDiscount = merchant?.pricing_rules?.group_discount
    || (merchant?.pricing_info as Record<string, unknown>)?.group_discount as import('../types').GroupDiscount | undefined;

  const handleSelectService = useCallback((service: Service) => {
    booking.selectService(service);
  }, [booking.selectService]);

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

    // Step 2: Create booking — new format with slots array
    const result = await createBooking(authToken!, merchantCode, {
      service_id: booking.service.id,
      date: booking.date,
      time: booking.slot.time,
      sessions: booking.sessions,
      people: booking.people,
      customer_name: booking.guestInfo?.name,
      customer_phone: booking.guestInfo?.phone,
      customer_gender: booking.guestInfo?.gender,
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

      <Stepper current={booking.step} />

      {/* Step 1: Select service */}
      {booking.step === 'service' && (
        <ServiceSelector onSelect={handleSelectService} />
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
              ← 換{merchant?.terminology?.service || '服務'}
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
            onSelect={handleSelectSlot}
          />
        </div>
      )}

      {/* Step 3: Fill info */}
      {booking.step === 'info' && (
        <GuestForm
          people={booking.people}
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
          onConfirm={handleConfirm}
          onBack={booking.goBack}
        />
      )}
    </div>
  );
}
