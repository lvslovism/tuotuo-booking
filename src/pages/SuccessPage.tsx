import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import type { CreateBookingResponse, GroupBookingItem } from '../api/booking-api';

export default function SuccessPage() {
  const { merchantCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { merchant } = useMerchant();
  const { customer } = useAuth();
  const { template } = useTheme();

  // Guest = no LINE identity yet. Show an "add LINE friend" CTA so they can receive reminders.
  const isGuest = !customer?.line_user_id;
  const lineOaUrl = merchant?.line_oa_url;

  const result = (location.state as { bookingResult?: CreateBookingResponse })?.bookingResult;
  const booking = result?.booking;
  const bookings = result?.bookings;
  const merchantInfo = result?.merchant;
  const isGroup = (result?.total_sessions ?? 1) > 1;

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
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12 theme-enter"
      style={{ backgroundColor: 'var(--t-bg)' }}
    >
      {/* Success icon: zen = outline circle; warm = solid green */}
      {template === 'zen' ? (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ border: '1.5px solid var(--t-primary)' }}
        >
          <svg
            className="w-9 h-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="var(--t-primary)"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--t-success)', boxShadow: '0 8px 24px rgba(74,155,110,0.3)' }}
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <h1
        className="theme-title mb-1"
        style={{ fontSize: template === 'zen' ? '1.5rem' : '1.6rem' }}
      >
        {template === 'zen' ? `${terminology?.booking || '預約'}已確認` : `${terminology?.booking || '預約'}成功！🎉`}
      </h1>
      <div className="theme-gold-divider mb-4" />
      <p className="mb-8 text-center" style={{ color: 'var(--t-sub)' }}>
        {isGroup && bookings && bookings.length > 1
          ? `您和同行者的${terminology?.booking || '預約'}已確認，請準時到場。`
          : `${merchant?.display_name || '商家'} 已收到您的${terminology?.booking || '預約'}，請準時到場。`}
      </p>

      {isGroup && bookings && bookings.length > 1 ? (
        <div className="w-full max-w-md theme-card p-6 mb-4">
          <h2 className="theme-title text-lg mb-4">{terminology?.booking || '預約'}明細</h2>
          <div className="space-y-3">
            {bookings.map((b: GroupBookingItem, idx: number) => (
              <div
                key={b.id || idx}
                className="flex items-center justify-between text-sm py-2"
                style={{ borderBottom: idx < bookings.length - 1 ? '1px solid var(--t-line)' : 'none' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium"
                    style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}
                  >
                    {b.group_index || idx + 1}
                  </span>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--t-text)' }}>{b.customer_name}</p>
                    <p className="text-xs" style={{ color: 'var(--t-sub)' }}>
                      {formatDate(b.start_time)} · {b.resource_name}
                    </p>
                  </div>
                </div>
                <span className="font-medium" style={{ color: 'var(--t-accent)' }}>
                  NT${b.final_price?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {result && (
            <div className="pt-3 mt-3 space-y-2" style={{ borderTop: '1px solid var(--t-line)' }}>
              {result.discount_per_session > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--t-success)' }}>同行優惠</span>
                  <span style={{ color: 'var(--t-success)' }}>
                    -{result.total_sessions} 堂 × NT${result.discount_per_session?.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-bold" style={{ color: 'var(--t-text)' }}>應付總額</span>
                <span className="theme-price text-lg">
                  NT${result.total_price?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--t-sub)' }}>付款方式</span>
                <span style={{ color: 'var(--t-text)' }}>到店付款</span>
              </div>
            </div>
          )}
        </div>
      ) : booking ? (
        <div className="w-full max-w-md theme-card p-6 mb-4">
          <h2 className="theme-title text-lg mb-4">{terminology?.booking || '預約'}明細</h2>
          <div className="space-y-3 text-sm">
            <Row label={terminology?.service || '服務'} value={booking.service_name} />
            <Row label="日期時間" value={formatDate(booking.start_time)} />
            <Row label="時長" value={`${booking.duration_minutes} 分鐘`} />
            {booking.resource_name && (
              <Row label={terminology?.provider || '服務人員'} value={booking.resource_name} />
            )}
            <div className="pt-3 flex justify-between" style={{ borderTop: '1px solid var(--t-line)' }}>
              <span className="font-bold" style={{ color: 'var(--t-text)' }}>費用</span>
              <span className="theme-price">
                NT${booking.final_price?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--t-sub)' }}>付款方式</span>
              <span style={{ color: 'var(--t-text)' }}>到店付款</span>
            </div>
          </div>
        </div>
      ) : null}

      {merchantInfo && (
        <div className="w-full max-w-md theme-card p-6 mb-6">
          <h2 className="theme-title text-lg mb-4">商家資訊</h2>
          <div className="space-y-3 text-sm">
            {merchantInfo.address && (
              <Row label="地址" value={merchantInfo.address} />
            )}
            {merchantInfo.google_map_url && (
              <a
                href={merchantInfo.google_map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
                style={{ color: '#E05E5E' }}
              >
                在 Google Maps 開啟導航
              </a>
            )}
            {merchantInfo.phone && (
              <a
                href={`tel:${merchantInfo.phone.replace(/-/g, '')}`}
                className="flex items-center gap-2 hover:underline"
                style={{ color: 'var(--t-primary)' }}
              >
                {merchantInfo.phone}
              </a>
            )}
            {merchantInfo.line_oa_url && (
              <a
                href={merchantInfo.line_oa_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
                style={{ color: '#4CC764' }}
              >
                加入 LINE 官方帳號
              </a>
            )}
          </div>
        </div>
      )}

      {isGuest && lineOaUrl && (
        <div
          className="w-full max-w-md mb-4 p-5 text-center"
          style={{
            background: 'rgba(6, 199, 85, 0.08)',
            border: '1px solid rgba(6, 199, 85, 0.25)',
            borderRadius: 'var(--t-card-radius, 14px)',
          }}
        >
          <p className="text-sm mb-3" style={{ color: 'var(--t-text)' }}>
            加入 LINE 好友即可收到<br />預約提醒與最新消息
          </p>
          <a
            href={lineOaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-medium text-white hover:brightness-110 transition-all"
            style={{
              backgroundColor: '#06C755',
              minHeight: '44px',
              padding: '10px 22px',
              borderRadius: 'var(--t-btn-radius)',
            }}
          >
            加入 LINE 好友
          </a>
        </div>
      )}

      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => navigate(`/s/${merchantCode}/member`)}
          className="theme-cta w-full"
        >
          查看我的{terminology?.booking || '預約'}
        </button>
        <button
          onClick={() => navigate(`/s/${merchantCode}`)}
          className="theme-btn-outline w-full"
        >
          回到首頁
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--t-sub)' }}>{label}</span>
      <span className="font-medium text-right" style={{ color: 'var(--t-text)' }}>{value}</span>
    </div>
  );
}
