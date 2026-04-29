import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { fetchServices } from '../api/booking-api';
import { Loading } from '../components/ui/Loading';
import type { Service } from '../types';

export function ServicesPage() {
  const { merchant, merchantCode } = useMerchant();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const showServicesTab = merchant?.display_settings?.show_services_tab !== false;

  useEffect(() => {
    if (!merchantCode || !showServicesTab) return;
    fetchServices(merchantCode)
      .then((data) => setServices(data.services || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [merchantCode, showServicesTab]);

  if (!showServicesTab) return <Navigate to={`/s/${merchantCode}`} replace />;

  if (loading) return <Loading text="載入服務項目..." />;

  // CTA: navigate to booking flow. AuthGuard on /s/:merchantCode handles
  // unauthenticated users by bouncing to LINE Login.
  const handleStartBooking = () => navigate(`/s/${merchantCode}`);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary">服務項目</h1>
      {services.length === 0 ? (
        <p className="text-text-secondary text-center py-8">尚無服務項目</p>
      ) : (
        services.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow-sm p-4 space-y-1">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-gray-800">{s.name}</h2>
              <span className="text-accent font-bold">NT${s.price}</span>
            </div>
            {s.description && (
              <p className="text-sm text-text-secondary">{s.description}</p>
            )}
            <p className="text-xs text-text-secondary">{s.duration_minutes} 分鐘</p>
          </div>
        ))
      )}

      {services.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleStartBooking}
            className="w-full font-medium text-white transition-all hover:brightness-110"
            style={{
              backgroundColor: 'var(--t-accent, var(--t-primary))',
              minHeight: '48px',
              borderRadius: 'var(--t-btn-radius, 10px)',
              padding: '14px 16px',
              fontSize: '1.0625rem',
            }}
          >
            立即{merchant?.terminology?.booking || '預約'}
          </button>
        </div>
      )}
    </div>
  );
}
