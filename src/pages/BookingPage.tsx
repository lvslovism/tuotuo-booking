import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { verifyIdentity, createBooking } from '../api/booking-api';
import { Stepper } from '../components/booking/Stepper';
import { ServiceSelector } from '../components/booking/ServiceSelector';
import { Calendar } from '../components/booking/Calendar';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { GuestForm } from '../components/booking/GuestForm';
import { BookingConfirm } from '../components/booking/BookingConfirm';
import type { Service, TimeSlot, GuestInfo } from '../types';

export function BookingPage() {
  const { merchant, merchantCode } = useMerchant();
  const { token, setAuth } = useAuth();
  const navigate = useNavigate();
  const booking = useBooking();
  const [selectedDate, setSelectedDate] = useState('');

  const handleSelectService = useCallback((service: Service) => {
    booking.selectService(service);
  }, [booking.selectService]);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleSelectSlot = useCallback((slot: TimeSlot, sessions: number) => {
    booking.selectSlot(selectedDate, slot, sessions);
  }, [booking.selectSlot, selectedDate]);

  const handleGuestSubmit = useCallback((info: GuestInfo) => {
    booking.setGuestInfo(info);
  }, [booking.setGuestInfo]);

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

    // Step 2: Create booking
    const result = await createBooking(authToken!, merchantCode, {
      date: booking.date,
      time: booking.slot.time,
      sessions: booking.sessions,
      customer_name: booking.guestInfo?.name,
      customer_phone: booking.guestInfo?.phone,
      customer_gender: booking.guestInfo?.gender,
    });

    navigate(`/s/${merchantCode}/success`, {
      state: { bookingResult: result },
    });
  }, [booking, token, merchantCode, navigate, setAuth]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-primary">
          {merchant?.display_name}
        </h1>
        <p className="text-sm text-text-secondary">
          線上{merchant?.terminology?.booking || '預約'}
        </p>
      </div>

      <Stepper current={booking.step} />

      {/* Step 1: Select service */}
      {booking.step === 'service' && (
        <ServiceSelector onSelect={handleSelectService} />
      )}

      {/* Step 2: Select date + time */}
      {booking.step === 'datetime' && booking.service && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">選擇日期與時段</h2>
            <button
              onClick={booking.goBack}
              className="text-sm text-primary hover:underline"
            >
              ← 換{merchant?.terminology?.service || '服務'}
            </button>
          </div>
          <div className="bg-primary/5 rounded-lg px-3 py-2 mb-3 text-sm">
            <span className="font-medium text-primary">{booking.service.name}</span>
            <span className="text-text-secondary ml-2">
              {booking.service.service_minutes || booking.service.duration_minutes}分鐘 · NT${booking.service.price}
            </span>
          </div>
          <Calendar
            serviceId={booking.service.id}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
          <TimeSlotGrid
            serviceId={booking.service.id}
            date={selectedDate}
            onSelect={handleSelectSlot}
          />
        </div>
      )}

      {/* Step 3: Fill info */}
      {booking.step === 'info' && (
        <GuestForm onSubmit={handleGuestSubmit} onBack={booking.goBack} />
      )}

      {/* Step 4: Confirm */}
      {booking.step === 'confirm' && booking.service && booking.slot && (
        <BookingConfirm
          service={booking.service}
          date={booking.date}
          slot={booking.slot}
          sessions={booking.sessions}
          guestInfo={booking.guestInfo}
          onConfirm={handleConfirm}
          onBack={booking.goBack}
        />
      )}
    </div>
  );
}
