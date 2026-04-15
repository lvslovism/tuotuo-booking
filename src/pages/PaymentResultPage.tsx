import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { fetchBookingStatus, createPayment, type BookingStatusResponse } from '../api/booking-api';
import { Loading } from '../components/ui/Loading';

const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 30000;

export function PaymentResultPage() {
  const { merchantCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { merchant } = useMerchant();
  const { token } = useAuth();

  const bookingId = searchParams.get('booking_id') || '';
  const terminology = merchant?.terminology;

  const [booking, setBooking] = useState<BookingStatusResponse | null>(null);
  const [status, setStatus] = useState<'polling' | 'paid' | 'failed' | 'pending'>('polling');
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const pollStart = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const poll = useCallback(async () => {
    if (!merchantCode || !bookingId) return;

    try {
      const data = await fetchBookingStatus(merchantCode, bookingId);
      setBooking(data);

      if (data.payment_status === 'paid') {
        setStatus('paid');
        return;
      }
      if (data.payment_status === 'failed') {
        setStatus('failed');
        return;
      }

      // Still pending — check timeout
      if (Date.now() - pollStart.current >= POLL_TIMEOUT) {
        setStatus('pending');
        return;
      }

      // Continue polling
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    } catch {
      setError('無法取得付款狀態，請稍後再試');
      setStatus('pending');
    }
  }, [merchantCode, bookingId]);

  useEffect(() => {
    pollStart.current = Date.now();
    poll();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [poll]);

  const handleRetry = async () => {
    if (!token || !merchantCode || !bookingId) return;
    setRetrying(true);
    try {
      const result = await createPayment(token, merchantCode, bookingId);
      if (result.payment_url) {
        window.location.href = result.payment_url;
      }
    } catch {
      setError('重新付款失敗，請稍後再試');
    } finally {
      setRetrying(false);
    }
  };

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

  // Polling state
  if (status === 'polling') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg, #F8F6F3)' }}>
        <Loading text="確認付款結果中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12" style={{ backgroundColor: 'var(--color-bg, #F8F6F3)' }}>
      {/* Status icon */}
      {status === 'paid' && (
        <>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-success, #7BAE7F)' }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">付款成功</h1>
          <p className="text-gray-500 mb-8 text-center">
            您的{terminology?.booking || '預約'}已確認，請準時到場。
          </p>
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-500">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">付款失敗</h1>
          <p className="text-gray-500 mb-8 text-center">
            付款未成功，請重新嘗試或選擇其他付款方式。
          </p>
        </>
      )}

      {status === 'pending' && (
        <>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-yellow-400">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">處理中</h1>
          <p className="text-gray-500 mb-8 text-center">
            付款正在處理中，請稍候。您可以稍後在會員頁面查看狀態。
          </p>
        </>
      )}

      {/* Booking details */}
      {booking && status === 'paid' && (
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 mb-4">
          <h2 className="font-bold text-lg mb-4">{terminology?.booking || '預約'}明細</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{terminology?.service || '服務'}</span>
              <span className="font-medium">{booking.service_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">日期時間</span>
              <span className="font-medium">{formatDate(booking.start_time)}</span>
            </div>
            {booking.duration_minutes > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">時長</span>
                <span className="font-medium">{booking.duration_minutes} 分鐘</span>
              </div>
            )}
            {booking.resource_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">{terminology?.provider || '服務人員'}</span>
                <span className="font-medium">{booking.resource_name}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold">費用</span>
              <span className="font-bold" style={{ color: 'var(--color-accent, #E8922D)' }}>
                NT${booking.final_price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* Actions */}
      <div className="w-full max-w-md space-y-3">
        {status === 'failed' && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full py-3 rounded-full text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-accent, #E8922D)' }}
          >
            {retrying ? '處理中...' : '重新付款'}
          </button>
        )}

        <button
          onClick={() => navigate(`/s/${merchantCode}/member`)}
          className="w-full py-3 rounded-full text-white font-medium"
          style={{ backgroundColor: 'var(--color-primary, #3B6B5E)' }}
        >
          查看我的{terminology?.booking || '預約'}
        </button>

        <button
          onClick={() => navigate(`/s/${merchantCode}`)}
          className="w-full py-3 rounded-full font-medium border"
          style={{ borderColor: 'var(--color-primary, #3B6B5E)', color: 'var(--color-primary, #3B6B5E)' }}
        >
          回到首頁
        </button>
      </div>
    </div>
  );
}
