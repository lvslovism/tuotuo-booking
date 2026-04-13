import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';

export default function SuccessPage() {
  const { merchantCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { merchant } = useMerchant();

  // API 回傳結構：{ booking: {...}, merchant: {...} }
  // BookingPage navigate 時帶 state: { bookingResult: result }
  const result = (location.state as any)?.bookingResult;
  const booking = result?.booking;
  const merchantInfo = result?.merchant;

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

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12" style={{ backgroundColor: 'var(--color-bg, #F8F6F3)' }}>
      {/* 成功圖示 */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-success, #7BAE7F)' }}>
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">預約成功！</h1>
      <p className="text-gray-500 mb-8">
        {merchant?.display_name || '商家'} 已收到您的預約，請準時到場。
      </p>

      {/* 預約明細卡片 */}
      {booking && (
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 mb-4">
          <h2 className="font-bold text-lg mb-4">預約明細</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">服務</span>
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
                <span className="text-gray-500">{merchant?.display_settings?.terminology?.provider || '服務人員'}</span>
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
      )}

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
                📍 在 Google Maps 開啟導航
              </a>
            )}
            {merchantInfo.phone && (
              <a href={`tel:${merchantInfo.phone.replace(/-/g, '')}`}
                className="flex items-center gap-2 text-green-700 hover:underline">
                📞 {merchantInfo.phone}
              </a>
            )}
            {merchantInfo.line_oa_url && (
              <a href={merchantInfo.line_oa_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-500 hover:underline">
                💬 加入 LINE 官方帳號
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
          查看我的預約
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
