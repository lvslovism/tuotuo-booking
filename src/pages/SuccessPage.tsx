import { Link } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { Button } from '../components/ui/Button';

export function SuccessPage() {
  const { merchantCode, merchant } = useMerchant();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-3xl">
        ✓
      </div>
      <h1 className="text-xl font-bold text-gray-800">預約成功！</h1>
      <p className="text-text-secondary text-sm">
        {merchant?.display_name} 已收到您的預約，請準時到場。
      </p>
      <Link to={`/s/${merchantCode}`}>
        <Button variant="primary">回到首頁</Button>
      </Link>
    </div>
  );
}
