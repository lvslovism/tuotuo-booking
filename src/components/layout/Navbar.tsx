import { Link } from 'react-router-dom';
import { useMerchant } from '../../hooks/useMerchant';

export function Navbar() {
  const { merchant, merchantCode } = useMerchant();
  const base = `/s/${merchantCode}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link to={base} className="font-bold text-primary text-lg truncate max-w-[200px]">
          {merchant?.display_name || '載入中...'}
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to={base}
            className="px-3 py-1.5 text-sm text-primary/70 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            預約
          </Link>
          <Link
            to={`${base}/services`}
            className="px-3 py-1.5 text-sm text-primary/70 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            {merchant?.terminology?.service || '服務'}
          </Link>
          <Link
            to={`${base}/member`}
            className="px-3 py-1.5 text-sm text-primary/70 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            會員
          </Link>
        </div>
      </div>
    </nav>
  );
}
