import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMerchant } from '../../hooks/useMerchant';
import { startLineLogin } from '../../lib/lineLogin';
import { Loading } from '../ui/Loading';

// ============================================================
// AuthGuard — Phase 7 A1
// ============================================================
// Wraps any route that requires LINE Login. Behaviour:
//   1. Wait for MerchantProvider to finish loading (need line_login_channel_id).
//   2. If authenticated → render children.
//   3. If not authenticated → write redirect intent into wb_booking_return and
//      bounce to LINE Login (CSRF nonce in OAuth state via lib/lineLogin).
//   4. If merchant has no line_login_channel_id → show fallback message.
interface Props {
  children: ReactNode;
}

export function AuthGuard({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const { merchant, merchantCode, loading } = useMerchant();
  const location = useLocation();

  useEffect(() => {
    if (loading || !merchant) return;
    if (isAuthenticated) return;
    const channelId = merchant.line_login_channel_id;
    if (!channelId) return;
    // Preserve the path the user was trying to reach so callback can return them here.
    startLineLogin(channelId, merchantCode, {
      redirect_path: location.pathname + location.search,
    });
  }, [loading, merchant, merchantCode, isAuthenticated, location.pathname, location.search]);

  if (loading || !merchant) {
    return <Loading text="載入中..." />;
  }

  if (!isAuthenticated) {
    if (!merchant.line_login_channel_id) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 px-4 text-center">
          <p className="text-sm" style={{ color: 'var(--t-sub)' }}>
            此商家尚未設定 LINE 登入，無法使用線上預約。
          </p>
        </div>
      );
    }
    return <Loading text="LINE 登入中..." />;
  }

  return <>{children}</>;
}
