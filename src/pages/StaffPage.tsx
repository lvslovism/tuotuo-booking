import { useEffect, useState, useCallback } from 'react';
import { useMerchant } from '../hooks/useMerchant';
import { useMerchantTerminology } from '../hooks/useMerchantTerminology';
import { fetchStaffPerformance, type StaffPerformanceResponse, type StaffScheduleItem } from '../api/booking-api';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { cn } from '../utils/cn';

// LIFF SDK types (loaded via CDN)
declare global {
  interface Window {
    liff?: {
      init: (config: { liffId: string }) => Promise<void>;
      isLoggedIn: () => boolean;
      login: () => void;
      getProfile: () => Promise<{ userId: string; displayName: string; pictureUrl?: string }>;
      getAccessToken: () => string | null;
      isInClient: () => boolean;
    };
  }
}

type Period = 'today' | 'week' | 'month';

const PERIOD_LABELS: Record<Period, string> = {
  today: '今日',
  week: '本週',
  month: '本月',
};

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatStatus(status: string): { label: string; color: string } {
  switch (status) {
    case 'confirmed': return { label: '待服務', color: 'bg-blue-100 text-blue-700' };
    case 'completed': return { label: '已完成', color: 'bg-green-100 text-green-700' };
    case 'no_show': return { label: '未到', color: 'bg-red-100 text-red-700' };
    case 'pending': return { label: '待確認', color: 'bg-yellow-100 text-yellow-700' };
    default: return { label: status, color: 'bg-gray-100 text-gray-700' };
  }
}

export function StaffPage() {
  const { merchantCode, merchant } = useMerchant();
  const t = useMerchantTerminology();

  const [liffReady, setLiffReady] = useState(false);
  const [liffError, setLiffError] = useState('');
  const [lineUserId, setLineUserId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [liffToken, setLiffToken] = useState('');

  const [period, setPeriod] = useState<Period>('month');
  const [data, setData] = useState<StaffPerformanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load LIFF SDK
  useEffect(() => {
    const liffId = merchant?.line_liff_id;
    if (!liffId) return;

    // Load LIFF SDK from CDN if not already loaded
    if (window.liff) {
      initLiff(liffId);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
    script.onload = () => initLiff(liffId);
    script.onerror = () => setLiffError('LIFF SDK 載入失敗');
    document.head.appendChild(script);
  }, [merchant?.line_liff_id]);

  async function initLiff(liffId: string) {
    try {
      await window.liff!.init({ liffId });

      if (!window.liff!.isLoggedIn()) {
        window.liff!.login();
        return;
      }

      const profile = await window.liff!.getProfile();
      setLineUserId(profile.userId);
      setAvatarUrl(profile.pictureUrl || '');
      setLiffToken(window.liff!.getAccessToken() || '');
      setLiffReady(true);
    } catch (err) {
      console.error('LIFF init error:', err);
      setLiffError('LINE 認證失敗，請重新開啟');
    }
  }

  // Fetch performance data
  const fetchData = useCallback(async () => {
    if (!lineUserId || !merchantCode) return;
    setLoading(true);
    setError('');
    try {
      const result = await fetchStaffPerformance(merchantCode, lineUserId, period, liffToken);
      if (result.error) {
        setError(result.error === 'STAFF_NOT_FOUND'
          ? `找不到您的${t.provider}帳號，請聯繫管理員設定 LINE 綁定`
          : String(result.error));
        return;
      }
      setData(result);
    } catch (err: unknown) {
      setError((err as Error).message || '載入失敗');
    } finally {
      setLoading(false);
    }
  }, [lineUserId, merchantCode, period, liffToken]);

  useEffect(() => {
    if (liffReady) fetchData();
  }, [liffReady, fetchData]);

  // ─── Not in LIFF / Loading ─────────────────────────────
  if (!merchant?.line_liff_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-5xl">🔒</div>
        <h1 className="text-xl font-bold text-gray-800">{t.provider}績效面板</h1>
        <p className="text-text-secondary text-sm text-center">
          請透過 LINE 內嵌瀏覽器開啟此頁面
        </p>
      </div>
    );
  }

  if (liffError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-5xl">😢</div>
        <p className="text-red-600 text-sm text-center">{liffError}</p>
      </div>
    );
  }

  if (!liffReady) {
    return <Loading text="LINE 認證中..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-5xl">😢</div>
        <p className="text-red-600 text-sm text-center">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchData}>重試</Button>
      </div>
    );
  }

  if (loading && !data) {
    return <Loading text="載入績效資料..." />;
  }

  if (!data) return null;

  const perf = data.performance;
  const schedule = data.today_schedule;

  return (
    <div className="space-y-5 pb-8">
      {/* ─── Staff Header ─────────────────────────────── */}
      <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
            {data.resource.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold text-gray-900">{data.resource.name}</h1>
          {data.resource.title && (
            <p className="text-sm text-text-secondary">{data.resource.title}</p>
          )}
        </div>
      </div>

      {/* ─── Period Selector ──────────────────────────── */}
      <div className="flex gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'flex-1 py-2 rounded-full text-sm font-medium transition-all',
              period === p
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* ─── Stats Cards ──────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="完成預約" value={String(perf.completed_bookings)} unit="筆" accent={false} />
          <StatCard label="未到" value={String(perf.no_show_bookings)} unit="筆" accent={false} warn={perf.no_show_bookings > 0} />
          <StatCard label="營收" value={`$${perf.total_revenue?.toLocaleString() || 0}`} unit="" accent />
          <StatCard label="佣金" value={`$${perf.commission_earned?.toLocaleString() || 0}`} unit="" accent />
        </div>
      )}

      {/* ─── Today's Schedule ─────────────────────────── */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">
          今日排程
          <span className="ml-2 text-sm font-normal text-text-secondary">
            {schedule.length} 位客人
          </span>
        </h2>

        {schedule.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl mb-2">☕</div>
            <p className="text-text-secondary text-sm">今日沒有預約</p>
          </div>
        ) : (
          <div className="space-y-2">
            {schedule.map((item) => (
              <ScheduleCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  accent,
  warn,
}: {
  label: string;
  value: string;
  unit: string;
  accent: boolean;
  warn?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      <p className={cn(
        'text-2xl font-bold',
        warn ? 'text-red-500' : accent ? 'text-primary' : 'text-gray-900'
      )}>
        {value}
        {unit && <span className="text-sm font-normal text-text-secondary ml-1">{unit}</span>}
      </p>
    </div>
  );
}

function ScheduleCard({ item }: { item: StaffScheduleItem }) {
  const st = formatStatus(item.status);
  const now = new Date();
  const start = new Date(item.start_time);
  const end = new Date(item.end_time);
  const isCurrent = now >= start && now <= end;

  return (
    <div className={cn(
      'bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 border-l-4 transition-all',
      isCurrent ? 'border-l-accent bg-accent/5' : 'border-l-transparent'
    )}>
      {/* Time */}
      <div className="text-center min-w-[52px]">
        <p className="text-sm font-bold text-gray-900">{formatTime(item.start_time)}</p>
        <p className="text-xs text-text-secondary">{formatTime(item.end_time)}</p>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.customer_name}</p>
        <p className="text-xs text-text-secondary truncate">{item.service_name} · {item.duration_minutes}分</p>
      </div>

      {/* Status badge */}
      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', st.color)}>
        {st.label}
      </span>
    </div>
  );
}
