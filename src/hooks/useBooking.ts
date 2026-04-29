import { useState, useCallback } from 'react';
import { logFunnel } from '../lib/funnel';
import type {
  Service,
  TimeSlot,
  SessionSlot,
  GuestInfo,
  CompanionInfo,
  BookingStep,
  Resource,
} from '../types';

interface BookingState {
  step: BookingStep;
  service: Service | null;
  sessionCount: number;             // 想訂幾堂（v1: 1 ~ maxSessions）
  currentSessionIndex: number;      // 0-indexed; 當前在選第幾堂
  sessionSlots: SessionSlot[];      // 已選的堂（length 隨選逐漸推進）
  people: number;
  companionInfo: CompanionInfo;
  guestInfo: GuestInfo;
  staffId: string | null;
  staffName: string | null;
}

const initialState: BookingState = {
  step: 'service',
  service: null,
  sessionCount: 1,
  currentSessionIndex: 0,
  sessionSlots: [],
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

  const setSessionCount = useCallback((n: number) => {
    setState((s) => {
      if (n === s.sessionCount) return s;
      logFunnel('select_session_count', { session_count: n });
      // 改變堂數時，截斷或保留已選 slots
      const trimmed = s.sessionSlots.slice(0, n);
      return {
        ...s,
        sessionCount: n,
        sessionSlots: trimmed,
        currentSessionIndex: Math.min(s.currentSessionIndex, Math.max(0, n - 1)),
      };
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
    setState((s) => ({
      ...s,
      step: 'date',
      currentSessionIndex: 0,
      sessionSlots: [],   // 重新選 staff/sessions 後清空
    }));
  }, []);

  const selectDate = useCallback((date: string) => {
    setState((s) => {
      logFunnel('select_session_n_date_time', {
        session_index: s.currentSessionIndex + 1,
        session_total: s.sessionCount,
        selected_date: date,
        selected_time: null,
      });
      const next = [...s.sessionSlots];
      next[s.currentSessionIndex] = { date, time: '' };
      return { ...s, sessionSlots: next, step: 'time' };
    });
  }, []);

  const selectSlot = useCallback((slot: TimeSlot) => {
    setState((s) => {
      const next = [...s.sessionSlots];
      const cur = next[s.currentSessionIndex] || { date: '', time: '' };
      next[s.currentSessionIndex] = { date: cur.date, time: slot.time };
      logFunnel('select_session_n_date_time', {
        session_index: s.currentSessionIndex + 1,
        session_total: s.sessionCount,
        selected_date: cur.date,
        selected_time: slot.time,
      });
      // 還有下一堂 → 跳回 date
      if (s.currentSessionIndex + 1 < s.sessionCount) {
        return {
          ...s,
          sessionSlots: next,
          currentSessionIndex: s.currentSessionIndex + 1,
          step: 'date',
        };
      }
      // 最後一堂選完 → 進 info
      logFunnel('select_time', {
        selected_date: cur.date,
        selected_time: slot.time,
      });
      return { ...s, sessionSlots: next, step: 'info' };
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
      // 多堂時：若不是第 1 堂的 date/time，回到上一堂繼續選
      if (s.step === 'time' && s.sessionCount > 1) {
        // 從 time 退到 date（同一堂）
        return { ...s, step: 'date' };
      }
      if (s.step === 'date' && s.currentSessionIndex > 0) {
        // 不是第一堂 → 退到上一堂的 time 修改
        return {
          ...s,
          currentSessionIndex: s.currentSessionIndex - 1,
          step: 'time',
        };
      }
      const steps = stepsFor(hasPartyStep);
      const idx = steps.indexOf(s.step);
      if (idx <= 0) return s;
      return { ...s, step: steps[idx - 1] };
    });
  }, [hasPartyStep]);

  // Derived helpers — 給 BookingPage 的 Calendar/TimeSlotGrid 用
  const currentSlot = state.sessionSlots[state.currentSessionIndex];
  const currentDate = currentSlot?.date ?? '';

  return {
    ...state,
    currentDate,
    setStep, selectService, setPeople, setSessionCount, setStaff, confirmParty,
    selectDate, selectSlot, setGuestInfo, setCompanionInfo, reset,
    restoreState, goBack,
  };
}
