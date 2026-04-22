import { useEffect, useState } from 'react';
import { fetchResources } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { Loading } from '../ui/Loading';
import type { Resource, StaffSelectionMode } from '../../types';

interface Props {
  // 已從 BookingPage 載入好的 resources（避免重撈）；若 undefined 則自行 fetch
  resources?: Resource[];
  mode: StaffSelectionMode;
  onSelect: (resource: Resource | null) => void;
  onBack?: () => void;
}

export function StaffSelector({ resources: initialResources, mode, onSelect, onBack }: Props) {
  const { merchantCode, merchant } = useMerchant();
  const [resources, setResources] = useState<Resource[]>(initialResources || []);
  const [loading, setLoading] = useState(!initialResources);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialResources || !merchantCode) return;
    setLoading(true);
    fetchResources(merchantCode)
      .then((data) => setResources(data.resources || []))
      .catch(() => setError('無法載入服務人員'))
      .finally(() => setLoading(false));
  }, [merchantCode, initialResources]);

  if (loading) return <Loading text="載入服務人員..." />;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  const termProvider = merchant?.terminology?.provider || '服務人員';
  const allowAuto = mode === 'optional';

  const handlePick = (resource: Resource | null) => {
    setSelectedId(resource?.id ?? '__auto__');
    // slight delay so the visual selection can register before nav
    requestAnimationFrame(() => onSelect(resource));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="theme-title text-lg">選擇{termProvider}</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm hover:underline"
            style={{ color: 'var(--t-primary)' }}
          >
            ← 上一步
          </button>
        )}
      </div>
      <div className="theme-gold-divider" />

      <div className="space-y-3 theme-enter">
        {allowAuto && (
          <button
            onClick={() => handlePick(null)}
            className="theme-service-card block w-full text-left"
            style={{
              minHeight: 64,
              borderColor: selectedId === '__auto__' ? 'var(--t-primary)' : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}
              >
                🔄
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="theme-title"
                  style={{ fontSize: '1rem', color: 'var(--t-text)' }}
                >
                  不指定（自動安排）
                </h3>
                <p className="text-sm" style={{ color: 'var(--t-sub)' }}>
                  由系統安排最合適的{termProvider}
                </p>
              </div>
            </div>
          </button>
        )}

        {resources.map((r) => (
          <button
            key={r.id}
            onClick={() => handlePick(r)}
            className="theme-service-card block w-full text-left"
            style={{
              minHeight: 64,
              borderColor: selectedId === r.id ? 'var(--t-primary)' : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              {r.avatar_url ? (
                <img
                  src={r.avatar_url}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: '1px solid var(--t-line)' }}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}
                >
                  👤
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="theme-title"
                  style={{ fontSize: '1rem', color: 'var(--t-text)' }}
                >
                  {r.name}
                </h3>
                {(r.title || r.bio) && (
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--t-sub)' }}>
                    {r.title || r.bio}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
