// Compute the date/time of each session in a multi-session booking, given a
// single start point. Phase 7 B1 — slot_size = duration_minutes + buffer_minutes
// (per Decision Addendum Q2). All math is done in Asia/Taipei.
import type { SessionSlot } from '../types';

export function computeSessionSlots(
  startDate: string,             // YYYY-MM-DD
  startTime: string,             // HH:mm
  sessions: number,
  slotMinutes: number,           // duration_minutes + buffer_minutes
): SessionSlot[] {
  if (!startDate || !startTime || sessions <= 0) return [];
  const baseTs = Date.parse(`${startDate}T${startTime}:00+08:00`);
  if (Number.isNaN(baseTs)) return [];
  const out: SessionSlot[] = [];
  for (let i = 0; i < sessions; i++) {
    const t = new Date(baseTs + i * slotMinutes * 60_000);
    // Format the Taiwan-local date/time directly to avoid timezone slip.
    const parts = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Taipei',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(t);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;
    out.push({
      date: `${map.year}-${map.month}-${map.day}`,
      time: `${map.hour}:${map.minute}`,
    });
  }
  return out;
}

// slot_size as defined by Phase 7 spec §6 (duration + buffer).
export function getSlotMinutes(service: { duration_minutes: number; buffer_minutes?: number }): number {
  return (service.duration_minutes || 0) + (service.buffer_minutes ?? 0);
}
