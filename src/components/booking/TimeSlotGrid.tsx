import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAvailableSlots } from '../../api/booking-api';
import { useMerchant } from '../../hooks/useMerchant';
import { useTheme } from '../../hooks/useTheme';
import { formatDateDisplay } from '../../utils/date';
import { Loading } from '../ui/Loading';
import type { TimeSlot } from '../../types';

interface Props {
  serviceId: string;
  date: string;
  people?: number;
  resourceId?: string | null;
  // Phase 7 B1: caller passes sessions=N so EF returns only starts where N
  // back-to-back occurrences are all available (continuous validation).
  sessions?: number;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotGrid({ serviceId, date, people = 1, resourceId = null, sessions = 1, onSelect }: Props) {
  const { merchantCode } = useMerchant();
  const { template } = useTheme();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    if (!merchantCode || !date || !serviceId) return;
    setLoading(true);
    setSelectedTime('');
    fetchAvailableSlots(merchantCode, date, serviceId, people, resourceId, sessions)
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [merchantCode, date, serviceId, people, resourceId, sessions]);

  if (!date) return null;
  if (loading) return <Loading text="載入可用時段..." />;

  const effectiveSlots = slots.map((s) => ({
    ...s,
    available: s.available && s.available_resources >= people,
  }));
  const available = effectiveSlots.filter((s) => s.available);

  const handlePick = (slot: TimeSlot) => {
    setSelectedTime(slot.time);
    onSelect(slot);
  };

  return (
    <div className="theme-card p-4 mt-3 theme-enter">
      <h3 className="theme-title mb-3" style={{ fontSize: '0.95rem' }}>
        {formatDateDisplay(date)} 可選時段
      </h3>

      {people > 1 && available.length === 0 && slots.some((s) => s.available) && (
        <p
          className="text-center rounded-lg py-3 px-4 mb-3 text-sm"
          style={{ background: 'color-mix(in srgb, var(--t-accent) 15%, transparent)', color: 'var(--t-accent)' }}
        >
          此日期無法同時容納 {people} 人，請選擇其他日期或減少人數
        </p>
      )}

      {available.length === 0 ? (
        <div className="text-center py-6 space-y-3">
          <p style={{ color: 'var(--t-sub)' }}>此日期暫無可用時段</p>
          <button
            onClick={() =>
              navigate(`/s/${merchantCode}/waitlist?service_id=${serviceId}&service_name=${encodeURIComponent('')}`)
            }
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'color-mix(in srgb, var(--t-accent) 15%, transparent)',
              color: 'var(--t-accent)',
            }}
          >
            加入候補名單
          </button>
        </div>
      ) : template === 'zen' ? (
        // ─── zen: list style with right-side radio ───
        <ul className="divide-y" style={{ borderColor: 'var(--t-line)' }}>
          {effectiveSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const disabled = !slot.available;
            return (
              <li key={slot.time}>
                <button
                  disabled={disabled}
                  onClick={() => handlePick(slot)}
                  className="w-full flex items-center justify-between py-3 px-1 transition-colors"
                  style={{
                    color: disabled ? 'var(--t-muted)' : 'var(--t-text)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      style={{
                        fontFamily: 'var(--t-font-title)',
                        fontSize: '1rem',
                        color: isSelected ? 'var(--t-primary)' : 'var(--t-text)',
                      }}
                    >
                      {slot.time}
                    </span>
                    {slot.recommended && (
                      <span className="theme-label" style={{ color: 'var(--t-gold)' }}>
                        推薦
                      </span>
                    )}
                  </span>
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{
                      borderColor: isSelected ? 'var(--t-primary)' : 'var(--t-line)',
                      background: isSelected ? 'var(--t-primary)' : 'transparent',
                      boxShadow: isSelected ? 'inset 0 0 0 2px var(--t-card)' : 'none',
                    }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        // ─── warm: two-column grid ───
        <div className="grid grid-cols-2 gap-2.5">
          {effectiveSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const disabled = !slot.available;
            const base = {
              borderRadius: 14,
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.15s',
            };
            return (
              <button
                key={slot.time}
                disabled={disabled}
                onClick={() => handlePick(slot)}
                className="h-12 relative"
                style={{
                  ...base,
                  background: disabled
                    ? '#F3EDE4'
                    : isSelected
                      ? 'var(--t-primary)'
                      : 'var(--t-card)',
                  color: disabled
                    ? 'var(--t-muted)'
                    : isSelected
                      ? '#fff'
                      : 'var(--t-text)',
                  border: `1px solid ${isSelected ? 'var(--t-primary)' : 'var(--t-line)'}`,
                  boxShadow: isSelected ? '0 4px 12px rgba(59,107,94,0.25)' : 'none',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.55 : 1,
                }}
              >
                {slot.recommended && !disabled && (
                  <span className="absolute -top-1 -right-1 text-xs">⭐</span>
                )}
                {slot.time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
