import { useState, useCallback } from 'react';
import { logFunnel } from '../lib/funnel';
import { computeSessionSlots, getSlotMinutes } from '../utils/sessionSlots';
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
  selectedDate: string;             // 起點日期（單一）
  sessionSlots: SessionSlot[];      // 由 selectedDate + 起點時間 + sessionCount × slot_size 推算
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
  selectedDate: '',
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
      // 起點仍存在 → 重算 slots
      const slotMinutes = s.service ? getSlotMinutes(s.service) : 0;
      const startTime = s.sessionSlots[0]?.time ?? '';
      const slots = (s.selectedDate && startTime && slotMinutes > 0)
        ? computeSessionSlots(s.selectedDate, startTime, n, slotMinutes)
        : [];
      return { ...s, sessionCount: n, sessionSlots: slots };
    });
  }, []);

  // 多堂強制同師傅：整組共用同一個 staffId（後端 create-booking 只接受單一 resource_id）。
  // 「不指定（自動安排）」已移除；resource=null 路徑保留給 2+ 人系統自動分配。
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
      selectedDate: '',
      sessionSlots: [],
    }));
  }, []);

  const selectDate = useCallback((date: string) => {
    setState((s) => {
      logFunnel('select_session_n_date_time', {
        session_index: 1,
        session_total: s.sessionCount,
        selected_date: date,
        selected_time: null,
      });
      // Selecting a new start date drops any previously chosen start time.
      return { ...s, selectedDate: date, sessionSlots: [], step: 'time' };
    });
  }, []);

  // Phase 7 B1: a single start time auto-fills all N sessions back-to-back at
  // duration+buffer intervals. No more per-session date/time picking.
  const selectSlot = useCallback((slot: TimeSlot) => {
    setState((s) => {
      if (!s.service || !s.selectedDate) return s;
      const slotMinutes = getSlotMinutes(s.service);
      const slots = computeSessionSlots(s.selectedDate, slot.time, s.sessionCount, slotMinutes);
      logFunnel('select_session_n_date_time', {
        session_index: 1,
        session_total: s.sessionCount,
        selected_date: s.selectedDate,
        selected_time: slot.time,
      });
      logFunnel('select_time', {
        selected_date: s.selectedDate,
        selected_time: slot.time,
      });
      return { ...s, sessionSlots: slots, step: 'info' };
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

  // Backwards-compat: BookingPage's date/time UI reads `currentDate` to drive
  // Calendar/TimeSlotGrid. Map it onto the new single-start `selectedDate`.
  return {
    ...state,
    currentDate: state.selectedDate,
    setStep, selectService, setPeople, setSessionCount, setStaff, confirmParty,
    selectDate, selectSlot, setGuestInfo, setCompanionInfo, reset,
    restoreState, goBack,
  };
}
