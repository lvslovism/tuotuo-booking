import type { BookingStep } from '../../types';
import { cn } from '../../utils/cn';

const steps: { key: BookingStep; label: string }[] = [
  { key: 'service', label: '選服務' },
  { key: 'datetime', label: '選時段' },
  { key: 'info', label: '填資料' },
  { key: 'confirm', label: '確認' },
];

export function Stepper({ current }: { current: BookingStep }) {
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                i < currentIdx && 'bg-primary text-white',
                i === currentIdx && 'bg-accent text-white',
                i > currentIdx && 'bg-gray-200 text-gray-400',
              )}
            >
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span
              className={cn(
                'text-xs whitespace-nowrap',
                i <= currentIdx ? 'text-primary font-medium' : 'text-gray-400',
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-2 mt-[-16px]',
                i < currentIdx ? 'bg-primary' : 'bg-gray-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
