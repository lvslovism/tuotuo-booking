import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState, Customer } from '../types';
import type { CustomerRow } from '../lib/db';

// Re-export the full DB customer row for screens that need all backend fields
export type CustomerDbRow = CustomerRow;

interface AuthContextValue extends AuthState {
  setAuth: (token: string, customer: Customer, mode: AuthState['mode']) => void;
  clearAuth: () => void;
}

const STORAGE_TOKEN = 'wb_session_token';
const STORAGE_CUSTOMER = 'wb_customer';
const STORAGE_MODE = 'wb_auth_mode';
const STORAGE_EXPIRES = 'wb_auth_expires';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const initialState: AuthState = {
  mode: 'guest',
  token: null,
  customer: null,
  isAuthenticated: false,
};

function loadFromStorage(): AuthState | null {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const customerStr = localStorage.getItem(STORAGE_CUSTOMER);
    const mode = localStorage.getItem(STORAGE_MODE) as AuthState['mode'] | null;
    const expires = localStorage.getItem(STORAGE_EXPIRES);
    if (!token || !customerStr || !expires) return null;
    if (Date.now() >= Number(expires)) {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_CUSTOMER);
      localStorage.removeItem(STORAGE_MODE);
      localStorage.removeItem(STORAGE_EXPIRES);
      return null;
    }
    return {
      token,
      customer: JSON.parse(customerStr) as Customer,
      mode: mode || 'guest',
      isAuthenticated: true,
    };
  } catch {
    return null;
  }
}

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  setAuth: () => {},
  clearAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>(() => loadFromStorage() || initialState);

  // Cross-tab sync: if another tab clears auth, update here too
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_TOKEN) {
        const next = loadFromStorage();
        setAuthState(next || initialState);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const setAuth = (token: string, customer: Customer, mode: AuthState['mode']) => {
    try {
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_CUSTOMER, JSON.stringify(customer));
      localStorage.setItem(STORAGE_MODE, mode);
      localStorage.setItem(STORAGE_EXPIRES, String(Date.now() + SESSION_TTL_MS));
    } catch {
      // localStorage may throw in private mode — still update in-memory state
    }
    setAuthState({ mode, token, customer, isAuthenticated: true });
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_CUSTOMER);
      localStorage.removeItem(STORAGE_MODE);
      localStorage.removeItem(STORAGE_EXPIRES);
    } catch {
      // ignore
    }
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
