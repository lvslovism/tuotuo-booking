import { Link } from 'react-router-dom';
import { useMerchant } from '../../hooks/useMerchant';
import { useTheme } from '../../hooks/useTheme';

export function Navbar() {
  const { merchant, merchantCode } = useMerchant();
  const { template } = useTheme();
  const base = `/s/${merchantCode}`;
  const showServicesTab = merchant?.display_settings?.show_services_tab !== false;

  if (template === 'zen') {
    const code = (merchant?.merchant_code || merchantCode || '').toUpperCase();
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ background: 'color-mix(in srgb, var(--t-bg) 85%, transparent)' }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to={base}
            className="text-xs tracking-[0.3em] font-medium"
            style={{ color: 'var(--t-primary)', fontFamily: 'var(--t-font-title)' }}
          >
            {code || 'BOOKING'}
          </Link>
          <div className="flex items-center gap-4 text-xs tracking-[0.15em]">
            <NavLink to={base}>預約</NavLink>
            {showServicesTab && (
              <NavLink to={`${base}/services`}>{merchant?.terminology?.service || '服務'}</NavLink>
            )}
            <NavLink to={`${base}/member`}>會員</NavLink>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--t-line)', opacity: 0.6 }} />
      </nav>
    );
  }

  // warm — branded green rounded header
  return (
    <nav className="sticky top-0 z-50 pt-2 px-3" style={{ background: 'var(--t-bg)' }}>
      <div
        className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between rounded-2xl"
        style={{
          backgroundColor: 'var(--t-primary)',
          boxShadow: '0 2px 12px rgba(59,107,94,0.18)',
          color: '#fff',
        }}
      >
        <Link to={base} className="flex items-center gap-2 font-semibold text-base truncate max-w-[200px]">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {(merchant?.display_name || 'M').slice(0, 1)}
          </span>
          <span className="truncate">{merchant?.display_name || '載入中...'}</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <WarmLink to={base}>預約</WarmLink>
          {showServicesTab && (
            <WarmLink to={`${base}/services`}>{merchant?.terminology?.service || '服務'}</WarmLink>
          )}
          <WarmLink to={`${base}/member`}>會員</WarmLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="transition-colors"
      style={{ color: 'var(--t-sub)' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--t-primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t-sub)')}
    >
      {children}
    </Link>
  );
}

function WarmLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-2.5 py-1 rounded-lg transition-colors"
      style={{ color: 'rgba(255,255,255,0.85)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </Link>
  );
}
