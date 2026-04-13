import { useState } from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import type { GuestInfo } from '../../types';

interface Props {
  onSubmit: (info: GuestInfo) => void;
  onBack: () => void;
}

export function GuestForm({ onSubmit, onBack }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<GuestInfo['gender']>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '請輸入姓名';
    if (!phone.trim()) errs.phone = '請輸入手機號碼';
    else if (!/^09\d{8}$/.test(phone.trim())) errs.phone = '請輸入有效的手機號碼（09開頭10碼）';
    if (!gender) errs.gender = '請選擇性別';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name: name.trim(), phone: phone.trim(), gender });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">填寫預約資料</h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="請輸入您的姓名"
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors',
            errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary',
          )}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912345678"
          maxLength={10}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors',
            errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary',
          )}
        />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
        <div className="flex gap-3">
          {[
            { value: 'male' as const, label: '男' },
            { value: 'female' as const, label: '女' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGender(opt.value)}
              className={cn(
                'flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all',
                gender === opt.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" size="md" onClick={onBack} className="flex-1">
          上一步
        </Button>
        <Button type="submit" variant="accent" size="md" className="flex-1">
          下一步
        </Button>
      </div>
    </form>
  );
}
