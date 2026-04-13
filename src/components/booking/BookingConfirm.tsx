import { useState } from 'react';
import { useMerchant } from '../../hooks/useMerchant';
import { Button } from '../ui/Button';
import { formatDateDisplay } from '../../utils/date';
import type { Service, TimeSlot, GuestInfo } from '../../types';

interface Props {
  service: Service;
  date: string;
  slot: TimeSlot;
  sessions: number;
  guestInfo: GuestInfo;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

export function BookingConfirm({ service, date, slot, sessions, guestInfo, onConfirm, onBack }: Props) {
  const { merchant } = useMerchant();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = service.price * sessions;
  const terminology = merchant?.terminology;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onConfirm();
    } catch (e: any) {
      setError(e.message || '預約失敗，請稍後再試');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">確認{terminology?.booking || '預約'}資訊</h2>

        <div className="divide-y divide-gray-100">
          <Row label={terminology?.service || '服務'} value={service.name} />
          <Row label="日期" value={formatDateDisplay(date)} />
          <Row label="時間" value={slot.time} />
          <Row label="時長" value={`${service.service_minutes || service.duration_minutes} 分鐘`} />
          {sessions > 1 && <Row label="堂數" value={`${sessions} 堂`} />}
          <Row label="姓名" value={guestInfo.name} />
          <Row label="手機" value={guestInfo.phone} />
          <Row label="性別" value={guestInfo.gender === 'male' ? '男' : '女'} />
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="font-medium text-gray-700">費用</span>
          <span className="text-xl font-bold text-accent">NT${totalPrice}</span>
        </div>
      </div>

      {/* Disclaimer */}
      {merchant?.disclaimer && (
        <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          <p className="font-medium mb-1">注意事項</p>
          {merchant.disclaimer}
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-xl p-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Actions */}
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
      <span className="text-text-secondary">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}
