import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { fetchBookingStatus, submitReview, type BookingStatusResponse } from '../api/booking-api';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

type Step = 'loading' | 'form' | 'submitting' | 'success';

export function ReviewPage() {
  const { merchantCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { merchant } = useMerchant();
  const { token } = useAuth();

  const bookingId = searchParams.get('booking_id') || '';
  const terminology = merchant?.terminology;

  const [step, setStep] = useState<Step>('loading');
  const [booking, setBooking] = useState<BookingStatusResponse | null>(null);
  const [error, setError] = useState('');

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // Load booking details
  useEffect(() => {
    if (!merchantCode || !bookingId) return;
    fetchBookingStatus(merchantCode, bookingId)
      .then((data) => {
        if (data.status !== 'completed') {
          setError(`僅已完成的${terminology?.booking || '預約'}可以評價`);
        }
        setBooking(data);
        setStep('form');
      })
      .catch(() => {
        setError('無法載入預約資料');
        setStep('form');
      });
  }, [merchantCode, bookingId, terminology?.booking]);

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

  const handleSubmit = async () => {
    if (!token || !merchantCode || !bookingId || rating === 0) return;
    setStep('submitting');
    setError('');
    try {
      await submitReview(token, merchantCode, bookingId, rating, comment);
      setStep('success');
    } catch (err: any) {
      setError(err.message || '提交評價失敗，請稍後再試');
      setStep('form');
    }
  };

  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading text="載入預約資料..." />
      </div>
    );
  }

  // Error without booking data
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
        <h1 className="text-2xl font-bold mb-2">感謝您的評價！</h1>
        <p className="text-gray-500 mb-8 text-center">
          您的回饋將幫助我們提供更好的{terminology?.service || '服務'}。
        </p>

        <div className="w-full max-w-md space-y-3">
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

  const canSubmit = booking?.status === 'completed' && rating > 0;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary">
        評價{terminology?.service || '服務'}
      </h1>

      {/* Booking info card */}
      {booking && (
        <div className="bg-white rounded-xl shadow-sm p-4">
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

      {/* Not completed warning */}
      {booking && booking.status !== 'completed' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          僅已完成的{terminology?.booking || '預約'}可以評價。
        </div>
      )}

      {/* Review form */}
      {booking?.status === 'completed' && (
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
          {/* Star rating */}
          <div>
            <label className="block font-medium text-gray-800 mb-3">整體評分</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <svg
                    className="w-10 h-10 transition-colors"
                    fill={(hoverRating || rating) >= star ? 'var(--color-accent, #E8922D)' : '#E5E7EB'}
                    viewBox="0 0 24 24"
                    stroke="none"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm mt-2" style={{ color: 'var(--color-accent, #E8922D)' }}>
                {['', '待改善', '普通', '不錯', '很好', '非常滿意'][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block font-medium text-gray-800 mb-2">評語（選填）</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`分享您對本次${terminology?.service || '服務'}的感受...`}
              rows={4}
              maxLength={500}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--color-primary, #3B6B5E)' } as React.CSSProperties}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            variant="accent"
            size="lg"
            className="w-full"
            disabled={!canSubmit || step === 'submitting'}
            onClick={handleSubmit}
          >
            {step === 'submitting' ? '提交中...' : '提交評價'}
          </Button>
        </div>
      )}
    </div>
  );
}
