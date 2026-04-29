import type {
  CustomerRow,
  MerchantRow,
  ServiceRow,
  ResourceRow,
  BookingRow,
} from '../lib/db';

// DB Row aliases — source of truth for backend data shapes
export type DbCustomer = CustomerRow;
export type DbMerchant = MerchantRow;
export type DbService = ServiceRow;
export type DbResource = ResourceRow;
export type DbBooking = BookingRow;

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
  max_daily_bookings_per_customer?: number;
  auto_confirm?: boolean;
  allow_same_day?: boolean;
  cancellation_policy: {
    allowed: boolean;
    min_hours_before: number;
    penalty_type: string;
    free_cancel_count: number;
  };
  group_booking?: {
    enabled: boolean;
    max_people: number;
    max_sessions?: number;
  };
  staff_break_rules?: {
    consecutive_limit?: {
      enabled?: boolean;
      max_sessions?: number;
      break_duration_minutes?: number;
    };
    max_daily_sessions_per_staff?: number;
    fixed_breaks?: Array<{ start: string; end: string; label?: string }>;
  };
}

export interface GroupDiscount {
  enabled: boolean;
  discount_per_session: number;
  min_people_or_sessions: number;
  description: string;
}

export interface PricingRules {
  group_discount?: GroupDiscount;
}

export interface MerchantDisplaySettings {
  show_services_tab?: boolean;
  terminology?: MerchantTerminology;
  theme?: Record<string, unknown>;
}

export type ThemeTemplate = 'zen' | 'warm';

export interface Merchant {
  merchant_code: string;
  display_name: string;
  industry: string;
  phone: string;
  address: string;
  google_map_url?: string;
  line_oa_url?: string;
  line_liff_id?: string;
  line_login_channel_id?: string;
  timezone: string;
  business_hours: Record<string, unknown>;
  booking_rules: MerchantBookingRules;
  theme: MerchantTheme;
  theme_template?: ThemeTemplate;
  terminology: MerchantTerminology;
  disclaimer: string;
  pricing_info: Record<string, unknown>;
  pricing_rules?: PricingRules;
  display_settings?: MerchantDisplaySettings;
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
  recommended?: boolean;
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

// === Package (套券) ===

export interface Package {
  id: string;
  name: string;
  description: string | null;
  total_sessions: number;
  bonus_sessions: number | null;
  original_price: number;
  selling_price: number;
  validity_days: number | null;
  is_active: boolean;
  services?: { name: string };
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
  gender?: string;
  line_user_id?: string | null;
  avatar_url?: string;
}

export interface AuthState {
  mode: 'guest' | 'liff' | 'line_login';
  token: string | null;
  customer: Customer | null;
  isAuthenticated: boolean;
}

// === Resource (師傅，from ?action=resources) ===

export type StaffSelectionMode = 'hidden' | 'optional' | 'required';

export interface Resource {
  id: string;
  name: string;
  title: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface ResourcesResponse {
  staff_selection_mode: StaffSelectionMode;
  resources: Resource[];
}

// === Booking Flow State ===

export type BookingStep = 'service' | 'party' | 'date' | 'time' | 'info' | 'confirm';

// Phase 6: 多堂預約 — 每堂自己的 date+time（v1 整組同 staff）
export interface SessionSlot {
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm
}

export interface GuestInfo {
  name: string;
  phone: string;
  gender: 'male' | 'female' | '';
}

export interface CompanionInfo {
  name: string;
  gender: 'male' | 'female' | '';
}

export interface GroupBookingDetail {
  id: string;
  resource_name: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  final_price: number;
  group_index: number;
}
