import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { useAuth } from '../hooks/useAuth';
import { verifyIdentity } from '../api/booking-api';
import { Loading } from '../components/ui/Loading';

export function CallbackPage() {
  const { merchantCode } = useMerchant();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || !merchantCode) {
      setError('缺少必要的登入參數');
      return;
    }

    const redirectUri = `${window.location.origin}/s/${merchantCode}/callback`;

    verifyIdentity(merchantCode, {
      mode: 'line_login',
      code,
      redirect_uri: redirectUri,
    })
      .then((result) => {
        setAuth(result.session_token, {
          id: result.customer.id,
          name: result.customer.name,
          phone: result.customer.phone,
        }, 'line_login');
        navigate(`/s/${merchantCode}/member`, { replace: true });
      })
      .catch(() => {
        setError('LINE 登入失敗，請重試');
      });
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
