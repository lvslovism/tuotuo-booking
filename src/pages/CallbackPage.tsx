import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/ui/Loading';
import { getBookingReturn, setBookingReturn, clearBookingReturn } from '../lib/lineLogin';
import { createBooking } from '../api/booking-api';

const API_BASE = import.meta.env.VITE_API_BASE;
const LINE_LOGIN_STATE_KEY = 'line_login_state';

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

        // Phase 7 A3: confirm-401 recovery — if BookingPage tagged the return
        // payload with resubmit=true and full state, re-submit create-booking
        // here and skip BookingPage entirely on success.
        const returnPayload = getBookingReturn();
        const sessionToken = result.session_token as string;

        const hasResubmit = !!(
          returnPayload?.resubmit
          && returnPayload.serviceId
          && returnPayload.sessionSlots
          && returnPayload.sessionSlots.length > 0
          && returnPayload.guestInfo
        );

        if (hasResubmit) {
          try {
            const completeSlots = returnPayload!.sessionSlots!.filter((s) => s.date && s.time);
            const expected = returnPayload!.sessionCount ?? completeSlots.length;
            if (completeSlots.length !== expected) {
              throw new Error('SESSIONS_INCOMPLETE');
            }
            const guest = returnPayload!.guestInfo!;
            const companion = returnPayload!.companionInfo;
            const people = returnPayload!.people ?? 1;
            const bookingResult = await createBooking(sessionToken, merchantCode, {
              service_id: returnPayload!.serviceId!,
              sessions: completeSlots,
              people,
              customer_name: guest.name,
              customer_phone: guest.phone,
              customer_gender: guest.gender || undefined,
              ...(returnPayload!.staffId ? { resource_id: returnPayload!.staffId } : {}),
              ...(people >= 2 && companion?.name
                ? { companion_name: companion.name, companion_gender: companion.gender || undefined }
                : {}),
            });
            clearBookingReturn();
            navigate(`/s/${merchantCode}/success`, {
              replace: true,
              state: { bookingResult },
            });
            return;
          } catch (resubmitErr) {
            // Auto-resubmit failed — strip the resubmit flag, keep state, send the
            // user back to BookingPage's confirm step so they can retry manually.
            console.error('A3 auto-resubmit failed:', resubmitErr);
            const keep = { ...returnPayload! };
            delete keep.resubmit;
            setBookingReturn(keep);
            navigate(`/s/${merchantCode}?restored=true`, { replace: true });
            return;
          }
        }

        // Default: honour redirect_path / fall back to BookingPage restore or MemberPage.
        const hasReturn = !!returnPayload;
        const hasBookingState = !!(returnPayload?.serviceId && returnPayload?.date && returnPayload?.time);
        const target = (() => {
          if (returnPayload?.redirect_path) {
            const sep = returnPayload.redirect_path.includes('?') ? '&' : '?';
            return hasBookingState
              ? `${returnPayload.redirect_path}${sep}restored=true`
              : returnPayload.redirect_path;
          }
          if (hasReturn) return `/s/${merchantCode}?restored=true`;
          return `/s/${merchantCode}/member`;
        })();
        navigate(target, { replace: true });
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
