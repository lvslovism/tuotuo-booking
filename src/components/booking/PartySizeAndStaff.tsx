import { useMerchant } from '../../hooks/useMerchant';
import { Button } from '../ui/Button';
import type { Resource, StaffSelectionMode, GroupDiscount } from '../../types';

interface Props {
  resources: Resource[];
  staffMode: StaffSelectionMode;
  groupEnabled: boolean;
  maxPeople: number;
  multiSessionEnabled: boolean;
  maxSessions: number;
  sessionCount: number;
  groupDiscount?: GroupDiscount;
  people: number;
  staffId: string | null;
  serviceDurationMinutes?: number;
  onChangePeople: (n: number) => void;
  onChangeSessions: (n: number) => void;
  onChangeStaff: (resource: Resource | null) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function PartySizeAndStaff({
  resources,
  staffMode,
  groupEnabled,
  maxPeople,
  multiSessionEnabled,
  maxSessions,
  sessionCount,
  groupDiscount,
  people,
  staffId,
  serviceDurationMinutes,
  onChangePeople,
  onChangeSessions,
  onChangeStaff,
  onConfirm,
  onBack,
}: Props) {
  const { merchant } = useMerchant();
  const termProvider = merchant?.terminology?.provider || '服務人員';
  const termBooking = merchant?.terminology?.booking || '預約';

  const showPartySize = groupEnabled && maxPeople >= 2;
  const showSessionCount = multiSessionEnabled && maxSessions >= 2;
  const showStaffPicker = staffMode !== 'hidden' && people === 1;

  const peopleOptions = Array.from({ length: maxPeople }, (_, i) => i + 1);
  const sessionOptions = Array.from({ length: maxSessions }, (_, i) => i + 1);
  const hasDuration =
    typeof serviceDurationMinutes === 'number' &&
    Number.isFinite(serviceDurationMinutes) &&
    serviceDurationMinutes > 0;

  // Auto-assign option removed — picker visible ⇒ explicit pick required.
  const canContinue = !showStaffPicker || staffId !== null;

  const visualSelectedId = people >= 2 ? null : staffId;

  return (
    <div className="space-y-4 theme-enter">
      <div className="flex items-center justify-between mb-1">
        <h2 className="theme-title text-lg">
          {(() => {
            const parts: string[] = [];
            if (showPartySize) parts.push(`${termBooking}人數`);
            if (showSessionCount) parts.push('堂數');
            if (showStaffPicker || (!showPartySize && !showSessionCount)) parts.push(termProvider);
            return `選擇${parts.join('與')}`;
          })()}
        </h2>
        <button
          onClick={onBack}
          className="text-sm hover:underline"
          style={{ color: 'var(--t-primary)' }}
        >
          ← 上一步
        </button>
      </div>
      <div className="theme-gold-divider" />

      {/* People selector */}
      {showPartySize && (
        <div className="theme-card p-4">
          <h3 className="font-medium mb-3" style={{ color: 'var(--t-text)' }}>
            {termBooking}人數
          </h3>
          <div className="flex gap-2">
            {peopleOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChangePeople(n)}
                className="flex-1 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: `1px solid ${people === n ? 'var(--t-primary)' : 'var(--t-line)'}`,
                  background: people === n ? 'var(--t-primary-soft)' : 'transparent',
                  color: people === n ? 'var(--t-primary)' : 'var(--t-sub)',
                  fontWeight: people === n ? 600 : 500,
                }}
              >
                {n === 1 ? '1 人' : `${n} 人同行`}
              </button>
            ))}
          </div>
          {groupDiscount?.description &&
            people >= (groupDiscount.min_people_or_sessions ?? 2) && (
              <p
                className="mt-3 text-sm rounded-lg px-3 py-2"
                style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}
              >
                💡 {groupDiscount.description}
              </p>
            )}
        </div>
      )}

      {/* Session count (堂數) selector */}
      {showSessionCount && (
        <div className="theme-card p-4">
          <h3 className="font-medium mb-3" style={{ color: 'var(--t-text)' }}>
            堂數
          </h3>
          <div className="flex gap-2">
            {sessionOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChangeSessions(n)}
                className="flex-1 py-2.5 rounded-lg text-sm transition-all flex flex-col items-center justify-center gap-0.5 leading-tight"
                style={{
                  border: `1px solid ${sessionCount === n ? 'var(--t-primary)' : 'var(--t-line)'}`,
                  background: sessionCount === n ? 'var(--t-primary-soft)' : 'transparent',
                  color: sessionCount === n ? 'var(--t-primary)' : 'var(--t-sub)',
                  fontWeight: sessionCount === n ? 600 : 500,
                }}
              >
                <span>{`${n} 堂`}</span>
                {hasDuration && (
                  <span
                    className="text-xs"
                    style={{ color: 'var(--t-sub)', fontWeight: 400 }}
                  >
                    {n * (serviceDurationMinutes as number)} 分鐘
                  </span>
                )}
              </button>
            ))}
          </div>
          {sessionCount >= 2 && (
            <p
              className="mt-3 text-sm rounded-lg px-3 py-2"
              style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}
            >
              💡 同一位{termProvider}、連續時段，每堂優惠 $100
            </p>
          )}
        </div>
      )}

      {/* Staff picker (only when 1 人 + staff_mode != hidden) */}
      {showStaffPicker && (
        <div className="space-y-3">
          {showPartySize && (
            <h3 className="font-medium" style={{ color: 'var(--t-text)' }}>
              選擇{termProvider}
            </h3>
          )}
          <div className="space-y-3">
            {resources.map((r) => (
              <button
                key={r.id}
                onClick={() => onChangeStaff(r)}
                className="theme-service-card block w-full text-left"
                style={{
                  minHeight: 64,
                  borderColor: visualSelectedId === r.id ? 'var(--t-primary)' : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  {r.avatar_url ? (
                    <img
                      src={r.avatar_url}
                      alt={r.name}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ border: '1px solid var(--t-line)' }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}
                    >
                      👤
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="theme-title"
                      style={{ fontSize: '1rem', color: 'var(--t-text)' }}
                    >
                      {r.name}
                    </h4>
                    {(r.title || r.bio) && (
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--t-sub)' }}>
                        {r.title || r.bio}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2+ 人 → auto-assign notice */}
      {people >= 2 && (
        <div
          className="theme-card p-4 text-center"
          style={{ background: 'var(--t-primary-soft)' }}
        >
          <p className="font-medium" style={{ color: 'var(--t-primary)' }}>
            系統將為您安排 {people} 位{termProvider}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--t-sub)' }}>
            依時段可用情況自動分配
          </p>
        </div>
      )}

      <Button
        variant="accent"
        size="lg"
        onClick={onConfirm}
        disabled={!canContinue}
        className="w-full"
      >
        下一步
      </Button>
    </div>
  );
}
