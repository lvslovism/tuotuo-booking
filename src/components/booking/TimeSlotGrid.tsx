import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAvailableSlots } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { formatDateDisplay } from '../../utils/date';
import { cn } from '../../utils/cn';
import { Loading } from '../ui/Loading';
import type { TimeSlot } from '../../types';

interface Props {
  serviceId: string;
  date: string;
  people?: number;
  onSelect: (slot: TimeSlot, sessions: number) => void;
}

export function TimeSlotGrid({ serviceId, date, people = 1, onSelect }: Props) {
  const { merchantCode } = useMerchant();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [sessions, setSessions] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantCode || !date || !serviceId) return;
    setLoading(true);
    fetchAvailableSlots(merchantCode, date, serviceId, people)
      .then((data) => {
        setSlots(data.slots || []);
        setSessions(data.sessions || 1);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [merchantCode, date, serviceId, people]);

  if (!date) return null;

  if (loading) return <Loading text="載入可用時段..." />;

  // When people > 1, a slot is only available if it has enough resources
  const effectiveSlots = slots.map((s) => ({
    ...s,
    available: s.available && s.available_resources >= people,
  }));

  const available = effectiveSlots.filter((s) => s.available);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-3">
      <h3 className="font-bold text-gray-800 mb-3">
        {formatDateDisplay(date)} 可選時段
      </h3>

      {people > 1 && available.length === 0 && slots.some((s) => s.available) && (
        <p className="text-center text-amber-600 bg-amber-50 rounded-lg py-3 px-4 mb-3 text-sm">
          此日期無法同時容納 {people} 人，請選擇其他日期或減少人數
        </p>
      )}

      {available.length === 0 ? (
        <div className="text-center py-6 space-y-3">
          <p className="text-text-secondary">此日期暫無可用時段</p>
          <button
            onClick={() =>
              navigate(`/s/${merchantCode}/waitlist?service_id=${serviceId}&service_name=${encodeURIComponent('')}`)
            }
            className="bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/20 transition-all"
          >
            加入候補名單
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {effectiveSlots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => onSelect(slot, sessions)}
              className={cn(
                'h-11 rounded-lg text-sm font-medium transition-all relative',
                slot.available
                  ? slot.recommended
                    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-300 hover:bg-amber-100 active:scale-[0.97]'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-[0.97]'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through',
              )}
            >
              {slot.recommended && <span className="absolute -top-1 -right-1 text-xs">⭐</span>}
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
