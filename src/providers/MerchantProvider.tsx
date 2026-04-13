import { createContext, useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMerchantInfo } from '../api/booking-api';
import type { Merchant, MerchantTheme } from '../types';

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

function injectThemeVars(theme: MerchantTheme) {
  const root = document.documentElement;
  root.style.setProperty('--brand-primary', theme.primary_color || '#3B6B5E');
  root.style.setProperty('--brand-accent', theme.accent_color || '#E8922D');
  root.style.setProperty('--brand-success', theme.success_color || '#7BAE7F');
  root.style.setProperty('--brand-bg', theme.header_bg || '#F8F6F3');
  root.style.setProperty('--brand-text-secondary', theme.text_secondary || '#8E8E8E');
}

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

        // Inject CSS variables for brand theming
        if (data?.theme) {
          injectThemeVars(data.theme);
        }

        // Update page title
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
