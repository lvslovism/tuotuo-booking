import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import type { CreateBookingResponse, GroupBookingItem } from '../api/booking-api';

export default function SuccessPage() {
  const { merchantCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { merchant } = useMerchant();

  // API 回傳結構：{ booking: {...}, bookings?: [...], merchant: {...} }
  // BookingPage navigate 時帶 state: { bookingResult: result }
  const result = (location.state as { bookingResult?: CreateBookingResponse })?.bookingResult;
  const booking = result?.booking;
  const bookings = result?.bookings;
  const merchantInfo = result?.merchant;
  const isGroup = (result?.total_sessions ?? 1) > 1;

  // 日期格式化
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

  const terminology = merchant?.terminology;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12" style={{ backgroundColor: 'var(--color-bg, #F8F6F3)' }}>
      {/* 成功圖示 */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-success, #7BAE7F)' }}>
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">{terminology?.booking || '預約'}成功！</h1>
      <p className="text-gray-500 mb-8 text-center">
        {isGroup && bookings && bookings.length > 1
          ? `您和同行者的${terminology?.booking || '預約'}已確認，請準時到場。`
          : `${merchant?.display_name || '商家'} 已收到您的${terminology?.booking || '預約'}，請準時到場。`
        }
      </p>

      {/* Group bookings summary */}
      {isGroup && bookings && bookings.length > 1 ? (
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 mb-4">
          <h2 className="font-bold text-lg mb-4">{terminology?.booking || '預約'}明細</h2>
          <div className="space-y-3">
            {bookings.map((b: GroupBookingItem, idx: number) => (
              <div key={b.id || idx} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                    {b.group_index || idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{b.customer_name}</p>
                    <p className="text-xs text-text-secondary">
                      {formatDate(b.start_time)} · {b.resource_name}
                    </p>
                  </div>
                </div>
                <span className="font-medium" style={{ color: 'var(--color-accent, #E8922D)' }}>
                  NT${b.final_price?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          {result && (
            <div className="border-t pt-3 mt-3 space-y-2">
              {result.discount_per_session > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">同行優惠</span>
                  <span className="text-green-600">
                    -{result.total_sessions} 堂 × NT${result.discount_per_session?.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-bold">應付總額</span>
                <span className="font-bold text-lg" style={{ color: 'var(--color-accent, #E8922D)' }}>
                  NT${result.total_price?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">付款方式</span>
                <span className="font-medium">到店付款</span>
              </div>
            </div>
          )}
        </div>
      ) : booking ? (
        /* Single booking — original layout */
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
            <div className="flex justify-between">
              <span className="text-gray-500">時長</span>
              <span className="font-medium">{booking.duration_minutes} 分鐘</span>
            </div>
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
            <div className="flex justify-between">
              <span className="text-gray-500">付款方式</span>
              <span className="font-medium">到店付款</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* 商家資訊卡片 */}
      {merchantInfo && (
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">商家資訊</h2>
          <div className="space-y-3 text-sm">
            {merchantInfo.address && (
              <div className="flex justify-between">
                <span className="text-gray-500">地址</span>
                <span className="font-medium text-right">{merchantInfo.address}</span>
              </div>
            )}
            {merchantInfo.google_map_url && (
              <a href={merchantInfo.google_map_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-500 hover:underline">
                在 Google Maps 開啟導航
              </a>
            )}
            {merchantInfo.phone && (
              <a href={`tel:${merchantInfo.phone.replace(/-/g, '')}`}
                className="flex items-center gap-2 text-green-700 hover:underline">
                {merchantInfo.phone}
              </a>
            )}
            {merchantInfo.line_oa_url && (
              <a href={merchantInfo.line_oa_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-500 hover:underline">
                加入 LINE 官方帳號
              </a>
            )}
          </div>
        </div>
      )}

      {/* 按鈕 */}
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
