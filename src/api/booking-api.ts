import type { Merchant, Service, CalendarDay, SlotsResponse, Package, ResourcesResponse } from '../types';
import { SUPABASE_URL } from '../lib/db';

const API_BASE = import.meta.env.VITE_API_BASE || `${SUPABASE_URL}/functions/v1/web-booking-api`;

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

/** Returns merchant data directly (flat object, not wrapped) */
export function fetchMerchantInfo(merchantCode: string) {
  return apiFetch<Merchant>(`${API_BASE}?action=merchant-info&m=${merchantCode}`);
}

export function fetchServices(merchantCode: string) {
  return apiFetch<{ services: Service[]; disclaimer: string; pricing_info: Record<string, unknown> }>(
    `${API_BASE}?action=services&m=${merchantCode}`
  );
}

export function fetchCalendarStatus(merchantCode: string, month: string, serviceId: string, people = 1) {
  let url = `${API_BASE}?action=calendar-status&m=${merchantCode}&month=${month}&service_id=${serviceId}`;
  if (people > 1) url += `&people=${people}`;
  return apiFetch<{ days: CalendarDay[]; month: string; sessions: number }>(url);
}

export function fetchAvailableSlots(
  merchantCode: string,
  date: string,
  serviceId: string,
  people = 1,
  resourceId: string | null = null,
) {
  let url = `${API_BASE}?action=available-slots&m=${merchantCode}&date=${date}&service_id=${serviceId}`;
  if (people > 1) url += `&people=${people}`;
  if (resourceId) url += `&resource_id=${encodeURIComponent(resourceId)}`;
  return apiFetch<SlotsResponse>(url);
}

export function fetchResources(merchantCode: string) {
  return apiFetch<ResourcesResponse>(`${API_BASE}?action=resources&m=${merchantCode}`);
}

export function fetchPackages(merchantCode: string) {
  return apiFetch<Package[]>(`${API_BASE}?action=list-packages&m=${merchantCode}`);
}

export interface WaitlistPayload {
  merchant_code: string;
  service_id: string;
  preferred_dates: string[];
  preferred_time_start: string;
  preferred_time_end: string;
  customer_name: string;
  customer_phone: string;
  preferred_resource_id?: string;
  customer_line_user_id?: string;
}

export function addToWaitlist(payload: WaitlistPayload) {
  return apiFetch<{ success: boolean; waitlist_id: string }>(`${API_BASE}?action=add-to-waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export interface VerifyIdentityResponse {
  session_token: string;
  customer: {
    id: string;
    name: string;
    real_name: string | null;
    phone: string;
    gender: string;
    line_user_id: string | null;
    total_bookings: number;
  };
  is_new_customer: boolean;
  auth_mode: string;
}

export function verifyIdentity(merchantCode: string, data: { mode: string; [key: string]: unknown }) {
  return apiFetch<VerifyIdentityResponse>(`${API_BASE}?action=verify-identity&m=${merchantCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, merchant_code: merchantCode }),
  });
}

export interface BookingMerchantInfo {
  display_name: string;
  address: string;
  google_map_url: string;
  phone: string;
  line_oa_url: string;
}

export interface GroupBookingItem {
  id: string;
  resource_name: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  final_price: number;
  group_index: number;
}

export interface CreateBookingResponse {
  group_id: string | null;
  people: number;
  sessions_per_person: number;
  total_sessions: number;
  start_time: string;
  end_time: string;
  price_per_session: number;
  original_price_per_session: number;
  discount_per_session: number;
  total_price: number;
  booking: {
    id: string;
    service_name: string;
    resource_name: string;
    start_time: string;
    end_time: string;
    duration_minutes?: number;
    final_price: number;
  };
  bookings?: GroupBookingItem[];
  merchant?: BookingMerchantInfo;
}

export interface CreateBookingPayload {
  service_id: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  sessions: number;
  people: number;
  resource_id?: string | null;
  customer_name?: string;
  customer_phone?: string;
  customer_gender?: string;
  companion_name?: string;
  companion_gender?: string;
}

export function createBooking(token: string, merchantCode: string, data: CreateBookingPayload) {
  return apiFetch<CreateBookingResponse>(`${API_BASE}?action=create-booking&m=${merchantCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export interface BookingRecord {
  id: string;
  service_name: string;
  resource_name: string;
  start_time: string;
  end_time: string;
  status: string;
  final_price: number;
  payment_status: string;
  source: string;
  customer_note: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  customer_name: string;
  group_id: string;
  group_size: number;
  group_index: number;
  can_cancel: boolean;
}

export function fetchMyBookings(token: string, merchantCode: string, status: 'upcoming' | 'past' = 'upcoming') {
  return apiFetch<{ bookings: BookingRecord[] }>(
    `${API_BASE}?action=my-bookings&m=${merchantCode}&status=${status}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export interface CancelBookingResponse {
  success?: boolean;
  error?: string;
  message?: string;
  cancelled_count?: number;
  waitlist_notified?: number;
  hours_remaining?: number;
  recent_cancels?: number;
  limit?: number;
}

export function cancelBooking(token: string, merchantCode: string, bookingId: string, reason?: string, cancelGroup = false) {
  return apiFetch<CancelBookingResponse>(`${API_BASE}?action=cancel-booking&m=${merchantCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ booking_id: bookingId, reason, cancel_group: cancelGroup }),
  });
}

// === Booking Status (for payment result / reschedule) ===

export interface BookingStatusResponse {
  id: string;
  service_name: string;
  resource_name: string;
  start_time: string;
  end_time: string;
  status: string;
  payment_status: string;
  final_price: number;
  duration_minutes: number;
  service_id: string;
  customer_name: string;
}

export function fetchBookingStatus(merchantCode: string, bookingId: string) {
  return apiFetch<BookingStatusResponse>(
    `${API_BASE}?action=booking-status&m=${merchantCode}&booking_id=${bookingId}`
  );
}

// === Reschedule ===

export interface RescheduleResponse {
  success: boolean;
  new_start_time: string;
  new_end_time: string;
}

export function rescheduleBooking(
  token: string,
  merchantCode: string,
  bookingId: string,
  newDate: string,
  newTime: string,
) {
  return apiFetch<RescheduleResponse>(`${API_BASE}?action=reschedule-booking&m=${merchantCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ merchant_code: merchantCode, booking_id: bookingId, new_date: newDate, new_time: newTime }),
  });
}

// === Create Payment (retry failed payment) ===

export interface CreatePaymentResponse {
  payment_url: string;
}

export function createPayment(token: string, merchantCode: string, bookingId: string) {
  return apiFetch<CreatePaymentResponse>(`${API_BASE}?action=create-payment&m=${merchantCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ booking_id: bookingId }),
  });
}

// === Submit Review ===

export interface SubmitReviewResponse {
  success: boolean;
  review_id: string;
}

export function submitReview(
  token: string,
  merchantCode: string,
  bookingId: string,
  rating: number,
  comment: string,
) {
  return apiFetch<SubmitReviewResponse>(`${API_BASE}?action=submit-review&m=${merchantCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ booking_id: bookingId, rating, comment }),
  });
}

// === Staff Performance ===

export interface StaffScheduleItem {
  id: string;
  customer_name: string;
  service_name: string;
  start_time: string;
  end_time: string;
  status: string;
  duration_minutes: number;
}

export interface StaffPerformanceData {
  total_bookings: number;
  completed_bookings: number;
  no_show_bookings: number;
  total_revenue: number;
  commission_earned: number;
}

export interface StaffPerformanceResponse {
  resource: { id: string; name: string; title: string | null };
  performance: StaffPerformanceData;
  today_schedule: StaffScheduleItem[];
  period: string;
  error?: string;
}

export function fetchStaffPerformance(
  merchantCode: string,
  lineUserId: string,
  period: string = 'month',
  liffAccessToken?: string
) {
  const headers: Record<string, string> = {};
  if (liffAccessToken) {
    headers['Authorization'] = `Bearer ${liffAccessToken}`;
  }
  return apiFetch<StaffPerformanceResponse>(
    `${API_BASE}?action=staff-performance&m=${merchantCode}&line_user_id=${lineUserId}&period=${period}`,
    { headers }
  );
}

// === Customer Portal (Member Center) ===

export interface PortalCustomer {
  id: string;
  name: string;
  phone: string;
  total_visits: number;
  total_spent: number;
  lifecycle_stage: string;
  tags: string[];
  is_new_customer: boolean;
  member_since: string;
}

export interface PortalBooking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_name: string;
  resource_name: string;
  total_price: number;
}

export interface PortalLoyaltyCard {
  current_stamps: number;
  required_stamps: number;
  rewards_earned: number;
  is_active: boolean;
}

export interface PortalStoredValue {
  balance: number;
  card_number: string;
  expires_at: string | null;
  status: string;
}

export interface PortalPackage {
  name: string;
  remaining_sessions: number;
  total_sessions: number;
  expires_at: string | null;
  status: string;
}

export interface PortalVisit {
  date: string;
  service: string;
  resource: string;
  total_price: number;
}

export interface CustomerPortalResponse {
  customer: PortalCustomer;
  upcoming_bookings: PortalBooking[];
  loyalty_card: PortalLoyaltyCard | null;
  stored_value: PortalStoredValue | null;
  packages: PortalPackage[];
  recent_visits: PortalVisit[];
  error?: string;
}

export function fetchCustomerPortal(token: string, merchantCode: string) {
  return apiFetch<CustomerPortalResponse>(
    `${API_BASE}?action=customer-portal&m=${merchantCode}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}
