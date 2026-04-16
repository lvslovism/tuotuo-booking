import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMerchant } from '../hooks/useMerchant';
import { addToWaitlist } from '../api/booking-api';
import { cn } from '../utils/cn';

export function WaitlistPage() {
  const { merchantCode } = useMerchant();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const serviceId = params.get('service_id') || '';
  const serviceName = params.get('service_name') || '';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('21:00');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Generate next 14 dates for selection
  const candidateDates = useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const value = d.toISOString().slice(0, 10);
      const label = `${d.getMonth() + 1}/${d.getDate()} (${weekDays[d.getDay()]})`;
      dates.push({ value, label });
    }
    return dates;
  }, []);

  const toggleDate = (dateVal: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateVal) ? prev.filter((d) => d !== dateVal) : [...prev, dateVal]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) return setError('請輸入姓名');
    if (!phone.trim()) return setError('請輸入電話');
    if (selectedDates.length === 0) return setError('請選擇至少一個偏好日期');
    if (!serviceId) return setError('缺少服務資訊');

    setSubmitting(true);
    setError('');
    try {
      await addToWaitlist({
        merchant_code: merchantCode,
        service_id: serviceId,
        preferred_dates: selectedDates,
        preferred_time_start: timeStart,
        preferred_time_end: timeEnd,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || '加入候補失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-4 mt-4">
        <div className="text-4xl">🎉</div>
        <h2 className="text-lg font-bold text-primary">已加入候補名單</h2>
        <p className="text-text-secondary text-sm">有空位時我們會通知您</p>
        <button
          onClick={() => navigate(`/s/${merchantCode}`)}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
        >
          返回首頁
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary">加入候補</h1>

      {serviceName && (
        <div className="bg-primary/5 rounded-lg px-4 py-3">
          <p className="text-sm text-text-secondary">服務項目</p>
          <p className="font-medium text-gray-800">{serviceName}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="請輸入姓名"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* 電話 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">電話 *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="請輸入手機號��"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* 偏好日期（多選） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">偏好日期 *（可多選）</label>
          <div className="grid grid-cols-4 gap-2">
            {candidateDates.map((d) => (
              <button
                key={d.value}
                onClick={() => toggleDate(d.value)}
                className={cn(
                  'text-xs py-2 px-1 rounded-lg border transition-all',
                  selectedDates.includes(d.value)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 偏好時段 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">偏好時段</label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-gray-400">~</span>
            <input
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={cn(
            'w-full py-3 rounded-lg font-medium text-white transition-all',
            submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'
          )}
        >
          {submitting ? '提交���...' : '加入候補名單'}
        </button>
      </div>
    </div>
  );
}
