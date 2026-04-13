// === Merchant (matches web-booking-api merchant-info response) ===

export interface MerchantTheme {
  primary_color: string;
  accent_color: string;
  success_color: string;
  header_bg: string;
  text_secondary: string;
  text_on_dark: string;
}

export interface MerchantTerminology {
  provider: string; // 老師 / 美容師 / 醫師
  service: string;  // 調理 / 服務
  booking: string;  // 預約
}

export interface MerchantBookingRules {
  slot_interval_minutes: number;
  min_advance_hours: number;
  max_advance_days: number;
  cancellation_policy: {
    allowed: boolean;
    min_hours_before: number;
    penalty_type: string;
    free_cancel_count: number;
  };
}

export interface Merchant {
  merchant_code: string;
  display_name: string;
  industry: string;
  phone: string;
  address: string;
  google_map_url?: string;
  line_oa_url?: string;
  line_liff_id?: string;
  timezone: string;
  business_hours: Record<string, unknown>;
  booking_rules: MerchantBookingRules;
  theme: MerchantTheme;
  terminology: MerchantTerminology;
  disclaimer: string;
  pricing_info: Record<string, unknown>;
}

// === Service (from ?action=services) ===

export interface Service {
  id: string;
  name: string;
  description?: string;
  category?: string;
  duration_minutes: number;
  service_minutes: number;
  buffer_minutes: number;
  price: number;
  pricing_type: string;
  max_party_size: number;
  max_sessions: number;
}

// === Calendar (from ?action=calendar-status) ===

export interface CalendarDay {
  date: string;       // YYYY-MM-DD
  has_slots: boolean;
  is_closed: boolean;
}

// === Slot (from ?action=available-slots) ===

export interface TimeSlot {
  time: string;        // HH:mm
  available: boolean;
  available_resources: number;
}

export interface SlotsResponse {
  date: string;
  day_label: string;
  day_of_week: number;
  occupation_minutes: number;
  sessions: number;
  slots: TimeSlot[];
  total_resources: number;
}

// === Booking ===

export interface Booking {
  id: string;
  service_name: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  resource_name?: string;
  total_price: number;
  created_at: string;
}

// === Auth ===

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  line_user_id?: string;
  avatar_url?: string;
}

export interface AuthState {
  mode: 'guest' | 'liff' | 'line_login';
  token: string | null;
  customer: Customer | null;
  isAuthenticated: boolean;
}

// === Booking Flow State ===

export type BookingStep = 'service' | 'datetime' | 'info' | 'confirm';

export interface GuestInfo {
  name: string;
  phone: string;
  gender: 'male' | 'female' | '';
}
