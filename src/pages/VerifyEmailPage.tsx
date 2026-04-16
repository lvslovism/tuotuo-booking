import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE = 'https://xfysiyqkasmloiosdyfs.supabase.co/functions/v1/merchant-register';

type Status = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [cmsUrl, setCmsUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('缺少驗證 token，請確認連結是否正確。');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}?action=verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setCmsUrl(data.cms_login_url || '');
        } else {
          setStatus('error');
          setErrorMsg(data.error || '驗證失敗，請稍後再試。');
        }
      } catch {
        setStatus('error');
        setErrorMsg('網路錯誤，請稍後再試。');
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <a href="/" className="text-lg font-bold text-[#3B6B5E]">妥妥預約</a>

        {status === 'loading' && (
          <div className="mt-10">
            <div className="mx-auto w-10 h-10 border-3 border-[#3B6B5E] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">驗證中...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-10">
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-[#3B6B5E]">Email 驗證成功</h1>
            <p className="mt-2 text-sm text-gray-500">你的帳號已啟用，可以開始使用妥妥預約。</p>
            {cmsUrl && (
              <a
                href={cmsUrl}
                className="mt-6 inline-block bg-[#3B6B5E] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2f5a4e] transition-colors"
              >
                前往 CMS 管理後台
              </a>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="mt-10">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-red-600">驗證失敗</h1>
            <p className="mt-2 text-sm text-gray-500">{errorMsg}</p>
            <a
              href="/"
              className="mt-6 inline-block text-[#3B6B5E] text-sm font-medium hover:underline"
            >
              回到首頁
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
