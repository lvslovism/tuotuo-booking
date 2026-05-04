import { useState } from 'react';
import { useMerchant } from '../../hooks/useMerchant';
import { Button } from '../ui/Button';
import { formatDateDisplay } from '../../utils/date';
import type { Service, SessionSlot, GuestInfo, CompanionInfo } from '../../types';

interface Props {
  service: Service;
  sessionSlots: SessionSlot[];
  sessionCount: number;
  people: number;
  guestInfo: GuestInfo;
  companionInfo?: CompanionInfo;
  staffName?: string | null;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

export function BookingConfirm({
  service, sessionSlots, sessionCount, people, guestInfo, companionInfo, staffName, onConfirm, onBack,
}: Props) {
  const { merchant } = useMerchant();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const terminology = merchant?.terminology;
  const groupDiscount = merchant?.pricing_rules?.group_discount;
  const termProvider = terminology?.provider || '服務人員';

  const providerDisplay =
    people >= 2
      ? `系統將為您安排 ${people} 位${termProvider}（依時段可用情況自動分配）`
      : staffName
        ? staffName
        : `系統將為您安排最合適的${termProvider}`;
  const totalSessions = people * sessionCount;
  const isGroup = totalSessions >= (groupDiscount?.min_people_or_sessions ?? 2);
  const discountPerSession = isGroup && groupDiscount?.enabled ? groupDiscount.discount_per_session : 0;
  const pricePerSession = service.price - discountPerSession;
  const totalOriginal = service.price * totalSessions;
  const totalDiscount = discountPerSession * totalSessions;
  const totalPrice = pricePerSession * totalSessions;

  const isMultiSession = sessionCount >= 2;
  // 折抵命名：1 人 N 堂 → 「連續時段優惠」；M 人同行 → 「同行優惠」
  const discountLabel = people === 1 && isMultiSession ? '連續時段優惠' : '同行優惠';

  // Defensive sort — Phase 7 B1: sessions are computed in order from a single
  // start point, but a corrupted restore payload could arrive out-of-order.
  // Always render earliest first.
  const orderedSlots = isMultiSession
    ? [...sessionSlots].sort((a, b) => {
        const ka = `${a.date}T${a.time}`;
        const kb = `${b.date}T${b.time}`;
        return ka.localeCompare(kb);
      })
    : sessionSlots;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onConfirm();
    } catch (e: unknown) {
      setError((e as Error).message || '預約失敗，請稍後再試');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 theme-enter">
      <div className="theme-card p-5 space-y-3">
        <h2 className="theme-title text-lg">確認{terminology?.booking || '預約'}資訊</h2>

        <div className="divide-y" style={{ borderColor: 'var(--t-line)' }}>
          <Row label={terminology?.service || '服務'} value={service.name} />
          <Row label={termProvider} value={providerDisplay} />
          {!isMultiSession && (
            <>
              <Row label="日期" value={formatDateDisplay(orderedSlots[0]?.date || '')} />
              <Row label="時間" value={orderedSlots[0]?.time || ''} />
            </>
          )}
          {isMultiSession && (
            <div className="py-2.5 text-sm">
              <div className="mb-1.5" style={{ color: 'var(--t-sub)' }}>堂數時段</div>
              <ul className="space-y-1">
                {orderedSlots.map((s, i) => (
                  <li key={i} className="flex justify-between" style={{ color: 'var(--t-text)' }}>
                    <span>第 {i + 1} 堂</span>
                    <span className="font-medium">
                      {formatDateDisplay(s.date)} {s.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Row label="時長" value={`${service.duration_minutes} 分鐘 / 堂`} />
          {people > 1 && <Row label="人數" value={`${people} 人`} />}
          {sessionCount > 1 && <Row label="堂數" value={`${sessionCount} 堂`} />}
          <Row label="姓名" value={guestInfo.name} />
          <Row label="手機" value={guestInfo.phone} />
          <Row label="性別" value={guestInfo.gender === 'male' ? '男' : '女'} />
          {companionInfo?.name && (
            <Row
              label="同行者"
              value={`${companionInfo.name}${companionInfo.gender ? (companionInfo.gender === 'male' ? '（男）' : '（女）') : ''}`}
            />
          )}
        </div>

        <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--t-line)' }}>
          {isGroup && discountPerSession > 0 ? (
            <>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--t-sub)' }}>標準價</span>
                <span style={{ color: 'var(--t-text)' }}>
                  {totalSessions} 堂 × NT${service.price.toLocaleString()} = NT${totalOriginal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--t-sub)' }}>{discountLabel}</span>
                <span style={{ color: 'var(--t-success)' }}>
                  {totalSessions} 堂 × -NT${discountPerSession.toLocaleString()} = -NT${totalDiscount.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 flex justify-between items-center" style={{ borderTop: '1px dashed var(--t-line)' }}>
                <span className="font-medium" style={{ color: 'var(--t-text)' }}>應付總額</span>
                <span className="theme-price" style={{ fontSize: '1.4rem' }}>
                  NT${totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--t-sub)' }}>付款方式</span>
                <span style={{ color: 'var(--t-text)' }}>到店付款</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: 'var(--t-text)' }}>費用</span>
              <span className="theme-price" style={{ fontSize: '1.4rem' }}>
                NT${totalPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {merchant?.disclaimer && (
        <div className="theme-disclaimer">
          <p className="font-medium mb-1" style={{ color: 'var(--t-text)' }}>注意事項</p>
          {merchant.disclaimer}
        </div>
      )}

      {error && (
        <div className="rounded-xl p-3 text-sm text-center" style={{ background: '#FDEAEA', color: '#B03A3A' }}>
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} disabled={submitting} className="flex-1">
          上一步
        </Button>
        <Button variant="accent" size="lg" onClick={handleConfirm} disabled={submitting} className="flex-1">
          {submitting ? '預約中...' : '確認預約'}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 text-sm">
      <span style={{ color: 'var(--t-sub)' }}>{label}</span>
      <span className="font-medium" style={{ color: 'var(--t-text)' }}>{value}</span>
    </div>
  );
}
