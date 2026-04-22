export type { Database } from './types';
export * from './constants';

import type { Database } from './types';

export type BookingRow = Database['booking']['Tables']['bookings']['Row'];
export type BookingInsert = Database['booking']['Tables']['bookings']['Insert'];
export type CustomerRow = Database['booking']['Tables']['customers']['Row'];
export type ServiceRow = Database['booking']['Tables']['services']['Row'];
export type ResourceRow = Database['booking']['Tables']['resources']['Row'];
export type MerchantSettingsRow = Database['booking']['Tables']['merchant_settings']['Row'];
export type MerchantRow = Database['platform']['Tables']['merchants']['Row'];
