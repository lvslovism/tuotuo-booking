// ────────────────────────────────────────────────
// Booking funnel observability — fire-and-forget
// Types aligned with booking.booking_funnel_events CHECK constraints.
// ────────────────────────────────────────────────

export type FunnelStep =
  | 'landing'
  | 'select_service'
  | 'select_resource'
  | 'select_date'
  | 'select_time'
  | 'confirm'
  | 'success'
  | 'abandoned'
  | 'error';

// step → step_index (smallint in DB for SQL ordering)
const STEP_INDEX: Record<FunnelStep, number | null> = {
  landing: 0,
  select_service: 1,
  select_resource: 2,
  select_date: 3,
  select_time: 4,
  confirm: 5,
  success: 6,
  abandoned: null,
  error: null,
};

export interface FunnelExtras {
  customer_id?: string;
  line_user_id?: string;
  service_id?: string;
  resource_id?: string;
  booking_id?: string;
  selected_date?: string;       // YYYY-MM-DD
  selected_time?: string;       // HH:MM:SS
  failure_reason?: string;
  failure_detail?: string;
  metadata?: Record<string, unknown>;
}

// ── Session ID (sessionStorage, not cross-tab) ──
const SESSION_KEY = 'wb_session_id';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// ── Extract merchant_code from URL: /s/:merchant_code/... ──
function getMerchantCode(): string | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/\/s\/([^/]+)/);
  return match?.[1] ?? null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function postRpc(fnName: string, body: Record<string, unknown>): void {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* swallow: observability must never break the app */
  }
}

/**
 * Log a funnel event. Fire-and-forget — failures are swallowed.
 *
 * Uses keepalive so events queued during `beforeunload` still flush.
 */
export function logFunnel(step: FunnelStep, extra: FunnelExtras = {}): void {
  const merchantCode = getMerchantCode();
  if (!merchantCode) return;

  const payload = {
    merchant_code: merchantCode,
    session_id: getSessionId(),
    step,
    step_index: STEP_INDEX[step],
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    ...extra,
  };

  postRpc('fn_log_funnel_event', { p_event: payload });
}

/**
 * Log a front-end error. Fire-and-forget.
 */
export function logUIError(error: {
  error_type: string;
  error_message: string;
  error_stack?: string;
  component_name?: string;
  severity?: 'warning' | 'error' | 'critical';
}): void {
  const merchantCode = getMerchantCode();

  const payload = {
    source: 'web_booking' as const,
    merchant_code: merchantCode,
    app_version: (import.meta.env.VITE_GIT_SHA as string | undefined) || 'dev',
    session_id: getSessionId(),
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    severity: 'error' as const,
    ...error,
  };

  postRpc('fn_log_ui_error', { p_error: payload });
}
