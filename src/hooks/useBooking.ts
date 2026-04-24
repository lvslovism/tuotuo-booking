import { useState, useCallback } from 'react';
import { logFunnel } from '../lib/funnel';
import type {
  Service,
  TimeSlot,
  GuestInfo,
  CompanionInfo,
  BookingStep,
  Resource,
  StaffSelectionMode,
} from '../types';

interface BookingState {
  step: BookingStep;
  service: Service | null;
  date: string;         // YYYY-MM-DD
  slot: TimeSlot | null;
  sessions: number;
  people: number;
  companionInfo: CompanionInfo;
  guestInfo: GuestInfo;
  staffId: string | null;       // 客人指定的師傅 ID；null 代表「不指定」或未啟用
  staffName: string | null;     // 快取供確認頁顯示
}

const initialState: BookingState = {
  step: 'service',
  service: null,
  date: '',
  slot: null,
  sessions: 1,
  people: 1,
  companionInfo: { name: '', gender: '' },
  guestInfo: { name: '', phone: '', gender: '' },
  staffId: null,
  staffName: null,
};

// hidden → service → datetime；其他 → service → staff → datetime
function stepsFor(mode: StaffSelectionMode): BookingStep[] {
  return mode === 'hidden'
    ? ['service', 'datetime', 'info', 'confirm']
    : ['service', 'staff', 'datetime', 'info', 'confirm'];
}

export function useBooking(mode: StaffSelectionMode = 'hidden') {
  const [state, setState] = useState<BookingState>(initialState);

  const setStep = useCallback((step: BookingStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const selectService = useCallback((service: Service) => {
    logFunnel('select_service', { service_id: service.id });
    setState((s) => ({
      ...s,
      service,
      step: mode === 'hidden' ? 'datetime' : 'staff',
    }));
  }, [mode]);

  // resource=null 表示「不指定（自動安排）」— 僅 optional 模式允許
  const selectStaff = useCallback((resource: Resource | null) => {
    logFunnel('select_resource', { resource_id: resource?.id });
    setState((s) => ({
      ...s,
      staffId: resource?.id ?? null,
      staffName: resource?.name ?? null,
      step: 'datetime',
    }));
  }, []);

  const setPeople = useCallback((people: number) => {
    setState((s) => ({ ...s, people }));
  }, []);

  const selectSlot = useCallback((date: string, slot: TimeSlot, sessions: number) => {
    logFunnel('select_time', {
      selected_date: date,
      selected_time: slot?.time,
    });
    setState((s) => ({ ...s, date, slot, sessions, step: 'info' }));
  }, []);

  const setGuestInfo = useCallback((guestInfo: GuestInfo) => {
    logFunnel('confirm');
    setState((s) => ({ ...s, guestInfo, step: 'confirm' }));
  }, []);

  const setCompanionInfo = useCallback((companionInfo: CompanionInfo) => {
    setState((s) => ({ ...s, companionInfo }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const goBack = useCallback(() => {
    setState((s) => {
      const steps = stepsFor(mode);
      const idx = steps.indexOf(s.step);
      if (idx <= 0) return s;
      return { ...s, step: steps[idx - 1] };
    });
  }, [mode]);

  return {
    ...state,
    setStep, selectService, selectStaff, setPeople, selectSlot,
    setGuestInfo, setCompanionInfo, reset, goBack,
  };
}
