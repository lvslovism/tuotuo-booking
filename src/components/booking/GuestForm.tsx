import { useState } from 'react';
import { Button } from '../ui/Button';
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
    <form onSubmit={handleSubmit} className="theme-card p-5 space-y-4 theme-enter">
      <h2 className="theme-title text-lg">填寫預約資料</h2>

      <Field label="姓名" error={errors.name}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="請輸入您的姓名"
          className="theme-input"
          style={errors.name ? { borderColor: '#E57373' } : undefined}
        />
      </Field>

      <Field label="手機號碼" error={errors.phone}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912345678"
          maxLength={10}
          className="theme-input"
          style={errors.phone ? { borderColor: '#E57373' } : undefined}
        />
      </Field>

      <Field label="性別" error={errors.gender}>
        <div className="flex gap-3">
          {[
            { value: 'male' as const, label: '男' },
            { value: 'female' as const, label: '女' },
          ].map((opt) => {
            const active = gender === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGender(opt.value)}
                className="flex-1 py-2.5 text-sm font-medium transition-all"
                style={{
                  borderRadius: 'var(--t-btn-radius)',
                  border: `1px solid ${active ? 'var(--t-primary)' : 'var(--t-line)'}`,
                  background: active ? 'var(--t-primary-soft)' : 'transparent',
                  color: active ? 'var(--t-primary)' : 'var(--t-sub)',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>

      {showCompanion && (
        <>
          <div className="pt-2" style={{ borderTop: '1px solid var(--t-line)' }}>
            <h3 className="theme-title text-base mt-4 mb-3">同行者資料</h3>
          </div>

          <Field label="同行者姓名" required error={errors.companionName}>
            <input
              type="text"
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              placeholder="請輸入同行者姓名"
              className="theme-input"
              style={errors.companionName ? { borderColor: '#E57373' } : undefined}
            />
          </Field>

          <Field label="同行者性別（選填）">
            <div className="flex gap-3">
              {[
                { value: 'male' as const, label: '男' },
                { value: 'female' as const, label: '女' },
              ].map((opt) => {
                const active = companionGender === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCompanionGender(active ? '' : opt.value)}
                    className="flex-1 py-2.5 text-sm font-medium transition-all"
                    style={{
                      borderRadius: 'var(--t-btn-radius)',
                      border: `1px solid ${active ? 'var(--t-primary)' : 'var(--t-line)'}`,
                      background: active ? 'var(--t-primary-soft)' : 'transparent',
                      color: active ? 'var(--t-primary)' : 'var(--t-sub)',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </>
      )}

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

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--t-text)' }}>
        {label}
        {required && <span style={{ color: '#E57373' }}> *</span>}
      </label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: '#E57373' }}>{error}</p>}
    </div>
  );
}
