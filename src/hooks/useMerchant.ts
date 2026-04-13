import { useContext } from 'react';
import { MerchantContext } from '../providers/MerchantProvider';

export function useMerchant() {
  return useContext(MerchantContext);
}
