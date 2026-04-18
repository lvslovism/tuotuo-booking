import { createContext, useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMerchantInfo } from '../api/booking-api';
import type { Merchant } from '../types';

interface MerchantContextValue {
  merchant: Merchant | null;
  merchantCode: string;
  loading: boolean;
  error: string | null;
}

export const MerchantContext = createContext<MerchantContextValue>({
  merchant: null,
  merchantCode: '',
  loading: true,
  error: null,
});

export function MerchantProvider({ children }: { children: ReactNode }) {
  const { merchantCode = '' } = useParams<{ merchantCode: string }>();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!merchantCode) {
      setError('MISSING_MERCHANT_CODE');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMerchantInfo(merchantCode)
      .then((data) => {
        if (cancelled) return;
        setMerchant(data);

        if (data?.display_name) {
          document.title = `${data.display_name} — 線上預約`;
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'LOAD_FAILED');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [merchantCode]);

  return (
    <MerchantContext.Provider value={{ merchant, merchantCode, loading, error }}>
      {children}
    </MerchantContext.Provider>
  );
}
