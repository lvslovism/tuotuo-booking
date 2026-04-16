import { useState, useCallback } from 'react';
import type { Service, TimeSlot, GuestInfo, CompanionInfo, BookingStep } from '../types';

interface BookingState {
  step: BookingStep;
  service: Service | null;
  date: string;         // YYYY-MM-DD
  slot: TimeSlot | null;
  sessions: number;
  people: number;
  companionInfo: CompanionInfo;
  guestInfo: GuestInfo;
  staffId: string | null;
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
};

export function useBooking() {
  const [state, setState] = useState<BookingState>(initialState);

  const setStep = useCallback((step: BookingStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const selectService = useCallback((service: Service) => {
    setState((s) => ({ ...s, service, step: 'datetime' }));
  }, []);

  const setPeople = useCallback((people: number) => {
    setState((s) => ({ ...s, people }));
  }, []);

  const selectSlot = useCallback((date: string, slot: TimeSlot, sessions: number) => {
    setState((s) => ({ ...s, date, slot, sessions, step: 'info' }));
  }, []);

  const setGuestInfo = useCallback((guestInfo: GuestInfo) => {
    setState((s) => ({ ...s, guestInfo, step: 'confirm' }));
  }, []);

  const setCompanionInfo = useCallback((companionInfo: CompanionInfo) => {
    setState((s) => ({ ...s, companionInfo }));
  }, []);

  const setStaffId = useCallback((staffId: string | null) => {
    setState((s) => ({ ...s, staffId }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const goBack = useCallback(() => {
    setState((s) => {
      const steps: BookingStep[] = ['service', 'datetime', 'info', 'confirm'];
      const idx = steps.indexOf(s.step);
      if (idx <= 0) return s;
      return { ...s, step: steps[idx - 1] };
    });
  }, []);

  return {
    ...state,
    setStep, selectService, setPeople, selectSlot,
    setGuestInfo, setCompanionInfo, setStaffId, reset, goBack,
  };
}
