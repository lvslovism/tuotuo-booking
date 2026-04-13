import { createContext, useState, type ReactNode } from 'react';
import type { AuthState, Customer } from '../types';

interface AuthContextValue extends AuthState {
  setAuth: (token: string, customer: Customer, mode: AuthState['mode']) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  mode: 'guest',
  token: null,
  customer: null,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  setAuth: () => {},
  clearAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>(initialState);

  const setAuth = (token: string, customer: Customer, mode: AuthState['mode']) => {
    setAuthState({ mode, token, customer, isAuthenticated: true });
  };

  const clearAuth = () => {
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
