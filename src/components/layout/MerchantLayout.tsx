import { Outlet } from 'react-router-dom';
import { MerchantProvider } from '../../providers/MerchantProvider';
import { AuthProvider } from '../../providers/AuthProvider';
import { useMerchant } from '../../hooks/useMerchant';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Loading } from '../ui/Loading';

function MerchantContent() {
  const { loading, error, merchant } = useMerchant();

  if (loading) {
    return <Loading text="載入商家資料..." />;
  }

  if (error || !merchant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-5xl">😢</div>
        <h1 className="text-xl font-bold text-gray-800">找不到此商家</h1>
        <p className="text-text-secondary text-sm text-center">
          請確認網址是否正確，或聯繫商家取得預約連結。
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function MerchantLayout() {
  return (
    <MerchantProvider>
      <AuthProvider>
        <MerchantContent />
      </AuthProvider>
    </MerchantProvider>
  );
}
