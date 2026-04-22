# Tuotuo CC Task — LINE Login 啟用 + Session 持久化

> **Priority:** P1（客人體驗 + 通知可達性）
> **Repo:** `O:\Projects\tuotuo-booking\`
> **不涉及 EF 修改** — 後端 `verify-identity` 已支援 `mode: "line_login"`，客戶合併邏輯已存在
> **部署:** `wrangler pages deploy dist --project-name chikang-booking`

---

## 背景

目前 Web Booking 只有 Guest 模式（填姓名+手機+性別）。客人沒有 `line_user_id`，無法收到 LINE 推播通知（預約確認、提醒、回訪）。

需要：
1. 預約填資料步驟加「LINE 快速登入」按鈕（可選，不強制）
2. 預約成功頁加「加入 LINE 好友」引導（Guest 客人才顯示）
3. localStorage 持久化 session（7 天內回訪不用重填）
4. 回訪客戶 GuestForm 自動帶入上次的資料

---

## 偵查指令（全部先跑）

```bash
# 1. 前端 auth 相關檔案
find src -name "*auth*" -o -name "*Auth*" -o -name "*callback*" -o -name "*Callback*" | head -20

# 2. GuestForm 組件
grep -rn "GuestForm\|guest.*form\|guestForm" src/ | head -15

# 3. 現有的 LINE Login 相關代碼
grep -rn "line.*login\|LINE.*Login\|oauth\|authorize\|callback" src/ | head -20

# 4. verify-identity 呼叫方式
grep -rn "verify-identity\|verifyIdentity\|verify_identity" src/ | head -15

# 5. localStorage / sessionStorage 使用
grep -rn "localStorage\|sessionStorage\|wb_session\|wb_customer\|wb_auth" src/ | head -20

# 6. merchant-info API 回傳有沒有 line_login_channel_id
grep -rn "line_login\|line_oa_url\|lineLogin\|lineOa" src/ | head -15

# 7. SuccessPage 結構
grep -n "success\|Success\|加好友\|line_oa\|LINE" src/pages/SuccessPage.tsx | head -20

# 8. CallbackPage 存在嗎
ls -la src/pages/CallbackPage.tsx 2>/dev/null; echo "---"
grep -n "callback\|Callback" src/App.tsx | head -10

# 9. merchant-info 回傳的完整欄位
grep -rn "merchant-info\|merchantInfo\|merchant_info" src/api/ | head -10

# 10. useAuth hook 結構
cat src/hooks/useAuth.ts 2>/dev/null || cat src/providers/AuthProvider.tsx 2>/dev/null | head -50
```

---

## Task 1：merchant-info API 回傳 LINE 登入資訊

### 偵查

先確認 `merchant-info` API response 有沒有包含 `line_login_channel_id` 和 `line_oa_url`：

```bash
# 直接打 API 看回傳
curl -s "https://xfysiyqkasmloiosdyfs.supabase.co/functions/v1/web-booking-api?action=merchant-info&m=chikang" | python3 -m json.tool | grep -i "line"
```

**如果沒有回傳 `line_login_channel_id`：** 這是 EF 的問題，前端無法拿到 LINE Login Channel ID。回報給 Pien，不要在前端硬編碼。

**如果有回傳：** 繼續做 Task 2。

### 備選：env var

如果 merchant-info 沒回傳，暫時用 env var（但這不是長期方案）：

```env
VITE_LINE_LOGIN_CHANNEL_ID=2009197422
```

---

## Task 2：GuestForm 加 LINE Login 按鈕

**檔案：** `src/components/booking/GuestForm.tsx`（或 grep 找到的實際檔名）

### 規格

在 Guest 表單上方或下方加一個 LINE Login 按鈕。**兩個選項並列，不是取代**：

```
┌─────────────────────────────────────┐
│  填寫預約資料                        │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🟢 LINE 快速登入              │  │  ← LINE 綠色按鈕 #06C755
│  │     自動帶入姓名，未來可收通知  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ─────── 或填寫以下資料 ─────────    │
│                                     │
│  姓名 [_______________]            │
│  手機 [_______________]            │
│  性別 ○男 ○女                      │
│                                     │
│            [下一步]                  │
└─────────────────────────────────────┘
```

### LINE Login 按鈕邏輯

```typescript
function handleLineLogin() {
  // 1. 取 merchant 的 line_login_channel_id（從 merchant-info 或 env var）
  const channelId = merchant.line_login_channel_id || import.meta.env.VITE_LINE_LOGIN_CHANNEL_ID;
  if (!channelId) return; // 沒有 channel ID 就不顯示按鈕

  // 2. 儲存當前預約狀態，回來後恢復
  sessionStorage.setItem('wb_booking_return', JSON.stringify({
    merchantCode,
    serviceId: booking.serviceId,
    staffId: booking.staffId,
    date: booking.date,
    time: booking.time,
  }));

  // 3. 產生 CSRF state
  const state = crypto.randomUUID();
  sessionStorage.setItem('line_login_state', state);

  // 4. redirect to LINE Login
  const redirectUri = `${window.location.origin}/s/${merchantCode}/callback`;
  const url = `https://access.line.me/oauth2/v2.1/authorize?` +
    `response_type=code` +
    `&client_id=${channelId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}` +
    `&scope=openid%20profile`;

  window.location.href = url;
}
```

### 按鈕顯示條件

```typescript
// 只在有 LINE Login channel ID 時才顯示按鈕
const showLineLogin = !!merchant.line_login_channel_id || !!import.meta.env.VITE_LINE_LOGIN_CHANNEL_ID;
```

### 注意

- 按鈕高度 ≥ 44px
- LINE 品牌綠 `#06C755`，白色文字
- **不要**在按鈕上用 LINE 的 logo 圖片（避免載入問題），用 emoji 🟢 或純文字
- 如果已有 localStorage session（回訪客戶），直接 pre-fill Guest form，不需強制 LINE Login

---

## Task 3：CallbackPage 處理 LINE Login 回調

**檔案：** `src/pages/CallbackPage.tsx`（可能已存在）

### 偵查

```bash
cat src/pages/CallbackPage.tsx 2>/dev/null | head -80
```

### 規格（如果不存在或需要修改）

```typescript
// /s/:merchantCode/callback
export default function CallbackPage() {
  const { merchantCode } = useParams();
  const navigate = useNavigate();
  const calledRef = useRef(false);  // ⚠️ 防重複（坑 #99：React StrictMode 觸發兩次）

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const savedState = sessionStorage.getItem('line_login_state');

    // CSRF 驗證
    if (!code || !state || state !== savedState) {
      navigate(`/s/${merchantCode}`, { replace: true });
      return;
    }
    sessionStorage.removeItem('line_login_state');

    // 呼叫 verify-identity
    const redirectUri = `${window.location.origin}/s/${merchantCode}/callback`;
    
    fetch(`${API_BASE}?action=verify-identity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'line_login',
        code,
        redirect_uri: redirectUri,
        merchant_code: merchantCode,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.token && data.customer) {
          // 儲存 session
          localStorage.setItem('wb_session_token', data.token);
          localStorage.setItem('wb_customer', JSON.stringify(data.customer));
          localStorage.setItem('wb_auth_expires', String(Date.now() + 604800000)); // 7 天

          // 恢復預約狀態
          const returnState = sessionStorage.getItem('wb_booking_return');
          if (returnState) {
            sessionStorage.removeItem('wb_booking_return');
            // 回到預約流程的確認步驟
            navigate(`/s/${merchantCode}?restored=true`, { replace: true });
          } else {
            navigate(`/s/${merchantCode}/member`, { replace: true });
          }
        } else {
          console.error('LINE Login failed:', data);
          navigate(`/s/${merchantCode}`, { replace: true });
        }
      })
      .catch(err => {
        console.error('LINE Login error:', err);
        navigate(`/s/${merchantCode}`, { replace: true });
      });
  }, []);

  return <div className="flex items-center justify-center h-screen">登入中...</div>;
}
```

### 坑 #99：code 只能用一次

LINE authorization code **一次性**。React StrictMode 的 double-render 會讓 useEffect 跑兩次，第一次用掉 code，第二次就失敗。`calledRef` 必須加。

---

## Task 4：Session 持久化 + 回訪自動帶入

### 偵查

```bash
# 找 auth state 管理
grep -rn "sessionStorage\|localStorage\|wb_session\|wb_customer\|setToken\|setCustomer" src/ | head -20
```

### 4a. Session 儲存改 localStorage

找到登入成功後儲存 token 的地方（可能在 useAuth、AuthProvider、或 GuestForm），改為：

```typescript
// ❌ 現有（可能）
sessionStorage.setItem('wb_session_token', token);

// ✅ 改為
localStorage.setItem('wb_session_token', token);
localStorage.setItem('wb_customer', JSON.stringify(customer));
localStorage.setItem('wb_auth_expires', String(Date.now() + 604800000)); // 7 天
```

### 4b. 初始化時從 localStorage 恢復

```typescript
// 頁面載入時
useEffect(() => {
  const token = localStorage.getItem('wb_session_token');
  const customerStr = localStorage.getItem('wb_customer');
  const expires = localStorage.getItem('wb_auth_expires');

  if (token && customerStr && expires) {
    if (Date.now() < Number(expires)) {
      setToken(token);
      setCustomer(JSON.parse(customerStr));
    } else {
      // 過期清除
      localStorage.removeItem('wb_session_token');
      localStorage.removeItem('wb_customer');
      localStorage.removeItem('wb_auth_expires');
    }
  }
}, []);
```

### 4c. GuestForm 自動帶入

```typescript
// GuestForm 初始化時，如果 localStorage 有客戶資料就 pre-fill
const savedCustomer = localStorage.getItem('wb_customer');
if (savedCustomer) {
  const c = JSON.parse(savedCustomer);
  setName(c.display_name || c.name || '');
  setPhone(c.phone || '');
  setGender(c.gender || '');
}
```

**⚠️ 先 grep 確認 customer 物件的實際欄位名（可能是 `display_name` 不是 `name`）。**

### 4d. 不動的（保持 sessionStorage）

| Key | 為什麼不動 |
|-----|-----------|
| `line_login_state` | CSRF 一次性，關 tab 就該失效 |
| `wb_booking_state` | 預約流程中間狀態，不需跨 session |
| `wb_booking_return` | LINE Login redirect 橋接，一次性 |

---

## Task 5：SuccessPage 加「加入 LINE 好友」引導

**檔案：** `src/pages/SuccessPage.tsx`

### 偵查

```bash
grep -n "line_oa\|lineOa\|加好友\|LINE\|success" src/pages/SuccessPage.tsx | head -20
# 確認 merchant 資料有沒有 line_oa_url
grep -rn "line_oa_url\|lineOaUrl" src/ | head -10
```

### 規格

在成功頁底部，**只對 Guest 客人**（沒有 line_user_id）顯示：

```typescript
// 判斷是否 Guest（沒有 LINE 身份）
const isGuest = !customer?.line_user_id;
const lineOaUrl = merchant?.line_oa_url;

// 在成功頁最下方
{isGuest && lineOaUrl && (
  <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
    <p className="text-sm text-gray-700 mb-2">
      加入 LINE 好友即可收到<br/>預約提醒和最新消息
    </p>
    <a
      href={lineOaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-6 py-3 bg-[#06C755] text-white rounded-lg font-medium"
      style={{ minHeight: '44px' }}
    >
      加入 LINE 好友
    </a>
  </div>
)}
```

**LINE OA URL：** `https://line.me/R/ti/p/@538ezoya`（從 merchant-info API 拿，不硬編碼）

---

## Task 6：BookingPage 恢復預約狀態（LINE Login 回來後）

### 偵查

```bash
grep -n "restored\|booking_return\|returnState" src/pages/BookingPage.tsx | head -10
```

### 規格

LINE Login 成功後 redirect 回 `/s/chikang?restored=true`，BookingPage 需要恢復之前的選擇：

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('restored') === 'true') {
    // 從 localStorage 讀取 customer 資料 → 自動填入
    // 跳到 confirm 步驟（或 info 步驟讓客戶確認資料）
    // 清掉 URL 參數
    window.history.replaceState({}, '', window.location.pathname);
  }
}, []);
```

**注意：** 預約的日期/時段/師傅選擇存在 `sessionStorage.wb_booking_return` 裡，CallbackPage 已讀取。BookingPage 需要從 auth state 判斷是否已登入，如果已登入就跳過 GuestForm 直接到 confirm。

---

## 驗收標準

### LINE Login 流程

| # | 場景 | 預期 |
|:-:|------|------|
| 1 | GuestForm 顯示 LINE Login 按鈕 | 看到綠色「LINE 快速登入」按鈕 |
| 2 | 點 LINE Login | redirect 到 LINE 授權頁 |
| 3 | LINE 授權後 | 回到預約頁，自動帶入 LINE 名稱 |
| 4 | 走完預約到成功頁 | 不顯示「加好友」引導（已有 LINE 身份）|
| 5 | 查 DB customer | `line_user_id` 不為 null |

### Guest 流程

| # | 場景 | 預期 |
|:-:|------|------|
| 1 | Guest 預約成功 | 成功頁顯示「加入 LINE 好友」引導 |
| 2 | 點「加入好友」| 開啟 LINE 加好友頁面 |

### Session 持久化

| # | 場景 | 預期 |
|:-:|------|------|
| 1 | Guest 預約完 → 關閉 tab → 重新開 | GuestForm 自動帶入上次的姓名/手機/性別 |
| 2 | LINE Login 後 → 關閉 tab → 重新開 | 自動登入，不需重新走 LINE 授權 |
| 3 | 7 天後重開 | session 過期，需重新填寫/登入 |

### 回歸

| # | 場景 | 預期 |
|:-:|------|------|
| 1 | 沒有 LINE Login channel（hidden mode）| 不顯示 LINE Login 按鈕，只有 Guest form |
| 2 | 現有 Guest 預約流程 | 完全不受影響 |
| 3 | 選師傅功能 | 完全不受影響 |

---

## 注意事項

1. **LINE Login channel ID = `2009197422`** — 如果 merchant-info 沒回傳，先用 env var `VITE_LINE_LOGIN_CHANNEL_ID=2009197422`
2. **LINE OA URL = `https://line.me/R/ti/p/@538ezoya`** — 從 merchant-info 拿，不硬編碼
3. **Callback URL 格式：** `https://chikang-booking.pages.dev/s/chikang/callback`（LINE Console 已設定）
4. **⚠️ 坑 #99：** `calledRef` 防止 code 被用兩次
5. **⚠️ 坑 #94：** grep 再改，不要假設組件結構
6. **不要改 EF** — verify-identity 的 line_login mode 已經能用

## 執行順序

```
1. 偵查指令全跑 → 確認現有結構
2. Task 1（確認 merchant-info 有回傳 LINE 資訊）
3. Task 4（session 持久化 — 最基本的體驗改善）
4. Task 2（GuestForm 加 LINE Login 按鈕）
5. Task 3（CallbackPage）
6. Task 5（SuccessPage 加好友引導）
7. Task 6（預約狀態恢復）
8. Build + deploy + Chrome Claude 驗收
```

---

*— End of Document —*
*妥妥預約 Tuotuo Booking | CC Task Spec — LINE Login + Session*
*2026-04-20*
