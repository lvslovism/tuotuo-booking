import { useState } from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import type { GuestInfo, CompanionInfo } from '../../types';

interface Props {
  people?: number;
  onSubmit: (info: GuestInfo, companion?: CompanionInfo) => void;
  onBack: () => void;
}

export function GuestForm({ people = 1, onSubmit, onBack }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<GuestInfo['gender']>('');
  const [companionName, setCompanionName] = useState('');
  const [companionGender, setCompanionGender] = useState<CompanionInfo['gender']>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showCompanion = people >= 2;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '請輸入姓名';
    if (!phone.trim()) errs.phone = '請輸入手機號碼';
    else if (!/^09\d{8}$/.test(phone.trim())) errs.phone = '請輸入有效的手機號碼（09開頭10碼）';
    if (!gender) errs.gender = '請選擇性別';
    if (showCompanion && !companionName.trim()) errs.companionName = '請輸入同行者姓名';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const guest: GuestInfo = { name: name.trim(), phone: phone.trim(), gender };
      const companion: CompanionInfo | undefined = showCompanion
        ? { name: companionName.trim(), gender: companionGender }
        : undefined;
      onSubmit(guest, companion);
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

      {/* Companion fields — only when people >= 2 */}
      {showCompanion && (
        <>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-base font-bold text-gray-800 mb-3">同行者資料</h3>
          </div>

          {/* Companion name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              同行者姓名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              placeholder="請輸入同行者姓名"
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors',
                errors.companionName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary',
              )}
            />
            {errors.companionName && <p className="text-xs text-red-500 mt-1">{errors.companionName}</p>}
          </div>

          {/* Companion gender (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">同行者性別（選填）</label>
            <div className="flex gap-3">
              {[
                { value: 'male' as const, label: '男' },
                { value: 'female' as const, label: '女' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCompanionGender(companionGender === opt.value ? '' : opt.value)}
                  className={cn(
                    'flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    companionGender === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

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
