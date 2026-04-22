import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/ui/Loading';

const API_BASE = import.meta.env.VITE_API_BASE;
const LINE_LOGIN_STATE_KEY = 'line_login_state';
const BOOKING_RETURN_KEY = 'wb_booking_return';

export function CallbackPage() {
  const { merchantCode } = useMerchant();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const returnedState = searchParams.get('state');
    if (!code || !merchantCode) {
      setError('缺少必要的登入參數');
      return;
    }

    if (calledRef.current) return;
    calledRef.current = true;

    // CSRF: compare state against the one we stored before redirecting.
    // Tolerate missing saved state for legacy sessions (old code didn't save it).
    let savedState: string | null = null;
    try {
      savedState = sessionStorage.getItem(LINE_LOGIN_STATE_KEY);
    } catch { /* ignore */ }
    if (savedState && returnedState && savedState !== returnedState) {
      setError('登入驗證失敗，請重試');
      try { sessionStorage.removeItem(LINE_LOGIN_STATE_KEY); } catch { /* ignore */ }
      return;
    }
    try { sessionStorage.removeItem(LINE_LOGIN_STATE_KEY); } catch { /* ignore */ }

    const redirectUri = `${window.location.origin}/s/${merchantCode}/callback`;

    (async () => {
      try {
        const resp = await fetch(`${API_BASE}?action=verify-identity&m=${merchantCode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'line_login',
            code,
            redirect_uri: redirectUri,
            merchant_code: merchantCode,
          }),
        });
        const text = await resp.text();
        if (!resp.ok) {
          console.error('verify-identity response:', resp.status, text);
          setError('LINE 登入失敗，請重試');
          return;
        }
        const result = JSON.parse(text);
        setAuth(result.session_token, {
          id: result.customer.id,
          name: result.customer.name,
          phone: result.customer.phone,
          gender: result.customer.gender,
          line_user_id: result.customer.line_user_id,
        }, 'line_login');

        // If a booking flow was mid-stream, return to booking page so it can restore.
        let hasReturn = false;
        try {
          hasReturn = !!sessionStorage.getItem(BOOKING_RETURN_KEY);
        } catch { /* ignore */ }
        navigate(
          hasReturn ? `/s/${merchantCode}?restored=true` : `/s/${merchantCode}/member`,
          { replace: true },
        );
      } catch (e) {
        console.error('verify-identity exception:', e);
        setError('LINE 登入失敗，請重試');
      }
    })();
  }, [merchantCode, searchParams, setAuth, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(`/s/${merchantCode}`)}
          className="text-sm text-primary hover:underline"
        >
          回到首頁
        </button>
      </div>
    );
  }

  return <Loading text="LINE 登入處理中..." />;
}
