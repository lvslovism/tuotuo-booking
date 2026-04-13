import { useEffect, useState } from 'react';
import { fetchAvailableSlots } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { formatDateDisplay } from '../../utils/date';
import { cn } from '../../utils/cn';
import { Loading } from '../ui/Loading';
import type { TimeSlot } from '../../types';

interface Props {
  serviceId: string;
  date: string;
  onSelect: (slot: TimeSlot, sessions: number) => void;
}

export function TimeSlotGrid({ serviceId, date, onSelect }: Props) {
  const { merchantCode } = useMerchant();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [sessions, setSessions] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantCode || !date || !serviceId) return;
    setLoading(true);
    fetchAvailableSlots(merchantCode, date, serviceId)
      .then((data) => {
        setSlots(data.slots || []);
        setSessions(data.sessions || 1);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [merchantCode, date, serviceId]);

  if (!date) return null;

  if (loading) return <Loading text="載入可用時段..." />;

  const available = slots.filter((s) => s.available);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-3">
      <h3 className="font-bold text-gray-800 mb-3">
        {formatDateDisplay(date)} 可選時段
      </h3>

      {available.length === 0 ? (
        <p className="text-center text-text-secondary py-6">
          此日期暫無可用時段
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => onSelect(slot, sessions)}
              className={cn(
                'h-11 rounded-lg text-sm font-medium transition-all',
                slot.available
                  ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-[0.97]'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through',
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
