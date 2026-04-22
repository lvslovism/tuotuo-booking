import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import type { GuestInfo, CompanionInfo, Merchant } from '../../types';

interface BookingReturnState {
  serviceId?: string | null;
  staffId?: string | null;
  date?: string;
  time?: string;
}

interface Props {
  people?: number;
  merchant?: Merchant | null;
  merchantCode?: string;
  bookingReturnState?: BookingReturnState;
  onSubmit: (info: GuestInfo, companion?: CompanionInfo) => void;
  onBack: () => void;
}

const LINE_LOGIN_STATE_KEY = 'line_login_state';
const BOOKING_RETURN_KEY = 'wb_booking_return';

function buildLineLoginUrl(channelId: string, merchantCode: string, state: string): string {
  const redirectUri = `${window.location.origin}/s/${merchantCode}/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    state,
    scope: 'profile openid',
    bot_prompt: 'aggressive',
  });
  return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
}

function randomState(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function GuestForm({
  people = 1,
  merchant,
  merchantCode,
  bookingReturnState,
  onSubmit,
  onBack,
}: Props) {
  const { customer, token, mode, setAuth } = useAuth();

  const lineChannelId = merchant?.line_login_channel_id;

  const hasLineIdentity = !!customer?.line_user_id;
  const hasValidGender = customer?.gender === 'male' || customer?.gender === 'female';
  const profileComplete = hasLineIdentity && !!customer?.phone && hasValidGender;
  const showCompanion = people >= 2;

  // Auto-skip for LINE returning customers with complete profile and no companion needed.
  const autoSkipRef = useRef(false);
  useEffect(() => {
    if (autoSkipRef.current) return;
    if (!profileComplete) return;
    if (showCompanion) return; // need companion info → can't auto-skip
    autoSkipRef.current = true;
    onSubmit({
      name: customer!.name,
      phone: customer!.phone!,
      gender: customer!.gender as GuestInfo['gender'],
    });
  }, [profileComplete, showCompanion, customer, onSubmit]);

  if (profileComplete && !showCompanion) {
    // About to auto-skip — render a lightweight placeholder to avoid flashing the form.
    return (
      <div className="theme-card p-5 text-center text-sm" style={{ color: 'var(--t-sub)' }}>
        已從 LINE 帶入您的資料，正在進入下一步...
      </div>
    );
  }

  if (hasLineIdentity) {
    return (
      <LineCustomerForm
        customer={customer!}
        token={token}
        mode={mode}
        setAuth={setAuth}
        showCompanion={showCompanion}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    );
  }

  return (
    <FullAuthForm
      customer={customer}
      lineChannelId={lineChannelId}
      merchantCode={merchantCode}
      bookingReturnState={bookingReturnState}
      showCompanion={showCompanion}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Simplified form for LINE-authenticated customers missing phone/gender
// ───────────────────────────────────────────────────────────────────────────

interface LineCustomerFormProps {
  customer: NonNullable<ReturnType<typeof useAuth>['customer']>;
  token: string | null;
  mode: ReturnType<typeof useAuth>['mode'];
  setAuth: ReturnType<typeof useAuth>['setAuth'];
  showCompanion: boolean;
  onSubmit: (info: GuestInfo, companion?: CompanionInfo) => void;
  onBack: () => void;
}

function LineCustomerForm({
  customer,
  token,
  mode,
  setAuth,
  showCompanion,
  onSubmit,
  onBack,
}: LineCustomerFormProps) {
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [gender, setGender] = useState<GuestInfo['gender']>(
    customer.gender === 'male' || customer.gender === 'female'
      ? (customer.gender as GuestInfo['gender'])
      : '',
  );
  const [companionName, setCompanionName] = useState('');
  const [companionGender, setCompanionGender] = useState<CompanionInfo['gender']>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!validate()) return;
    const guest: GuestInfo = { name: name.trim(), phone: phone.trim(), gender };
    const companion: CompanionInfo | undefined = showCompanion
      ? { name: companionName.trim(), gender: companionGender }
      : undefined;

    // Persist the newly-entered phone/gender/name into local auth state so future
    // re-entries of the form auto-skip. The EF receives these via create-booking body.
    if (token) {
      setAuth(
        token,
        { ...customer, name: guest.name, phone: guest.phone, gender: guest.gender },
        mode,
      );
    }

    onSubmit(guest, companion);
  };

  return (
    <form onSubmit={handleSubmit} className="theme-card p-5 space-y-4 theme-enter">
      <h2 className="theme-title text-lg">填寫預約資料</h2>

      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm"
        style={{ background: 'rgba(6,199,85,0.08)', color: '#06904A' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>已連結 LINE，預約提醒將自動送達</span>
      </div>

      <Field label="姓名" error={errors.name}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="請輸入您的姓名"
          className="theme-input"
          style={errors.name ? { borderColor: '#E57373' } : undefined}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--t-sub)' }}>
          已從 LINE 帶入，可修改為真實姓名
        </p>
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
        <GenderPicker value={gender} onChange={setGender} />
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
            <GenderPicker
              value={companionGender}
              onChange={(v) => setCompanionGender(v === companionGender ? '' : v)}
              allowDeselect
            />
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

// ───────────────────────────────────────────────────────────────────────────
// Full form for customers without any LINE identity
// ───────────────────────────────────────────────────────────────────────────

interface FullAuthFormProps {
  customer: ReturnType<typeof useAuth>['customer'];
  lineChannelId?: string;
  merchantCode?: string;
  bookingReturnState?: BookingReturnState;
  showCompanion: boolean;
  onSubmit: (info: GuestInfo, companion?: CompanionInfo) => void;
  onBack: () => void;
}

function FullAuthForm({
  customer,
  lineChannelId,
  merchantCode,
  bookingReturnState,
  showCompanion,
  onSubmit,
  onBack,
}: FullAuthFormProps) {
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<GuestInfo['gender']>('');
  const [companionName, setCompanionName] = useState('');
  const [companionGender, setCompanionGender] = useState<CompanionInfo['gender']>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill from rehydrated session (回訪 Guest 客戶)
  useEffect(() => {
    if (!customer) return;
    if (customer.name) setName((prev) => prev || customer.name);
    if (customer.phone) setPhone((prev) => prev || customer.phone || '');
    if (customer.gender === 'male' || customer.gender === 'female') {
      setGender((prev) => prev || (customer.gender as GuestInfo['gender']));
    }
  }, [customer]);

  const showLineLogin = !!lineChannelId && !!merchantCode;

  const handleLineLogin = () => {
    if (!lineChannelId || !merchantCode) return;
    try {
      if (bookingReturnState) {
        sessionStorage.setItem(
          BOOKING_RETURN_KEY,
          JSON.stringify({ merchantCode, ...bookingReturnState }),
        );
      }
      const state = randomState();
      sessionStorage.setItem(LINE_LOGIN_STATE_KEY, state);
      window.location.href = buildLineLoginUrl(lineChannelId, merchantCode, state);
    } catch {
      // sessionStorage may fail in private mode — abort silently
    }
  };

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
    if (!validate()) return;
    const guest: GuestInfo = { name: name.trim(), phone: phone.trim(), gender };
    const companion: CompanionInfo | undefined = showCompanion
      ? { name: companionName.trim(), gender: companionGender }
      : undefined;
    onSubmit(guest, companion);
  };

  return (
    <div className="theme-card p-5 space-y-4 theme-enter">
      <h2 className="theme-title text-lg">填寫預約資料</h2>

      {showLineLogin && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleLineLogin}
            className="w-full flex items-center justify-center gap-2 font-medium text-white transition-all hover:brightness-110"
            style={{
              backgroundColor: '#06C755',
              minHeight: '48px',
              borderRadius: 'var(--t-btn-radius)',
              padding: '14px 16px',
              fontSize: '1.0625rem',
            }}
          >
            <LineIcon />
            <span>用 LINE 完成預約</span>
          </button>
          <ul className="text-sm space-y-1" style={{ color: 'var(--t-sub)' }}>
            <li className="flex items-start gap-2">
              <Check />
              <span>自動帶入姓名，少填資料</span>
            </li>
            <li className="flex items-start gap-2">
              <Check />
              <span>收到預約提醒和回訪通知</span>
            </li>
            <li className="flex items-start gap-2">
              <Check />
              <span>下次預約一鍵完成</span>
            </li>
          </ul>
        </div>
      )}

      {showLineLogin && (
        <div className="text-center" style={{ borderTop: '1px solid var(--t-line)', paddingTop: '12px' }}>
          <button
            type="button"
            onClick={() => setShowGuestForm((v) => !v)}
            className="text-sm inline-flex items-center gap-1"
            style={{ color: 'var(--t-sub)', minHeight: '44px', padding: '10px 12px' }}
            aria-expanded={showGuestForm}
          >
            <span className="underline">
              {showGuestForm ? '收起手動填寫' : '不方便使用 LINE？點此手動填寫'}
            </span>
            <Caret open={showGuestForm} />
          </button>
        </div>
      )}

      {(!showLineLogin || showGuestForm) && (
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <GenderPicker value={gender} onChange={setGender} />
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
                <GenderPicker
                  value={companionGender}
                  onChange={(v) => setCompanionGender(v === companionGender ? '' : v)}
                  allowDeselect
                />
              </Field>
            </>
          )}

          <Button type="submit" variant="accent" size="md" className="w-full">
            下一步
          </Button>
        </form>
      )}

      <div className="flex pt-1">
        <Button type="button" variant="outline" size="md" onClick={onBack} className="flex-1">
          上一步
        </Button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Small UI primitives
// ───────────────────────────────────────────────────────────────────────────

function GenderPicker({
  value,
  onChange,
  allowDeselect = false,
}: {
  value: 'male' | 'female' | '';
  onChange: (v: 'male' | 'female' | '') => void;
  allowDeselect?: boolean;
}) {
  return (
    <div className="flex gap-3">
      {[
        { value: 'male' as const, label: '男' },
        { value: 'female' as const, label: '女' },
      ].map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(allowDeselect && active ? '' : opt.value)}
            className="flex-1 py-2.5 text-sm font-medium transition-all"
            style={{
              borderRadius: 'var(--t-btn-radius)',
              border: `1px solid ${active ? 'var(--t-primary)' : 'var(--t-line)'}`,
              background: active ? 'var(--t-primary-soft)' : 'transparent',
              color: active ? 'var(--t-primary)' : 'var(--t-sub)',
              minHeight: '44px',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
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

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'none' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#06C755"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0 mt-0.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}
