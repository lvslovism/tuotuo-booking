import type { Merchant, Service, CalendarDay, SlotsResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE;

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

export function fetchCalendarStatus(merchantCode: string, month: string) {
  return apiFetch<{ days: CalendarDay[]; month: string; sessions: number }>(
    `${API_BASE}?action=calendar-status&m=${merchantCode}&month=${month}`
  );
}

export function fetchAvailableSlots(merchantCode: string, date: string, serviceId: string) {
  return apiFetch<SlotsResponse>(
    `${API_BASE}?action=available-slots&m=${merchantCode}&date=${date}&service_id=${serviceId}`
  );
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

export function verifyIdentity(data: { merchant_code: string; mode: string; [key: string]: unknown }) {
  return apiFetch<VerifyIdentityResponse>(`${API_BASE}?action=verify-identity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export interface CreateBookingResponse {
  group_id: string;
  people: number;
  sessions_per_person: number;
  total_sessions: number;
  start_time: string;
  end_time: string;
  price_per_session: number;
  total_price: number;
  bookings: Array<{
    id: string;
    service_name: string;
    resource_name: string;
    start_time: string;
    end_time: string;
    final_price: number;
  }>;
}

export function createBooking(token: string, data: { date: string; time: string; people?: number; sessions?: number }) {
  return apiFetch<CreateBookingResponse>(`${API_BASE}?action=create-booking`, {
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

export function cancelBooking(token: string, bookingId: string, reason?: string, cancelGroup = false) {
  return apiFetch<{ success: boolean }>(`${API_BASE}?action=cancel-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ booking_id: bookingId, reason, cancel_group: cancelGroup }),
  });
}
