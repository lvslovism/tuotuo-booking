import { useEffect, useState, useMemo } from 'react';
import { fetchCalendarStatus } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { toTaiwanMonth, getTodayTaiwan } from '../../utils/date';
import { cn } from '../../utils/cn';
import { Loading } from '../ui/Loading';
import type { CalendarDay } from '../../types';

interface Props {
  serviceId: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function Calendar({ serviceId, selectedDate, onSelectDate }: Props) {
  const { merchantCode } = useMerchant();
  const [month, setMonth] = useState(() => toTaiwanMonth(new Date()));
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantCode) return;
    setLoading(true);
    fetchCalendarStatus(merchantCode, month)
      .then((data) => setDays(data.days || []))
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, [merchantCode, month, serviceId]);

  const today = getTodayTaiwan();

  // Build the calendar grid
  const { year, monthNum, grid } = useMemo(() => {
    const [y, m] = month.split('-').map(Number);
    const firstDay = new Date(y, m - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(y, m, 0).getDate();
    const dayMap = new Map(days.map((d) => [d.date, d]));

    const cells: (CalendarDay & { day: number } | null)[] = [];
    // Leading empty cells
    for (let i = 0; i < firstDay; i++) cells.push(null);
    // Day cells
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

  const prevMonth = () => {
    const d = new Date(year, monthNum - 2, 1);
    setMonth(toTaiwanMonth(d));
  };

  const nextMonth = () => {
    const d = new Date(year, monthNum, 1);
    setMonth(toTaiwanMonth(d));
  };

  const canGoPrev = month > toTaiwanMonth(new Date());

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          ‹
        </button>
        <h3 className="font-bold text-gray-800">
          {year} 年 {monthNum} 月
        </h3>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          ›
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs text-text-secondary py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading ? (
        <Loading text="" />
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} />;

            const isPast = cell.date < today;
            const disabled = isPast || cell.is_closed || !cell.has_slots;
            const isSelected = cell.date === selectedDate;

            return (
              <button
                key={cell.date}
                disabled={disabled}
                onClick={() => onSelectDate(cell.date)}
                className={cn(
                  'h-10 rounded-lg text-sm transition-all',
                  disabled && 'text-gray-300 cursor-not-allowed',
                  !disabled && !isSelected && 'hover:bg-primary/10 text-gray-700',
                  !disabled && cell.has_slots && !isSelected && 'font-medium',
                  isSelected && 'bg-primary text-white font-bold',
                  cell.is_closed && !isPast && 'text-red-300',
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          可預約
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
          不可選
        </span>
      </div>
    </div>
  );
}
