import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { fetchBookingStatus, rescheduleBooking, type BookingStatusResponse } from '../api/booking-api';
import { Calendar } from '../components/booking/Calendar';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import type { TimeSlot } from '../types';

type Step = 'loading' | 'view' | 'select-date' | 'confirm' | 'success';

export function ReschedulePage() {
  const { merchantCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { merchant } = useMerchant();
  const { token } = useAuth();

  // Phase 8: 同時接受 ?booking_id= 與 ?id=（舊路徑），避免 MemberPage 過渡期 callers 失效。
  const bookingId = searchParams.get('booking_id') || searchParams.get('id') || '';
  const terminology = merchant?.terminology;

  const [step, setStep] = useState<Step>('loading');
  const [booking, setBooking] = useState<BookingStatusResponse | null>(null);
  const [error, setError] = useState('');

  // New datetime selection
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newTime, setNewTime] = useState('');

  // Load booking details
  useEffect(() => {
    if (!merchantCode || !bookingId) return;
    fetchBookingStatus(merchantCode, bookingId)
      .then((data) => {
        setBooking(data);
        setStep('view');
      })
      .catch(() => {
        setError('無法載入預約資料');
        setStep('view');
      });
  }, [merchantCode, bookingId]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const dow = weekdays[d.getDay()];
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      return `${m}/${day} (${dow}) ${hours}:${mins}`;
    } catch {
      return isoString;
    }
  };

  const formatDateShort = (dateStr: string) => {
    const [, m, d] = dateStr.split('-').map(Number);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const dow = weekdays[new Date(dateStr).getDay()];
    return `${m}/${d} (${dow})`;
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!token || !merchantCode || !bookingId || !selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setError('');
    try {
      await rescheduleBooking(token, merchantCode, bookingId, selectedDate, selectedSlot.time);
      setNewTime(`${formatDateShort(selectedDate)} ${selectedSlot.time}`);
      setStep('success');
    } catch (err: any) {
      setError(err.message || '改期失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading text="載入預約資料..." />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => navigate(`/s/${merchantCode}/member`)}>
          返回會員頁
        </Button>
      </div>
    );
  }

  // Success screen
  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-12" style={{ backgroundColor: 'var(--color-bg, #F8F6F3)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-success, #7BAE7F)' }}>
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">改期成功</h1>
        <p className="text-gray-500 mb-8 text-center">
          您的{terminology?.booking || '預約'}已更新為新時段。
        </p>

        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">新{terminology?.booking || '預約'}時間</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{terminology?.service || '服務'}</span>
              <span className="font-medium">{booking?.service_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">新時間</span>
              <span className="font-medium" style={{ color: 'var(--color-primary, #3B6B5E)' }}>
                {newTime}
              </span>
            </div>
            {booking?.resource_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">{terminology?.provider || '服務人員'}</span>
                <span className="font-medium">{booking.resource_name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-md space-y-3">
          <button
            onClick={() => navigate(`/s/${merchantCode}/member`)}
            className="w-full py-3 rounded-full text-white font-medium"
            style={{ backgroundColor: 'var(--color-primary, #3B6B5E)' }}
          >
            查看我的{terminology?.booking || '預約'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary">
        改期{terminology?.booking || '預約'}
      </h1>

      {/* Current booking info */}
      {booking && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-medium text-gray-800 mb-3">目前{terminology?.booking || '預約'}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{terminology?.service || '服務'}</span>
              <span className="font-medium">{booking.service_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">日期時間</span>
              <span className="font-medium">{formatDate(booking.start_time)}</span>
            </div>
            {booking.resource_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">{terminology?.provider || '服務人員'}</span>
                <span className="font-medium">{booking.resource_name}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date/time picker or confirmation */}
      {(step === 'view' || step === 'select-date') && booking && (
        <>
          <h2 className="font-medium text-gray-800">選擇新時段</h2>
          <Calendar
            serviceId={booking.service_id}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null);
              setStep('select-date');
            }}
          />
          {selectedDate && (
            <TimeSlotGrid
              serviceId={booking.service_id}
              date={selectedDate}
              onSelect={(slot) => handleSlotSelect(slot)}
            />
          )}
        </>
      )}

      {step === 'confirm' && booking && selectedSlot && (
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-lg">確認改期</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">原時間</span>
              <span className="font-medium text-text-secondary line-through">
                {formatDate(booking.start_time)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">新時間</span>
              <span className="font-medium" style={{ color: 'var(--color-primary, #3B6B5E)' }}>
                {formatDateShort(selectedDate)} {selectedSlot.time}
              </span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => {
                setStep('select-date');
                setError('');
              }}
            >
              重新選擇
            </Button>
            <Button
              variant="accent"
              size="md"
              className="flex-1"
              disabled={submitting}
              onClick={handleConfirm}
            >
              {submitting ? '處理中...' : '確認改期'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
