import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import {
  verifyIdentity,
  fetchMyBookings,
  cancelBooking,
  fetchCustomerPortal,
  type BookingRecord,
  type CustomerPortalResponse,
} from '../api/booking-api';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { cn } from '../utils/cn';

// ============================================================
// Lifecycle badge mapping
// ============================================================
const LIFECYCLE_MAP: Record<string, { label: string; icon: string }> = {
  new: { label: '新朋友', icon: '🌱' },
  active: { label: '活躍', icon: '⭐' },
  returning: { label: '回訪', icon: '🔄' },
  loyal: { label: '忠實', icon: '🏆' },
  at_risk: { label: '待喚回', icon: '⚠️' },
  churned: { label: '流失', icon: '💤' },
};

// ============================================================
// MemberPage
// ============================================================
export function MemberPage() {
  const { merchantCode, merchant } = useMerchant();
  const { isAuthenticated, token, mode, setAuth } = useAuth();
  const navigate = useNavigate();

  // Login
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Portal data
  const [portal, setPortal] = useState<CustomerPortalResponse | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');

  // Fallback bookings (for guest mode without line_user_id)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Try portal first, fallback to bookings
  useEffect(() => {
    if (!isAuthenticated || !token || !merchantCode) return;

    setPortalLoading(true);
    setPortalError('');
    fetchCustomerPortal(token, merchantCode)
      .then((data) => {
        if (data.error) {
          // Fallback for guest users without LINE binding
          setPortalError(data.error === 'NO_LINE_USER' ? 'guest_fallback' : data.error);
        } else {
          setPortal(data);
        }
      })
      .catch(() => setPortalError('guest_fallback'))
      .finally(() => setPortalLoading(false));
  }, [isAuthenticated, token, merchantCode]);

  // Fallback: load bookings for guest mode
  useEffect(() => {
    if (portalError !== 'guest_fallback' || !token || !merchantCode) return;
    setBookingsLoading(true);
    fetchMyBookings(token, merchantCode, tab)
      .then((data) => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [portalError, token, merchantCode, tab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^09\d{8}$/.test(phone.trim())) {
      setLoginError('請輸入有效的手機號碼（09開頭10碼）');
      return;
    }
    setLoggingIn(true);
    setLoginError('');
    try {
      const result = await verifyIdentity(merchantCode, {
        mode: 'guest',
        name: '',
        phone: phone.trim(),
        gender: 'male',
      });
      setAuth(result.session_token, {
        id: result.customer.id,
        name: result.customer.name,
        phone: result.customer.phone,
      }, 'guest');
    } catch (err: any) {
      setLoginError(err.message === 'CUSTOMER_NOT_FOUND' ? '查無此手機號碼的預約紀錄' : '登入失敗，請稍後再試');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLineLogin = () => {
    const channelId = merchant?.line_login_channel_id;
    if (!channelId) return;
    const redirectUri = `${window.location.origin}/s/${merchantCode}/callback`;
    const state = Math.random().toString(36).slice(2);
    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=profile%20openid`;
    window.location.href = url;
  };

  const handleCancel = async (bookingId: string) => {
    if (!token) return;
    if (!confirm('確定要取消此預約嗎？')) return;
    setCancellingId(bookingId);
    try {
      await cancelBooking(token, merchantCode, bookingId);
      // Refresh portal
      const data = await fetchCustomerPortal(token, merchantCode);
      if (!data.error) setPortal(data);
    } catch {
      alert('取消失敗，請稍後再試');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelFallback = async (bookingId: string) => {
    if (!token) return;
    if (!confirm('確定要取消此預約嗎？')) return;
    setCancellingId(bookingId);
    try {
      await cancelBooking(token, merchantCode, bookingId);
      const data = await fetchMyBookings(token, merchantCode, tab);
      setBookings(data.bookings || []);
    } catch {
      alert('取消失敗，請稍後再試');
    } finally {
      setCancellingId(null);
    }
  };

  // ── Not logged in ──
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-primary">會員中心</h1>

        {/* LINE Login (primary CTA) */}
        {merchant?.line_login_channel_id && (
          <button
            onClick={handleLineLogin}
            className="w-full flex items-center justify-center gap-2 bg-[#06C755] text-white font-medium py-3 rounded-xl hover:brightness-110 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            LINE 登入
          </button>
        )}

        {/* Divider */}
        {merchant?.line_login_channel_id && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-text-secondary">或</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}

        {/* Phone login */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <p className="text-sm text-text-secondary">
            輸入預約時使用的手機號碼，查看您的預約紀錄
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              maxLength={10}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors',
                loginError ? 'border-red-400' : 'border-gray-200 focus:border-primary',
              )}
            />
            {loginError && <p className="text-xs text-red-500 mt-1">{loginError}</p>}
          </div>
          <Button type="submit" variant="outline" size="lg" disabled={loggingIn}>
            {loggingIn ? '查詢中...' : '手機號碼查詢'}
          </Button>
        </form>
      </div>
    );
  }

  // ── Loading ──
  if (portalLoading) {
    return <Loading text="載入會員資料..." />;
  }

  // ── Guest fallback (no LINE binding) ──
  if (portalError === 'guest_fallback') {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-primary">我的{merchant?.terminology?.booking || '預約'}</h1>

        {/* Upgrade prompt */}
        {merchant?.line_login_channel_id && (
          <div className="bg-gradient-to-r from-[#06C755]/10 to-[#06C755]/5 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">使用 LINE 登入，解鎖完整會員中心</p>
            <p className="text-xs text-text-secondary">查看累積卡、儲值卡、套券等更多資訊</p>
            <button
              onClick={handleLineLogin}
              className="mt-1 flex items-center gap-1.5 bg-[#06C755] text-white text-sm font-medium px-4 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              LINE 登入升級
            </button>
          </div>
        )}

        {/* Tab toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                tab === t ? 'bg-white text-primary shadow-sm' : 'text-text-secondary',
              )}
            >
              {t === 'upcoming' ? '即將到來' : '歷史紀錄'}
            </button>
          ))}
        </div>

        {bookingsLoading ? (
          <Loading text="載入預約紀錄..." />
        ) : bookings.length === 0 ? (
          <EmptyState icon={tab === 'upcoming' ? '📅' : '📋'} text={tab === 'upcoming' ? '目前沒有即將到來的預約' : '尚無歷史紀錄'} />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <FallbackBookingCard
                key={b.id}
                booking={b}
                cancelling={cancellingId === b.id}
                onCancel={() => handleCancelFallback(b.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Portal error ──
  if (portalError || !portal) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-primary">會員中心</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-text-secondary text-sm">{portalError || '載入失敗，請重試'}</p>
        </div>
      </div>
    );
  }

  // ── Full portal view ──
  const { customer, upcoming_bookings, loyalty_card, stored_value, packages, recent_visits } = portal;
  const lifecycle = LIFECYCLE_MAP[customer.lifecycle_stage] || { label: customer.lifecycle_stage, icon: '👤' };
  const memberSince = new Date(customer.member_since).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });

  return (
    <div className="space-y-4 pb-8">
      {/* ── Customer Header ── */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{customer.name || 'LINE 會員'}</h2>
          <span className="text-sm bg-white/80 px-2.5 py-1 rounded-full font-medium text-primary">
            {lifecycle.icon} {lifecycle.label}
          </span>
        </div>
        <p className="text-xs text-text-secondary">會員 since {memberSince}</p>
        <div className="flex gap-4 text-sm text-gray-600 pt-1">
          <span>累計到訪 <strong className="text-gray-800">{customer.total_visits}</strong> 次</span>
          <span>累計消費 <strong className="text-accent">NT${(customer.total_spent || 0).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* ── Upcoming Bookings ── */}
      <Section title="即將到來的預約" icon="📅">
        {upcoming_bookings.length === 0 ? (
          <EmptyState icon="📅" text="目前沒有即將到來的預約" />
        ) : (
          <div className="space-y-3">
            {upcoming_bookings.map((b) => (
              <PortalBookingCard
                key={b.id}
                booking={b}
                merchantCode={merchantCode}
                cancelling={cancellingId === b.id}
                onCancel={() => handleCancel(b.id)}
                onReschedule={() => navigate(`/s/${merchantCode}/reschedule?id=${b.id}`)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── Loyalty Card ── */}
      {loyalty_card && loyalty_card.is_active && (
        <Section title="累積卡" icon="🎯">
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {loyalty_card.current_stamps} / {loyalty_card.required_stamps}
              </span>
              {loyalty_card.rewards_earned > 0 && (
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                  已兌換 {loyalty_card.rewards_earned} 次
                </span>
              )}
            </div>
            {/* Progress bar */}
            <div className="flex gap-1.5">
              {Array.from({ length: loyalty_card.required_stamps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-3 flex-1 rounded-full transition-colors',
                    i < loyalty_card.current_stamps ? 'bg-accent' : 'bg-gray-200',
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-text-secondary">
              再 {loyalty_card.required_stamps - loyalty_card.current_stamps} 次即可兌換獎勵
            </p>
          </div>
        </Section>
      )}

      {/* ── Stored Value ── */}
      {stored_value && (
        <Section title="儲值卡" icon="💳">
          <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                NT${(stored_value.balance || 0).toLocaleString()}
              </p>
              {stored_value.expires_at && (
                <p className="text-xs text-text-secondary mt-1">
                  有效期限：{new Date(stored_value.expires_at).toLocaleDateString('zh-TW')}
                </p>
              )}
            </div>
            {stored_value.card_number && (
              <span className="text-xs text-text-secondary font-mono">{stored_value.card_number}</span>
            )}
          </div>
        </Section>
      )}

      {/* ── Packages ── */}
      {packages.length > 0 && (
        <Section title="套券" icon="📦">
          <div className="space-y-2">
            {packages.map((pkg, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-800">{pkg.name}</h4>
                  <span className="text-xs text-text-secondary">
                    剩 <strong className="text-primary">{pkg.remaining_sessions}</strong> / {pkg.total_sessions} 堂
                  </span>
                </div>
                {/* Mini progress */}
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(pkg.remaining_sessions / pkg.total_sessions) * 100}%` }}
                  />
                </div>
                {pkg.expires_at && (
                  <p className="text-xs text-text-secondary">
                    到期：{new Date(pkg.expires_at).toLocaleDateString('zh-TW')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Recent Visits ── */}
      {recent_visits.length > 0 && (
        <Section title="最近到訪" icon="📋">
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-50">
            {recent_visits.map((v, i) => {
              const d = new Date(v.date);
              const dateStr = d.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
              return (
                <div key={i} className="px-4 py-3 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-700">{dateStr}</span>
                    <span className="text-sm text-gray-500 ml-2">{v.service}</span>
                    {v.resource && <span className="text-xs text-text-secondary ml-1">— {v.resource}</span>}
                  </div>
                  <span className="text-sm font-medium text-accent">
                    NT${(v.total_price || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <p className="text-4xl mb-2">{icon}</p>
      <p className="text-text-secondary text-sm">{text}</p>
    </div>
  );
}

function PortalBookingCard({
  booking,
  merchantCode,
  cancelling,
  onCancel,
  onReschedule,
}: {
  booking: CustomerPortalResponse['upcoming_bookings'][0];
  merchantCode: string;
  cancelling: boolean;
  onCancel: () => void;
  onReschedule: () => void;
}) {
  const dt = new Date(booking.start_time);
  const dateStr = dt.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short', timeZone: 'Asia/Taipei' });
  const timeStr = dt.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei' });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-800">{booking.service_name}</h4>
          {booking.resource_name && (
            <p className="text-xs text-text-secondary">{booking.resource_name}</p>
          )}
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          {booking.status === 'confirmed' ? '已確認' : '待確認'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>📅 {dateStr}</span>
        <span>🕐 {timeStr}</span>
        {booking.total_price > 0 && (
          <span className="text-accent font-medium">NT${booking.total_price.toLocaleString()}</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onReschedule}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          改期
        </button>
        <button
          onClick={onCancel}
          disabled={cancelling}
          className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
        >
          {cancelling ? '取消中...' : '取消'}
        </button>
      </div>
    </div>
  );
}

function FallbackBookingCard({
  booking,
  cancelling,
  onCancel,
}: {
  booking: BookingRecord;
  cancelling: boolean;
  onCancel: () => void;
}) {
  const dt = new Date(booking.start_time);
  const dateStr = dt.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short', timeZone: 'Asia/Taipei' });
  const timeStr = dt.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei' });

  const statusMap: Record<string, { label: string; color: string }> = {
    confirmed: { label: '已確認', color: 'bg-green-100 text-green-700' },
    pending: { label: '待確認', color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: '已完成', color: 'bg-gray-100 text-gray-600' },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-600' },
    no_show: { label: '未到', color: 'bg-red-100 text-red-600' },
  };
  const st = statusMap[booking.status] || { label: booking.status, color: 'bg-gray-100 text-gray-600' };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-800">{booking.service_name}</h3>
          {booking.resource_name && (
            <p className="text-xs text-text-secondary">{booking.resource_name}</p>
          )}
        </div>
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', st.color)}>
          {st.label}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>📅 {dateStr}</span>
        <span>🕐 {timeStr}</span>
        <span className="text-accent font-medium">NT${booking.final_price}</span>
      </div>
      {booking.can_cancel && (
        <button
          onClick={onCancel}
          disabled={cancelling}
          className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
        >
          {cancelling ? '取消中...' : '取消預約'}
        </button>
      )}
    </div>
  );
}
