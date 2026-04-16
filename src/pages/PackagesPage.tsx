import { useEffect, useState } from 'react';
import { useMerchant } from '../hooks/useMerchant';
import { fetchPackages } from '../api/booking-api';
import { Loading } from '../components/ui/Loading';
import type { Package } from '../types';

export function PackagesPage() {
  const { merchantCode, merchant } = useMerchant();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantCode) return;
    fetchPackages(merchantCode)
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, [merchantCode]);

  if (loading) return <Loading text="載入套券方案..." />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary flex items-center gap-2">
        <span>套券方案</span>
      </h1>

      {packages.length === 0 ? (
        <p className="text-text-secondary text-center py-8">目前無可購買的套券方案</p>
      ) : (
        packages.map((pkg) => {
          const totalSessions = pkg.total_sessions + (pkg.bonus_sessions || 0);
          const hasDiscount = pkg.original_price > pkg.selling_price;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-xl shadow-sm p-5 space-y-3 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">{pkg.name}</h2>
                  {pkg.services?.name && (
                    <p className="text-sm text-text-secondary">{pkg.services.name}</p>
                  )}
                </div>
                {pkg.bonus_sessions ? (
                  <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">
                    {pkg.total_sessions}+{pkg.bonus_sessions} 堂
                  </span>
                ) : (
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                    {pkg.total_sessions} 堂
                  </span>
                )}
              </div>

              {pkg.description && (
                <p className="text-sm text-text-secondary">{pkg.description}</p>
              )}

              <div className="flex items-baseline gap-2">
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    NT${Number(pkg.original_price).toLocaleString()}
                  </span>
                )}
                <span className="text-xl font-bold text-accent">
                  NT${Number(pkg.selling_price).toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-green-600 font-medium">
                    省 NT${(Number(pkg.original_price) - Number(pkg.selling_price)).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span>共 {totalSessions} 堂</span>
                {pkg.validity_days && <span>有效期 {pkg.validity_days} 天</span>}
                <span>每堂約 NT${Math.round(Number(pkg.selling_price) / totalSessions).toLocaleString()}</span>
              </div>

              {/* 購買按鈕 — 目前導向到店購買 */}
              <div className="pt-1">
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                  <p className="font-medium">請到店購買</p>
                  {merchant?.phone && <p>電話：{merchant.phone}</p>}
                  {merchant?.address && <p>地址：{merchant.address}</p>}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
