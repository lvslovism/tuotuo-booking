import { describe, expect, it } from 'vitest';
import { aggregate, aggregateStatus } from './bookingAggregator';
import type { BookingRecord } from '../api/booking-api';

function mkBooking(overrides: Partial<BookingRecord>): BookingRecord {
  return {
    id: 'b-default',
    service_name: '顱脊系統調理',
    resource_name: '陳老師',
    start_time: '2026-05-06T06:00:00.000Z', // 14:00 Asia/Taipei
    end_time: '2026-05-06T07:00:00.000Z',
    status: 'confirmed',
    final_price: 1500,
    payment_status: 'paid',
    source: 'web',
    customer_note: '',
    cancelled_at: null,
    cancellation_reason: null,
    customer_name: 'Pien',
    group_id: null,
    group_size: null,
    group_index: null,
    session_group_id: null,
    session_index: null,
    session_total: null,
    can_cancel: true,
    ...overrides,
  };
}

describe('aggregateStatus', () => {
  it('returns the single status when uniform', () => {
    expect(aggregateStatus([mkBooking({ status: 'confirmed' })])).toBe('confirmed');
  });

  it('returns "partial" when confirmed + cancelled coexist', () => {
    expect(
      aggregateStatus([
        mkBooking({ id: 'a', status: 'confirmed' }),
        mkBooking({ id: 'b', status: 'cancelled' }),
      ]),
    ).toBe('partial');
  });

  it('returns "mixed" for other status combinations', () => {
    expect(
      aggregateStatus([
        mkBooking({ id: 'a', status: 'pending' }),
        mkBooking({ id: 'b', status: 'completed' }),
      ]),
    ).toBe('mixed');
  });
});

describe('aggregate — Case 1: lone booking (no group_id, no session_group_id)', () => {
  it('produces 1 card per booking', () => {
    const bookings = [
      mkBooking({ id: 'b1', start_time: '2026-05-06T06:00:00.000Z', end_time: '2026-05-06T07:00:00.000Z' }),
      mkBooking({ id: 'b2', start_time: '2026-05-07T06:00:00.000Z', end_time: '2026-05-07T07:00:00.000Z' }),
    ];
    const cards = aggregate(bookings);
    expect(cards).toHaveLength(2);
    expect(cards[0].groupKey).toBe('b1');
    expect(cards[1].groupKey).toBe('b2');
    expect(cards[0].sessionCount).toBe(1);
    expect(cards[0].partySize).toBe(1);
    expect(cards[0].timeRange).toBe('14:00 – 15:00');
  });
});

describe('aggregate — Case 2: 1 person N consecutive sessions', () => {
  it('groups by session_group_id into 1 card', () => {
    const bookings = [
      mkBooking({
        id: 'b1',
        session_group_id: 'sg-1',
        session_index: 0,
        session_total: 2,
        start_time: '2026-05-06T06:00:00.000Z',
        end_time: '2026-05-06T07:00:00.000Z',
      }),
      mkBooking({
        id: 'b2',
        session_group_id: 'sg-1',
        session_index: 1,
        session_total: 2,
        start_time: '2026-05-06T07:00:00.000Z',
        end_time: '2026-05-06T08:00:00.000Z',
      }),
    ];
    const cards = aggregate(bookings);
    expect(cards).toHaveLength(1);
    expect(cards[0].groupKey).toBe('sg-1');
    expect(cards[0].sessionCount).toBe(2);
    expect(cards[0].partySize).toBe(1);
    expect(cards[0].timeRange).toBe('14:00 – 16:00');
    expect(cards[0].bookings).toHaveLength(2);
  });
});

describe('aggregate — Case 3: M people same single session', () => {
  it('groups by group_id into 1 card', () => {
    const bookings = [
      mkBooking({
        id: 'b1',
        customer_id: 'c-pien',
        group_id: 'g-1',
        group_size: 2,
        group_index: 0,
        resource_name: '陳老師',
        start_time: '2026-05-06T06:00:00.000Z',
        end_time: '2026-05-06T07:00:00.000Z',
      }),
      mkBooking({
        id: 'b2',
        customer_id: 'c-friend',
        group_id: 'g-1',
        group_size: 2,
        group_index: 1,
        resource_name: '林老師',
        start_time: '2026-05-06T06:00:00.000Z',
        end_time: '2026-05-06T07:00:00.000Z',
      }),
    ];
    const cards = aggregate(bookings);
    expect(cards).toHaveLength(1);
    expect(cards[0].groupKey).toBe('g-1');
    expect(cards[0].partySize).toBe(2);
    expect(cards[0].sessionCount).toBe(1);
    expect(cards[0].staffNames.sort()).toEqual(['林老師', '陳老師']);
  });
});

describe('aggregate — Case 4: M people × N sessions (the bug scenario)', () => {
  it('produces 1 card from 4 bookings', () => {
    const bookings = [
      mkBooking({
        id: 'b1',
        customer_id: 'c-pien',
        group_id: 'g-1',
        group_size: 2,
        group_index: 0,
        session_group_id: 'sg-pien',
        session_index: 0,
        session_total: 2,
        start_time: '2026-05-06T06:00:00.000Z',
        end_time: '2026-05-06T07:00:00.000Z',
      }),
      mkBooking({
        id: 'b2',
        customer_id: 'c-pien',
        group_id: 'g-1',
        group_size: 2,
        group_index: 0,
        session_group_id: 'sg-pien',
        session_index: 1,
        session_total: 2,
        start_time: '2026-05-06T07:00:00.000Z',
        end_time: '2026-05-06T08:00:00.000Z',
      }),
      mkBooking({
        id: 'b3',
        customer_id: 'c-friend',
        group_id: 'g-1',
        group_size: 2,
        group_index: 1,
        session_group_id: 'sg-friend',
        session_index: 0,
        session_total: 2,
        start_time: '2026-05-06T06:00:00.000Z',
        end_time: '2026-05-06T07:00:00.000Z',
      }),
      mkBooking({
        id: 'b4',
        customer_id: 'c-friend',
        group_id: 'g-1',
        group_size: 2,
        group_index: 1,
        session_group_id: 'sg-friend',
        session_index: 1,
        session_total: 2,
        start_time: '2026-05-06T07:00:00.000Z',
        end_time: '2026-05-06T08:00:00.000Z',
      }),
    ];
    const cards = aggregate(bookings);
    expect(cards).toHaveLength(1);
    expect(cards[0].groupKey).toBe('g-1');
    expect(cards[0].partySize).toBe(2);
    expect(cards[0].sessionCount).toBe(2);
    expect(cards[0].timeRange).toBe('14:00 – 16:00');
    expect(cards[0].bookings).toHaveLength(4);
  });
});

describe('aggregate — sort order', () => {
  it('sorts cards by earliest start_time ascending', () => {
    const bookings = [
      mkBooking({ id: 'late', start_time: '2026-05-08T06:00:00.000Z', end_time: '2026-05-08T07:00:00.000Z' }),
      mkBooking({ id: 'early', start_time: '2026-05-06T06:00:00.000Z', end_time: '2026-05-06T07:00:00.000Z' }),
      mkBooking({ id: 'mid', start_time: '2026-05-07T06:00:00.000Z', end_time: '2026-05-07T07:00:00.000Z' }),
    ];
    const cards = aggregate(bookings);
    expect(cards.map((c) => c.groupKey)).toEqual(['early', 'mid', 'late']);
  });
});

describe('aggregate — repro of Pien screenshot (5 bookings → 2 cards)', () => {
  it('5/6 4 bookings (M×N) + 5/6 14:00 1 lone booking = 2 cards', () => {
    const bookings: BookingRecord[] = [
      // group of 4: 5/6 14:00–16:00 × 2 people
      mkBooking({ id: 'b1', group_id: 'g-mn', session_group_id: 'sg-a', start_time: '2026-05-06T06:00:00.000Z', end_time: '2026-05-06T07:00:00.000Z', group_size: 2, session_total: 2 }),
      mkBooking({ id: 'b2', group_id: 'g-mn', session_group_id: 'sg-a', start_time: '2026-05-06T07:00:00.000Z', end_time: '2026-05-06T08:00:00.000Z', group_size: 2, session_total: 2 }),
      mkBooking({ id: 'b3', group_id: 'g-mn', session_group_id: 'sg-b', start_time: '2026-05-06T06:00:00.000Z', end_time: '2026-05-06T07:00:00.000Z', group_size: 2, session_total: 2 }),
      mkBooking({ id: 'b4', group_id: 'g-mn', session_group_id: 'sg-b', start_time: '2026-05-06T07:00:00.000Z', end_time: '2026-05-06T08:00:00.000Z', group_size: 2, session_total: 2 }),
      // lone booking: same day 5/6 14:00 但與上組 group_id 不同（另一單獨預約）
      mkBooking({ id: 'b5', start_time: '2026-05-06T06:00:00.000Z', end_time: '2026-05-06T07:00:00.000Z' }),
    ];
    const cards = aggregate(bookings);
    expect(cards).toHaveLength(2);
    const groupCard = cards.find((c) => c.groupKey === 'g-mn');
    const loneCard = cards.find((c) => c.groupKey === 'b5');
    expect(groupCard?.bookings).toHaveLength(4);
    expect(loneCard?.bookings).toHaveLength(1);
  });
});
