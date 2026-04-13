import { useEffect, useState } from 'react';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { verifyIdentity, fetchMyBookings, cancelBooking, type BookingRecord } from '../api/booking-api';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { cn } from '../utils/cn';

export function MemberPage() {
  const { merchantCode, merchant } = useMerchant();
  const { isAuthenticated, token, setAuth } = useAuth();

  // Login form state
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Bookings state
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch bookings when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token || !merchantCode) return;
    setLoading(true);
    fetchMyBookings(token, merchantCode, tab)
      .then((data) => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, merchantCode, tab]);

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

  const handleCancel = async (bookingId: string) => {
    if (!token) return;
    if (!confirm('確定要取消此預約嗎？')) return;
    setCancellingId(bookingId);
    try {
      await cancelBooking(token, merchantCode, bookingId);
      // Refresh
      const data = await fetchMyBookings(token, merchantCode, tab);
      setBookings(data.bookings || []);
    } catch {
      alert('取消失敗，請稍後再試');
    } finally {
      setCancellingId(null);
    }
  };

  // Not logged in — show phone login
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-primary">會員中心</h1>
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
          <Button type="submit" variant="accent" size="lg" disabled={loggingIn}>
            {loggingIn ? '查詢中...' : '查詢預約'}
          </Button>
        </form>
      </div>
    );
  }

  // Logged in — show bookings
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary">我的{merchant?.terminology?.booking || '預約'}</h1>

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

      {loading ? (
        <Loading text="載入預約紀錄..." />
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-4xl mb-2">{tab === 'upcoming' ? '📅' : '📋'}</p>
          <p className="text-text-secondary text-sm">
            {tab === 'upcoming' ? '目前沒有即將到來的預約' : '尚無歷史紀錄'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              cancelling={cancellingId === b.id}
              onCancel={() => handleCancel(b.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({
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

      {booking.status === 'cancelled' && booking.cancellation_reason && (
        <p className="text-xs text-text-secondary">取消原因：{booking.cancellation_reason}</p>
      )}
    </div>
  );
}
