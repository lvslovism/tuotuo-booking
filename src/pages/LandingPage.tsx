import { useState, useEffect } from 'react';

const API_BASE = 'https://xfysiyqkasmloiosdyfs.supabase.co/functions/v1/merchant-register';

const FEATURES = [
  {
    icon: '📱',
    title: 'LINE 預約',
    desc: '顧客從 LINE 直接預約，不需下載 APP，到店率提升 30%',
  },
  {
    icon: '🤖',
    title: 'AI 客服',
    desc: '24 小時自動回覆常見問題，減少 80% 重複詢問',
  },
  {
    icon: '📊',
    title: 'CMS 管理',
    desc: '排班、服務、顧客、營收一站搞定，手機也能管',
  },
  {
    icon: '💳',
    title: '儲值累積卡',
    desc: '線上儲值 + 集點回饋，回客率提升 40%',
  },
];

const INDUSTRIES = [
  { icon: '🦴', label: '整復推拿' },
  { icon: '💆', label: '美容 SPA' },
  { icon: '💇', label: '美髮沙龍' },
  { icon: '🏥', label: '診所醫療' },
  { icon: '🏋️', label: '健身運動' },
];

const PLANS = [
  {
    code: 'free',
    name: '免費',
    price: 0,
    period: '永久免費',
    features: ['1 位服務人員', 'LINE 基本預約', '每月 50 筆預約', '基本報表'],
    cta: '免費開始',
    highlight: false,
  },
  {
    code: 'standard',
    name: '標準',
    price: 990,
    period: '/ 月',
    features: ['5 位服務人員', 'AI 客服', '無限預約', '進階報表', '儲值卡功能'],
    cta: '免費試用 14 天',
    highlight: true,
  },
  {
    code: 'pro',
    name: '專業',
    price: 2490,
    period: '/ 月',
    features: [
      '不限服務人員',
      'AI 客服 + 訓練',
      '多分店管理',
      '完整報表 + API',
      '專屬客服經理',
    ],
    cta: '聯絡我們',
    highlight: false,
  },
];

const INDUSTRY_OPTIONS = ['整復推拿', '美容 SPA', '美髮沙龍', '診所醫療', '健身運動', '其他'];

export function LandingPage() {
  const [form, setForm] = useState({
    display_name: '',
    email: '',
    password: '',
    phone: '',
    industry: '',
    plan_code: 'standard',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [emailError, setEmailError] = useState('');

  // Scroll to section from CTA
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check email availability (debounced)
  useEffect(() => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError('');
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}?action=check-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();
        setEmailError(data.available ? '' : '此 Email 已被註冊');
      } catch {
        /* ignore */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [form.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, msg: '註冊成功！請至信箱收取驗證信。' });
      } else {
        setResult({ ok: false, msg: data.error || '註冊失敗，請稍後再試' });
      }
    } catch {
      setResult({ ok: false, msg: '網路錯誤，請稍後再試' });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-[#F8F6F3] text-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-[#3B6B5E]">妥妥預約</span>
          <div className="hidden sm:flex gap-6 text-sm text-gray-600">
            <button onClick={() => scrollTo('features')} className="hover:text-[#3B6B5E] transition-colors">功能</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-[#3B6B5E] transition-colors">方案</button>
            <button onClick={() => scrollTo('register')} className="hover:text-[#3B6B5E] transition-colors">註冊</button>
          </div>
          <button
            onClick={() => scrollTo('register')}
            className="bg-[#3B6B5E] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#2f5a4e] transition-colors"
          >
            免費體驗
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3B6B5E] leading-tight">
          妥妥預約
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-gray-600">
          台灣服務業的 LINE 預約系統
        </p>
        <p className="mt-4 text-gray-500 max-w-xl mx-auto">
          讓你的顧客從 LINE 輕鬆預約，AI 自動回覆，後台一站管理排班、營收、顧客關係。
        </p>
        <button
          onClick={() => scrollTo('register')}
          className="mt-8 bg-[#E8922D] text-white text-lg px-8 py-3 rounded-xl hover:bg-[#d17f22] transition-colors shadow-lg shadow-[#E8922D]/20"
        >
          免費體驗
        </button>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">核心功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-[#3B6B5E] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">適用行業</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.label}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#F8F6F3] hover:bg-[#f0ede8] transition-colors"
              >
                <span className="text-3xl">{ind.icon}</span>
                <span className="text-sm font-medium text-gray-700">{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">方案與定價</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.code}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-[#3B6B5E] text-white ring-2 ring-[#3B6B5E] shadow-xl scale-[1.02]'
                  : 'bg-white shadow-sm'
              }`}
            >
              <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white' : 'text-gray-800'}`}>
                {plan.name}
              </h3>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? '免費' : `$${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={plan.highlight ? 'text-[#E8922D]' : 'text-[#3B6B5E]'}>✓</span>
                    <span className={plan.highlight ? 'text-white/90' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  update('plan_code', plan.code);
                  scrollTo('register');
                }}
                className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  plan.highlight
                    ? 'bg-[#E8922D] text-white hover:bg-[#d17f22]'
                    : 'bg-[#3B6B5E] text-white hover:bg-[#2f5a4e]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Register Form */}
      <section id="register" className="bg-white py-20">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">立即開始</h2>
          <p className="text-center text-gray-500 text-sm mb-8">30 秒完成註冊，免費使用</p>

          {result?.ok ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">✉️</div>
              <p className="text-lg font-medium text-[#3B6B5E]">{result.msg}</p>
              <p className="mt-2 text-sm text-gray-500">請至 {form.email} 收取驗證信以啟用帳號。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">店名</label>
                <input
                  required
                  value={form.display_name}
                  onChange={(e) => update('display_name', e.target.value)}
                  placeholder="例：小林整復所"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B5E]/30 focus:border-[#3B6B5E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B5E]/30 ${
                    emailError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#3B6B5E]'
                  }`}
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  minLength={8}
                  placeholder="至少 8 個字元"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B5E]/30 focus:border-[#3B6B5E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
                <input
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="09xx-xxx-xxx"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B5E]/30 focus:border-[#3B6B5E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">行業</label>
                <select
                  required
                  value={form.industry}
                  onChange={(e) => update('industry', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6B5E]/30 focus:border-[#3B6B5E] bg-white"
                >
                  <option value="" disabled>
                    選擇行業
                  </option>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">方案</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => update('plan_code', p.code)}
                      className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                        form.plan_code === p.code
                          ? 'bg-[#3B6B5E] text-white border-[#3B6B5E]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#3B6B5E]'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {result && !result.ok && (
                <p className="text-red-500 text-sm text-center">{result.msg}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !!emailError}
                className="w-full bg-[#E8922D] text-white py-3 rounded-xl font-medium hover:bg-[#d17f22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '註冊中...' : '免費註冊'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} 妥妥預約 Tuotuo
      </footer>
    </div>
  );
}
