import { useEffect, useState } from 'react';
import { fetchServices } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { Loading } from '../ui/Loading';
import { cn } from '../../utils/cn';
import type { Service } from '../../types';

interface Props {
  onSelect: (service: Service) => void;
}

export function ServiceSelector({ onSelect }: Props) {
  const { merchantCode, merchant } = useMerchant();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!merchantCode) return;
    fetchServices(merchantCode)
      .then((data) => {
        const list = data.services || [];
        setServices(list);
        // Auto-select if only 1 service
        if (list.length === 1) {
          onSelect(list[0]);
        }
      })
      .catch(() => setError('無法載入服務項目'))
      .finally(() => setLoading(false));
  }, [merchantCode, onSelect]);

  if (loading) return <Loading text="載入服務項目..." />;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  const termService = merchant?.terminology?.service || '服務';

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-800">
        選擇{termService}項目
      </h2>
      {services.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className={cn(
            'w-full text-left bg-white rounded-xl shadow-sm p-4 border-2 border-transparent',
            'hover:border-primary/30 active:scale-[0.99] transition-all',
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-800">{s.name}</h3>
              {s.description && (
                <p className="text-sm text-text-secondary line-clamp-2">{s.description}</p>
              )}
              <p className="text-xs text-text-secondary">{s.duration_minutes} 分鐘</p>
            </div>
            <span className="text-accent font-bold whitespace-nowrap ml-3">
              NT${s.price}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
