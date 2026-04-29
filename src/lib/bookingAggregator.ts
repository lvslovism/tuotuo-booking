// Phase 8 — MemberPage 預約聚合
//
// 一個 group_id（或 1 人 N 堂時退階為 session_group_id）= 一張卡。
// 純前端聚合，不動 EF / DB / reschedule / cancel 實作。

import type { BookingRecord } from '../api/booking-api';

export type AggregatedCard = {
  /** 聚合 key：group_id ?? session_group_id ?? booking.id */
  groupKey: string;

  serviceName: string;
  /** 第一堂日期 (YYYY-MM-DD，本地 / Asia/Taipei) */
  date: string;
  /** "14:00 – 16:00" */
  timeRange: string;
  /** 第一堂的 ISO start_time，用於排序與導頁 */
  earliestStart: string;
  /** unique 老師名 */
  staffNames: string[];
  /** 'confirmed' | 'pending' | 'partial' | 'mixed' */
  status: string;
  /** 自己這人連續多堂的堂數 */
  sessionCount: number;
  /** 同行人數 */
  partySize: number;
  /** 原始 booking 列表（已依 start_time 升冪） */
  bookings: BookingRecord[];
};

export function aggregateStatus(list: BookingRecord[]): string {
  const statuses = new Set(list.map((b) => b.status));
  if (statuses.size === 1) return [...statuses][0];
  if (statuses.has('confirmed') && statuses.has('cancelled')) return 'partial';
  return 'mixed';
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatTaipeiDate(iso: string): string {
  const d = new Date(iso);
  const y = d.toLocaleString('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric' });
  const m = d.toLocaleString('en-CA', { timeZone: 'Asia/Taipei', month: '2-digit' });
  const day = d.toLocaleString('en-CA', { timeZone: 'Asia/Taipei', day: '2-digit' });
  return `${y}-${m}-${day}`;
}

function formatTaipeiTime(iso: string): string {
  const d = new Date(iso);
  const parts = d.toLocaleString('en-GB', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  // en-GB returns "HH:MM" but in some Node versions "HH:MM:SS"; normalize.
  const [h, mi] = parts.split(':');
  return `${pad2(Number(h))}:${pad2(Number(mi))}`;
}

export function aggregate(bookings: BookingRecord[]): AggregatedCard[] {
  const groups = new Map<string, BookingRecord[]>();
  for (const b of bookings) {
    // group_id 是「同一次預約意圖」的最高層級 key（M 人同時段）。
    // 1 人 N 堂只有 session_group_id、無 group_id —— 退階到 session_group_id 才能正確聚成 1 張卡。
    const key = b.group_id || b.session_group_id || b.id;
    const list = groups.get(key);
    if (list) list.push(b);
    else groups.set(key, [b]);
  }

  const cards: AggregatedCard[] = [];
  for (const [key, list] of groups) {
    const sorted = [...list].sort((a, b) => a.start_time.localeCompare(b.start_time));
    const earliest = sorted[0];
    const latest = sorted.reduce((acc, b) => (b.end_time > acc.end_time ? b : acc), sorted[0]);

    // session_total / group_size 在每筆 booking 上都應該一致；缺值時 fallback 到推算。
    // 若沒有 session_group_id → 推為 1 堂；若沒有 group_id → 推為 1 人。
    // （customer_id 在 my-bookings response 不一定回傳，故 fallback 須避免雜訊。）
    const distinctSessions = earliest.session_group_id
      ? new Set(sorted.map((b) => b.session_index ?? `${b.start_time}|${b.end_time}`)).size
      : 1;
    const distinctParty = earliest.group_id
      ? new Set(sorted.map((b) => b.customer_id ?? b.group_index ?? b.id)).size
      : 1;
    const sessionCount = earliest.session_total ?? distinctSessions;
    const partySize = earliest.group_size ?? distinctParty;

    cards.push({
      groupKey: key,
      serviceName: earliest.service_name,
      date: formatTaipeiDate(earliest.start_time),
      timeRange: `${formatTaipeiTime(earliest.start_time)} – ${formatTaipeiTime(latest.end_time)}`,
      earliestStart: earliest.start_time,
      staffNames: [...new Set(sorted.map((b) => b.resource_name).filter(Boolean))],
      status: aggregateStatus(sorted),
      sessionCount,
      partySize,
      bookings: sorted,
    });
  }

  return cards.sort((a, b) => a.earliestStart.localeCompare(b.earliestStart));
}
