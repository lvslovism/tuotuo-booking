import { useMerchant } from './useMerchant';

/**
 * 從商家設定動態讀取術語。
 * fallback: terminology > display_settings.terminology > 「服務人員/服務/預約」
 */
export function useMerchantTerminology() {
  const { merchant } = useMerchant();

  return {
    provider:
      merchant?.terminology?.provider ??
      merchant?.display_settings?.terminology?.provider ??
      '服務人員',
    service:
      merchant?.terminology?.service ??
      merchant?.display_settings?.terminology?.service ??
      '服務',
    booking:
      merchant?.terminology?.booking ??
      merchant?.display_settings?.terminology?.booking ??
      '預約',
  };
}
