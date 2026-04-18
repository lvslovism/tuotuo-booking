import { useEffect, useState, useMemo } from 'react';
import { fetchCalendarStatus } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { toTaiwanMonth, getTodayTaiwan } from '../../utils/date';
import { Loading } from '../ui/Loading';
import type { CalendarDay } from '../../types';

interface Props {
  serviceId: string;
  selectedDate: string;
  people?: number;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function Calendar({ serviceId, selectedDate, people = 1, onSelectDate }: Props) {
  const { merchantCode } = useMerchant();
  const [month, setMonth] = useState(() => toTaiwanMonth(new Date()));
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantCode) return;
    setLoading(true);
    fetchCalendarStatus(merchantCode, month, serviceId, people)
      .then((data) => setDays(data.days || []))
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, [merchantCode, month, serviceId, people]);

  const today = getTodayTaiwan();

  const { year, monthNum, grid } = useMemo(() => {
    const [y, m] = month.split('-').map(Number);
    const firstDay = new Date(y, m - 1, 1).getDay();
    const daysInMonth = new Date(y, m, 0).getDate();
    const dayMap = new Map(days.map((d) => [d.date, d]));
    const cells: (CalendarDay & { day: number } | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const info = dayMap.get(dateStr);
      cells.push({
        day: d,
        date: dateStr,
        has_slots: info?.has_slots ?? false,
        is_closed: info?.is_closed ?? false,
      });
    }
    return { year: y, monthNum: m, grid: cells };
  }, [month, days]);

  const prevMonth = () => setMonth(toTaiwanMonth(new Date(year, monthNum - 2, 1)));
  const nextMonth = () => setMonth(toTaiwanMonth(new Date(year, monthNum, 1)));
  const canGoPrev = month > toTaiwanMonth(new Date());

  return (
    <div className="theme-card p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--t-sub)', opacity: canGoPrev ? 1 : 0.3 }}
        >
          ‹
        </button>
        <h3 className="theme-title" style={{ fontSize: '1rem' }}>
          {year} 年 {monthNum} 月
        </h3>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--t-sub)' }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="theme-label text-center py-1">
            {w}
          </div>
        ))}
      </div>

      {loading ? (
        <Loading text="" />
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} />;
            const isPast = cell.date < today;
            const disabled = isPast || cell.is_closed || !cell.has_slots;
            const isSelected = cell.date === selectedDate;

            let color = 'var(--t-text)';
            let background: string | undefined;
            let fontWeight: number | undefined;
            if (disabled) color = 'var(--t-muted)';
            if (isSelected) {
              background = 'var(--t-primary)';
              color = '#fff';
              fontWeight = 700;
            } else if (!disabled && cell.has_slots) {
              fontWeight = 500;
            }
            if (cell.is_closed && !isPast && !isSelected) color = '#E6A6A6';

            return (
              <button
                key={cell.date}
                disabled={disabled}
                onClick={() => onSelectDate(cell.date)}
                className="h-10 rounded-lg text-sm transition-all"
                style={{
                  color,
                  background,
                  fontWeight,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--t-sub)' }}>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--t-primary)' }} />
          可預約
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--t-muted)' }} />
          不可選
        </span>
      </div>
    </div>
  );
}
