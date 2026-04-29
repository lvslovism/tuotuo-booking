// ============================================================
// LINE Login OAuth helpers (Phase 7 unified)
// ============================================================
// Single source of truth for building the LINE Login URL and
// managing OAuth state + post-login redirect intent across
// AuthGuard, GuestForm, MemberPage, and ServicesPage CTA.

import type { GuestInfo, CompanionInfo, SessionSlot } from '../types';

const LINE_LOGIN_STATE_KEY = 'line_login_state';
const BOOKING_RETURN_KEY = 'wb_booking_return';

export interface BookingReturnPayload {
  merchantCode?: string;
  // Where to land after callback verifies identity. Defaults to /s/:merchantCode.
  redirect_path?: string;
  // ── Booking flow state for restore (A2/A3) ──
  serviceId?: string | null;
  staffId?: string | null;
  // First-session date/time (legacy single-session restore path).
  date?: string;
  time?: string;
  // Phase 7: full multi-session restore + confirm 401 auto-resubmit.
  sessionCount?: number;
  sessionSlots?: SessionSlot[];
  people?: number;
  guestInfo?: GuestInfo;
  companionInfo?: CompanionInfo;
  // A3: when true, callback should re-submit create-booking after auth.
  resubmit?: boolean;
}

function randomState(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function buildLineLoginUrl(channelId: string, merchantCode: string): string {
  const csrfNonce = randomState();
  try {
    sessionStorage.setItem(LINE_LOGIN_STATE_KEY, csrfNonce);
  } catch {
    // sessionStorage may throw in private mode — proceed; callback will tolerate.
  }
  const redirectUri = `${window.location.origin}/s/${merchantCode}/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    state: csrfNonce,
    scope: 'profile openid',
    bot_prompt: 'aggressive',
  });
  return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
}

export function setBookingReturn(payload: BookingReturnPayload): void {
  try {
    sessionStorage.setItem(BOOKING_RETURN_KEY, JSON.stringify(payload));
  } catch { /* ignore */ }
}

export function getBookingReturn(): BookingReturnPayload | null {
  try {
    const raw = sessionStorage.getItem(BOOKING_RETURN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BookingReturnPayload;
  } catch {
    return null;
  }
}

export function clearBookingReturn(): void {
  try {
    sessionStorage.removeItem(BOOKING_RETURN_KEY);
  } catch { /* ignore */ }
}

export function clearLineLoginState(): void {
  try {
    sessionStorage.removeItem(LINE_LOGIN_STATE_KEY);
  } catch { /* ignore */ }
}

// Trigger LINE Login: write redirect intent + bounce to LINE OAuth.
// Returns false if merchant has no line_login_channel_id (caller should show fallback UI).
export function startLineLogin(
  channelId: string | undefined,
  merchantCode: string,
  payload: BookingReturnPayload = {},
): boolean {
  if (!channelId) return false;
  setBookingReturn({ merchantCode, ...payload });
  window.location.href = buildLineLoginUrl(channelId, merchantCode);
  return true;
}
