import { useState, useCallback } from 'react';
import { logFunnel } from '../lib/funnel';
import type {
  Service,
  TimeSlot,
  GuestInfo,
  CompanionInfo,
  BookingStep,
  Resource,
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
  staffId: string | null;       // 客人指定的師傅 ID；null = 不指定/2人+ 自動分配/未啟用
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

// hasPartyStep=true: service → party → date → time → info → confirm
// hasPartyStep=false: service → date → time → info → confirm
function stepsFor(hasPartyStep: boolean): BookingStep[] {
  return hasPartyStep
    ? ['service', 'party', 'date', 'time', 'info', 'confirm']
    : ['service', 'date', 'time', 'info', 'confirm'];
}

interface UseBookingOptions {
  hasPartyStep: boolean;
}

export function useBooking({ hasPartyStep }: UseBookingOptions) {
  const [state, setState] = useState<BookingState>(initialState);

  const setStep = useCallback((step: BookingStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const selectService = useCallback((service: Service) => {
    logFunnel('select_service', { service_id: service.id });
    setState((s) => ({
      ...s,
      service,
      step: hasPartyStep ? 'party' : 'date',
    }));
  }, [hasPartyStep]);

  const setPeople = useCallback((people: number) => {
    setState((s) => {
      // 2+ 人時 staff 一律 null（系統自動分配）
      if (people >= 2) {
        return { ...s, people, staffId: null, staffName: null };
      }
      return { ...s, people };
    });
  }, []);

  // resource=null 表示「不指定（自動安排）」— 僅 optional 模式或 2+人時允許
  const setStaff = useCallback((resource: Resource | null) => {
    logFunnel('select_resource', { resource_id: resource?.id });
    setState((s) => ({
      ...s,
      staffId: resource?.id ?? null,
      staffName: resource?.name ?? null,
    }));
  }, []);

  const confirmParty = useCallback(() => {
    setState((s) => ({ ...s, step: 'date' }));
  }, []);

  const selectDate = useCallback((date: string) => {
    logFunnel('select_date', { selected_date: date });
    setState((s) => ({ ...s, date, step: 'time' }));
  }, []);

  const selectSlot = useCallback((slot: TimeSlot, sessions: number) => {
    setState((s) => {
      logFunnel('select_time', {
        selected_date: s.date,
        selected_time: slot?.time,
      });
      return { ...s, slot, sessions, step: 'info' };
    });
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

  // 用於 LINE Login 回流時直接還原狀態（跳過所有 step transition logic）
  const restoreState = useCallback((patch: Partial<BookingState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const goBack = useCallback(() => {
    setState((s) => {
      const steps = stepsFor(hasPartyStep);
      const idx = steps.indexOf(s.step);
      if (idx <= 0) return s;
      return { ...s, step: steps[idx - 1] };
    });
  }, [hasPartyStep]);

  return {
    ...state,
    setStep, selectService, setPeople, setStaff, confirmParty,
    selectDate, selectSlot, setGuestInfo, setCompanionInfo, reset,
    restoreState, goBack,
  };
}
