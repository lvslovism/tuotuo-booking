import { useEffect, useState } from 'react';
import { fetchServices } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { useTheme } from '../../hooks/useTheme';
import { Loading } from '../ui/Loading';
import type { Service } from '../../types';

interface Props {
  onSelect: (service: Service) => void;
}

export function ServiceSelector({ onSelect }: Props) {
  const { merchantCode, merchant } = useMerchant();
  const { template } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!merchantCode) return;
    fetchServices(merchantCode)
      .then((data) => {
        const list = data.services || [];
        setServices(list);
        if (list.length === 1) onSelect(list[0]);
      })
      .catch(() => setError('無法載入服務項目'))
      .finally(() => setLoading(false));
  }, [merchantCode, onSelect]);

  if (loading) return <Loading text="載入服務項目..." />;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  const termService = merchant?.terminology?.service || '服務';

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="theme-title text-lg">選擇{termService}項目</h2>
        <div className="theme-gold-divider" />
      </div>

      <div className="space-y-3 theme-enter">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="theme-service-card block"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <h3
                  className="theme-title"
                  style={{
                    fontSize: template === 'zen' ? '1.05rem' : '1rem',
                    color: 'var(--t-text)',
                  }}
                >
                  {s.name}
                </h3>
                {s.description && (
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--t-sub)' }}>
                    {s.description}
                  </p>
                )}
                <p className="theme-label">{s.duration_minutes} 分鐘</p>
              </div>
              <div className="text-right whitespace-nowrap">
                {template === 'zen' ? (
                  <span>
                    <span
                      className="theme-price"
                      style={{ fontSize: '1.5rem' }}
                    >
                      {s.price.toLocaleString()}
                    </span>{' '}
                    <span className="text-xs" style={{ color: 'var(--t-muted)' }}>元</span>
                  </span>
                ) : (
                  <span className="theme-price" style={{ fontSize: '1.1rem' }}>
                    NT$ {s.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
