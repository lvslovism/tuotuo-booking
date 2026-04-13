import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 bg-bg">
      <div className="text-5xl">🔍</div>
      <h1 className="text-xl font-bold text-gray-800">頁面不存在</h1>
      <p className="text-text-secondary text-sm text-center">
        請確認網址是否正確，或聯繫商家取得預約連結。
      </p>
      <Link to="/">
        <Button variant="outline">回到首頁</Button>
      </Link>
    </div>
  );
}
