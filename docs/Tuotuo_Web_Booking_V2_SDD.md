# Tuotuo Web Booking V2 — 架構設計 + CC 任務規格

> **Date:** 2026-04-14  
> **Status:** 設計完成，待 CC 執行  
> **Tech:** React 18 + Vite + Tailwind + React Router  
> **Deploy:** Cloudflare Pages  
> **Repo:** `tuotuo-booking`（新 repo，多商家通用）

---

## 一、為什麼重寫而非遷移

V1（`liff-booking` repo）的問題不在技術棧，在代碼品質：
- 18 個踩坑（DevLog v2.0）
- LIFF/LINE Login/Guest 三模式認證邏輯糾纏
- 硬編碼奇康品牌（色、字、LIFF ID）
- 環境變數指向舊站

V2 從零開始，多商家通用，代碼量反而更少。

---

## 二、架構總覽

```
消費者
  │
  │  https://book.tuotuo.tw/s/chikang
  │  https://book.tuotuo.tw/s/beauty-salon-a
  │
  ▼
┌─── React SPA（tuotuo-booking / Cloudflare Pages）───────────┐
│                                                               │
│  Route: /s/:merchantCode                                      │
│    ├── /              → 預約流程（首頁即預約）                │
│    ├── /services      → 服務介紹 + 價目表                    │
│    ├── /member        → 會員中心（預約紀錄）                  │
│    └── /callback      → LINE Login OAuth 回調                │
│                                                               │
│  共用機制                                                     │
│  ├── MerchantProvider  → 載入商家資料 + 注入 CSS Variables   │
│  ├── AuthProvider      → Guest / LIFF / LINE Login 三模式    │
│  └── useBooking hook   → 4 步預約狀態機                      │
│                                                               │
│  特色                                                         │
│  ├── 品牌色：CSS Variables 從 DB 動態注入                    │
│  ├── 術語：「老師」/「美容師」/「醫師」從 DB 讀取            │
│  ├── 人員選擇：根據 staff_selection_mode 自動顯示/隱藏       │
│  └── Guest 優先：不登入也能預約（最短路徑）                   │
└──────────────────────┬────────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─── web-booking-api（Supabase Edge Function，已部署）──────────┐
│  GET  ?action=merchant-info&m={code}  → 品牌+設定（公開）     │
│  GET  ?action=services&m={code}       → 服務列表（公開）      │
│  GET  ?action=available-slots&m={code}&date=...  → 可用時段   │
│  GET  ?action=calendar-status&m={code}&month=... → 月曆狀態   │
│  POST ?action=verify-identity         → 身份驗證 → JWT        │
│  POST ?action=create-booking          → 建立預約（需 JWT）    │
│  GET  ?action=my-bookings             → 我的預約（需 JWT）    │
│  POST ?action=cancel-booking          → 取消預約（需 JWT）    │
└──────────────────────┬────────────────────────────────────────┘
                       │ SERVICE_ROLE_KEY
                       ▼
           Supabase PostgreSQL (xfysiyqkasmloiosdyfs)
           booking schema + platform schema
```

---

## 三、核心設計決策

### 3.1 多商家路由

```
/s/:merchantCode           → MerchantLayout 包裹所有子路由
/s/:merchantCode/           → BookingPage（首頁即預約）
/s/:merchantCode/services   → ServicesPage
/s/:merchantCode/member     → MemberPage
/s/:merchantCode/callback   → CallbackPage
/                           → 404 或導向 tuotuo.tw 官網
```

`merchantCode` 從 URL 取得後，全站共用。不存放在 env var。

### 3.2 動態品牌（CSS Variables）

merchant-info API 回傳 `display_settings.theme`，MerchantProvider 注入：

```css
:root {
  --color-primary: #3B6B5E;     /* 奇康墨綠 */
  --color-accent: #E8922D;      /* 琥珀橘 */
  --color-success: #7BAE7F;
  --color-bg: #F8F6F3;
  --color-text-secondary: #8E8E8E;
}
```

Tailwind 設定引用 CSS Variables：
```js
// tailwind.config.js
colors: {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  // ...
}
```

美容院接入 → 改主色為玫紅 → 零代碼改動。

### 3.3 認證策略（簡化版）

V1 的三模式認證是最大的坑。V2 策略：**Guest 優先，登入可選。**

```
用戶打開 /s/chikang
  │
  ├── 在 LINE 內（liff.isInClient() = true）
  │   └── 自動用 LIFF getProfile() → 有 LINE ID → JWT
  │
  └── 在瀏覽器
      └── 預約時只需填 姓名 + 手機（Guest 表單）
          └── 想看歷史 / 儲值卡？→ 可選 LINE Login 升級
```

**不再做：**
- 不在每個頁面檢查 auth 狀態
- 不在 URL 帶 auth token
- 不用 sessionStorage 存 booking state（用 React state）

### 3.4 預約流程（4 步）

```
Step 1: 選服務
  └── 如果只有 1 個 active service → 自動跳過

Step 2: 選日期 + 時段
  └── 月曆 + 時段格子
  └── API: calendar-status → available-slots

Step 3: 填資料
  ├── LIFF → 自動帶入（名字、頭像）只需填手機
  ├── Guest → 姓名 + 手機 + 性別（3 欄位）
  └── 人員選擇：staff_selection_mode = hidden → 跳過
                                      optional → 顯示但可不選
                                      required → 必選

Step 4: 確認
  └── 價格從 API 回傳（fn_calculate_booking_price）
  └── 免責聲明（display_settings.disclaimer_text）
  └── 確認按鈕 → create-booking → 成功頁
```

### 3.5 環境變數（少即是美）

```env
VITE_API_BASE=https://xfysiyqkasmloiosdyfs.supabase.co/functions/v1/web-booking-api
VITE_LIFF_ID=                    # 可選，空值 = 不載入 LIFF SDK
VITE_LINE_LOGIN_CHANNEL_ID=      # 可選，空值 = 不顯示 LINE Login 按鈕
```

商家資訊全部從 API 動態取得，不寫死在 env var。

---

## 四、專案結構

```
tuotuo-booking/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── _redirects                    ← Cloudflare Pages SPA fallback
├── CLAUDE.md                     ← CC 上下文
├── .env.example
├── src/
│   ├── main.tsx
│   ├── App.tsx                   ← React Router 路由定義
│   │
│   ├── api/
│   │   └── booking-api.ts        ← web-booking-api 呼叫封裝
│   │
│   ├── providers/
│   │   ├── MerchantProvider.tsx   ← 載入商家資料 + CSS Variables
│   │   └── AuthProvider.tsx       ← Guest / LIFF / LINE Login
│   │
│   ├── hooks/
│   │   ├── useMerchant.ts        ← 讀取 MerchantContext
│   │   ├── useAuth.ts            ← 讀取 AuthContext
│   │   └── useBooking.ts         ← 4 步預約狀態機
│   │
│   ├── pages/
│   │   ├── BookingPage.tsx       ← 預約流程（4 步）
│   │   ├── ServicesPage.tsx      ← 服務介紹
│   │   ├── MemberPage.tsx        ← 會員中心
│   │   ├── SuccessPage.tsx       ← 預約成功
│   │   ├── CallbackPage.tsx      ← LINE Login 回調
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MerchantLayout.tsx  ← 商家外框（Navbar + Footer）
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── booking/
│   │   │   ├── ServiceSelector.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── TimeSlotGrid.tsx
│   │   │   ├── StaffSelector.tsx   ← 根據 mode 顯示/隱藏
│   │   │   ├── GuestForm.tsx
│   │   │   ├── BookingConfirm.tsx
│   │   │   └── Stepper.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Loading.tsx
│   │       └── Toast.tsx
│   │
│   ├── types/
│   │   └── index.ts              ← Merchant, Service, Booking, Slot types
│   │
│   └── utils/
│       ├── date.ts               ← 台灣時區日期處理
│       └── cn.ts                 ← Tailwind className merge
│
└── public/
    └── favicon.svg
```

---

## 五、CC 執行指南

### 前置準備

```bash
# 1. 建 repo
mkdir tuotuo-booking && cd tuotuo-booking
npm create vite@latest . -- --template react-ts
npm install react-router-dom tailwindcss @tailwindcss/vite
npm install -D @types/react @types/react-dom

# 2. Tailwind 設定
# vite.config.ts 加入 @tailwindcss/vite plugin
# tailwind.config.js 加入 CSS Variables 色彩

# 3. _redirects（Cloudflare Pages SPA）
echo "/*  /index.html  200" > public/_redirects

# 4. env
cp .env.example .env
```

### 開發順序（建議）

```
Phase 1: 骨架（2 hr）
  ├── React Router 路由
  ├── MerchantProvider + API 串接
  ├── MerchantLayout（Navbar + Footer）
  └── 驗證：/s/chikang 載入 → 顯示奇康品牌色 + 店名

Phase 2: 預約流程（4 hr）
  ├── ServiceSelector（GET services）
  ├── Calendar + TimeSlotGrid（GET calendar-status + available-slots）
  ├── GuestForm（POST verify-identity）
  ├── BookingConfirm（POST create-booking）
  └── SuccessPage
  └── 驗證：Guest 完整預約 → DB 有 booking

Phase 3: 會員功能（2 hr）
  ├── MemberPage（GET my-bookings）
  ├── 取消預約（POST cancel-booking）
  └── LINE Login CallbackPage（可選）

Phase 4: 部署（30 min）
  ├── GitHub repo → Cloudflare Pages 連接
  ├── 環境變數設定
  ├── 部署 + 驗證
  └── CORS 確認（web-booking-api 白名單加入新域名）
```

### API 呼叫封裝

```typescript
// src/api/booking-api.ts
const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchMerchantInfo(merchantCode: string) {
  const res = await fetch(`${API_BASE}?action=merchant-info&m=${merchantCode}`);
  if (!res.ok) throw new Error('MERCHANT_NOT_FOUND');
  return res.json();
}

export async function fetchServices(merchantCode: string) {
  const res = await fetch(`${API_BASE}?action=services&m=${merchantCode}`);
  return res.json();
}

export async function fetchAvailableSlots(merchantCode: string, date: string, serviceId: string) {
  const res = await fetch(
    `${API_BASE}?action=available-slots&m=${merchantCode}&date=${date}&service_id=${serviceId}`
  );
  return res.json();
}

export async function fetchCalendarStatus(merchantCode: string, month: string) {
  const res = await fetch(
    `${API_BASE}?action=calendar-status&m=${merchantCode}&month=${month}`
  );
  return res.json();
}

export async function verifyIdentity(data: { merchantCode: string; mode: string; [key: string]: any }) {
  const res = await fetch(`${API_BASE}?action=verify-identity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json(); // { token, customer }
}

export async function createBooking(token: string, data: any) {
  const res = await fetch(`${API_BASE}?action=create-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchMyBookings(token: string, merchantCode: string) {
  const res = await fetch(`${API_BASE}?action=my-bookings&m=${merchantCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function cancelBooking(token: string, bookingId: string, reason?: string) {
  const res = await fetch(`${API_BASE}?action=cancel-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ booking_id: bookingId, reason }),
  });
  return res.json();
}
```

### MerchantProvider 核心邏輯

```typescript
// src/providers/MerchantProvider.tsx
// 
// 1. 從 URL 讀 merchantCode
// 2. 呼叫 fetchMerchantInfo(merchantCode)
// 3. 注入 CSS Variables 到 document.documentElement
// 4. 提供 MerchantContext（merchant, settings, terminology, loading, error）
//
// CSS Variables 注入範例：
// const theme = merchant.display_settings.theme;
// document.documentElement.style.setProperty('--color-primary', theme.primary_color);
// document.documentElement.style.setProperty('--color-accent', theme.accent_color);
// ...
```

### 設計風格指南

```
品牌調性：溫暖、專業、信任感
字體：Noto Sans TC（繁中）+ system-ui fallback
圓角：rounded-xl（卡片）、rounded-full（按鈕）
陰影：shadow-sm（卡片），不用過重的陰影
動效：transition-all duration-200（按鈕 hover/press）
手機優先：所有元件以 375px 寬設計，桌面版自適應
時段格子：最小 44px 高度（觸控友好）
CTA 按鈕：背景色 = accent，文字白色，hover 加深 10%
```

---

## 六、web-booking-api CORS 更新

部署後需要更新 Edge Function 的 CORS 白名單：

```typescript
const ALLOWED_ORIGINS = [
  // 新的 V2
  'https://tuotuo-booking.pages.dev',
  'https://book.tuotuo.tw',          // 未來 custom domain
  // 保留
  'https://liff.line.me',
  'http://localhost:5173',            // dev
];
```

CC 部署 V2 後，需要到 `supabase` repo 更新 CORS 並重新部署 web-booking-api。

---

## 七、驗收標準

```
Phase 1 驗收：
  □ /s/chikang 載入 → 顯示「奇康健康整復調理」+ 墨綠主色
  □ /s/nonexistent → 顯示 404
  □ Navbar 顯示商家名 + 導航

Phase 2 驗收：
  □ 選服務 → 選日期 → 選時段 → 填 Guest 資料 → 確認 → 預約成功
  □ DB 有新 booking（status=confirmed, source=web）
  □ 價格從 API 取（不在前端計算）
  □ 手機版排版正常（375px）

Phase 3 驗收：
  □ 會員中心顯示預約紀錄
  □ 可取消預約
  □ LINE Login 回調正常（可選）

Phase 4 驗收：
  □ Cloudflare Pages 部署成功
  □ CORS 通過
  □ /s/chikang 線上可完整預約
```

---

*— End of Document —*  
*妥妥預約 Tuotuo Booking | Web Booking V2 Architecture*
