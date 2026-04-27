import type { BookingStep } from '../../types';

function buildSteps(hasPartyStep: boolean): { key: BookingStep; label: string }[] {
  const steps: { key: BookingStep; label: string }[] = [{ key: 'service', label: '選服務' }];
  if (hasPartyStep) steps.push({ key: 'party', label: '人數·師傅' });
  steps.push(
    { key: 'date', label: '選日期' },
    { key: 'time', label: '選時段' },
    { key: 'info', label: '填資料' },
    { key: 'confirm', label: '確認' },
  );
  return steps;
}

interface Props {
  current: BookingStep;
  hasPartyStep?: boolean;
}

export function Stepper({ current, hasPartyStep = false }: Props) {
  const steps = buildSteps(hasPartyStep);
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const bg = done || active ? 'var(--t-primary)' : 'var(--t-bg-soft)';
        const color = done || active ? '#fff' : 'var(--t-muted)';
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                style={{ background: bg, color }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className="text-xs whitespace-nowrap"
                style={{
                  color: i <= currentIdx ? 'var(--t-primary)' : 'var(--t-muted)',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mt-[-16px]"
                style={{ background: i < currentIdx ? 'var(--t-primary)' : 'var(--t-line)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
