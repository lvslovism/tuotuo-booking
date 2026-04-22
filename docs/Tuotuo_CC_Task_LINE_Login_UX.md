# Tuotuo CC Task — LINE Login UX 優化

> **Priority:** P1
> **Repo:** `O:\Projects\tuotuo-booking\`
> **部署:** `wrangler pages deploy dist --project-name chikang-booking`
> **不涉及 EF 修改**

---

## 背景

LINE Login 功能已通，但 UX 需要優化：
1. LINE Login 按鈕文案不夠吸引人
2. Guest 表單不應該跟 LINE 按鈕同等醒目
3. LINE Login URL 缺少 `bot_prompt=aggressive`（授權完不會自動提示加好友）
4. LINE Login 成功後，新客人還是要填手機+性別，但表單沒有簡化（姓名應 pre-fill 並標示來源）

---

## 偵查指令

```bash
# 1. GuestForm 完整結構
cat src/components/booking/GuestForm.tsx

# 2. LINE Login URL 組法
grep -n "authorize\|access.line.me\|bot_prompt\|redirect" src/components/booking/GuestForm.tsx

# 3. CallbackPage 回來後怎麼設 auth state
grep -n "setAuth\|wb_customer\|display_name\|customer" src/pages/CallbackPage.tsx | head -20

# 4. BookingPage 的 info step 渲染
grep -n "info\|GuestForm\|guest" src/pages/BookingPage.tsx | head -20

# 5. auth state 結構（customer 物件的欄位）
grep -n "customer\.\|customer?" src/components/booking/GuestForm.tsx | head -15

# 6. useAuth 的 customer type
grep -n "Customer\|customer" src/types/index.ts | head -20
```

---

## Task 1：LINE Login URL 加 `bot_prompt=aggressive`

**檔案：** `src/components/booking/GuestForm.tsx`（或 grep 找到的實際位置）

找到組 LINE authorize URL 的地方，加上 `&bot_prompt=aggressive`：

```typescript
// 改前
const url = `https://access.line.me/oauth2/v2.1/authorize?...&scope=openid%20profile`;

// 改後
const url = `https://access.line.me/oauth2/v2.1/authorize?...&scope=openid%20profile&bot_prompt=aggressive`;
```

**效果：** LINE 授權完成後自動跳出「加入好友」提示，客人一個流程完成登入+加好友。

---

## Task 2：GuestForm UX 重新設計

**檔案：** `src/components/booking/GuestForm.tsx`

### 2a. LINE 按鈕文案改善

```typescript
// 改前
<button>LINE 快速登入</button>

// 改後 — 強調好處，不說「登入」
<button className="w-full py-3 bg-[#06C755] text-white rounded-lg font-medium text-lg"
        style={{ minHeight: '48px' }}>
  用 LINE 完成預約
</button>
<div className="mt-2 text-center text-sm text-gray-500 space-y-1">
  <p>✓ 自動帶入姓名，少填資料</p>
  <p>✓ 收到預約提醒和回訪通知</p>
  <p>✓ 下次預約一鍵完成</p>
</div>
```

### 2b. Guest 表單預設收合

```typescript
const [showGuestForm, setShowGuestForm] = useState(false);

// LINE 按鈕下方
<div className="mt-6 text-center">
  <button
    onClick={() => setShowGuestForm(!showGuestForm)}
    className="text-sm text-gray-400 underline"
  >
    {showGuestForm ? '收起' : '不方便使用 LINE？點此手動填寫'}
  </button>
</div>

// Guest 表單用 showGuestForm 控制
{showGuestForm && (
  <div className="mt-4 space-y-4">
    {/* 姓名、手機、性別欄位 */}
  </div>
)}
```

### 2c. 已登入 LINE 的客人不顯示選擇畫面

```typescript
// 如果 auth state 已有 customer（LINE Login 回來了）
// 直接顯示簡化表單，不顯示 LINE 按鈕和收合選擇
const { customer } = useAuth();

if (customer?.line_user_id) {
  // 已有 LINE 身份 → 顯示簡化表單（見 Task 3）
  return <LineCustomerForm customer={customer} ... />;
}

// 沒有 LINE 身份 → 顯示完整選擇畫面（LINE 按鈕 + 收合 Guest）
return <FullAuthForm ... />;
```

---

## Task 3：LINE Login 後的簡化表單

**新客人 LINE Login 回來後，** `customer` 有 `display_name` 和 `line_user_id`，但可能沒有 `phone` 和 `gender`。

### 情境 A：回訪客人（已有 phone）
```
→ 什麼都不用填，直接跳到確認頁
```

### 情境 B：新客人（沒有 phone）
```
→ 顯示簡化表單，姓名 pre-fill 但可編輯
```

```typescript
// 在 GuestForm 或 BookingPage 的 info step

// 情境 A：有 phone → 自動進下一步
useEffect(() => {
  if (customer?.line_user_id && customer?.phone) {
    // 資料齊全，直接用
    onSubmit({
      name: customer.display_name,
      phone: customer.phone,
      gender: customer.gender || 'male',
    });
  }
}, [customer]);

// 情境 B：沒 phone → 簡化表單
if (customer?.line_user_id && !customer?.phone) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700 text-center">
        ✓ 已連結 LINE，預約提醒將自動送達
      </div>

      {/* 姓名 — pre-fill LINE 暱稱，可編輯 */}
      <div>
        <label>姓名</label>
        <input defaultValue={customer.display_name} ... />
        <p className="text-xs text-gray-400 mt-1">已從 LINE 帶入，可修改為真實姓名</p>
      </div>

      {/* 手機 — 必填 */}
      <div>
        <label>手機號碼</label>
        <input placeholder="0912345678" required ... />
      </div>

      {/* 性別 — 必填 */}
      <div>
        <label>性別</label>
        {/* 男/女 按鈕 */}
      </div>

      <button className="w-full py-3 bg-primary text-white rounded-lg">
        下一步
      </button>
    </div>
  );
}
```

### 關鍵邏輯

```
GuestForm 載入時判斷：
  ├── customer.line_user_id && customer.phone → 自動跳過（回訪 LINE 客人）
  ├── customer.line_user_id && !customer.phone → 簡化表單（新 LINE 客人）
  ├── !customer.line_user_id && localStorage 有資料 → pre-fill Guest 表單
  └── 完全新客 → LINE 按鈕 + 收合 Guest 表單
```

---

## Task 4：提交簡化表單後更新客戶資料

LINE Login 新客人填完手機後，需要把 phone 更新到 DB。

**檔案：** 找到 create-booking 的提交邏輯

```bash
grep -n "create-booking\|createBooking\|customer_phone\|customer_name" src/ -r | head -15
```

**確認：** create-booking API 已經接受 `customer_phone` 參數，EF 端的 `fn_verify_guest` 或 booking handler 會用 phone 更新 customer 記錄。所以前端只需要確保 POST body 帶 `customer_phone`。

⚠️ **但如果 LINE Login 客人已有 JWT（不是 Guest JWT），create-booking 可能不會再跑 verify-identity。** 確認 create-booking handler 是否會更新 customer 的 phone。如果不會 → 在提交簡化表單時，先 POST verify-identity (mode=guest) 用 phone 更新記錄，再 create-booking。

先 grep 確認再決定。

---

## 驗收標準

### 新客人 LINE Login

| # | 步驟 | 預期 |
|:-:|------|------|
| 1 | 到填資料步驟 | 看到「用 LINE 完成預約」大按鈕 + 三個好處 |
| 2 | Guest 表單 | 預設收合，只看到「不方便使用 LINE？點此手動填寫」小字 |
| 3 | 點 LINE 按鈕 | 跳 LINE 授權頁 |
| 4 | LINE 授權完 | 跳出加好友提示（bot_prompt=aggressive）|
| 5 | 回到預約頁 | 看到簡化表單：姓名已帶入、只需填手機+性別 |
| 6 | 顯示「✓ 已連結 LINE」| 綠色提示條 |
| 7 | 填完手機+性別 → 確認頁 | 資料正確 |

### 回訪 LINE 客人

| # | 步驟 | 預期 |
|:-:|------|------|
| 1 | 開預約頁（localStorage 有 session）| 自動跳過填資料步驟，直接到確認頁 |

### Guest 流程（回歸）

| # | 步驟 | 預期 |
|:-:|------|------|
| 1 | 點「手動填寫」| Guest 表單展開 |
| 2 | 填完 3 格 → 確認頁 | 正常，不受影響 |
| 3 | 成功頁 | 顯示「加入 LINE 好友」引導 |

### LINE 按鈕隱藏條件

| # | 情境 | LINE 按鈕 |
|:-:|------|:---------:|
| 1 | 商家沒有 line_login_channel_id | 不顯示 |
| 2 | 客人已有 line_user_id（已登入）| 不顯示 |

---

## 注意事項

1. **不說「登入」** — 全部用「用 LINE 完成預約」
2. **bot_prompt=aggressive** — 必須加在 LINE authorize URL
3. **坑 #94** — grep 再改，不要假設 state 變數名和 props
4. **坑 #99** — CallbackPage 的 calledRef 不要動（防 code 用兩次）
5. **phone 更新** — LINE Login 新客人填完手機後，確保 DB 有更新
6. **觸控友好** — 所有按鈕 ≥ 44px

---

## 執行順序

```
1. 偵查指令全跑
2. Task 1（bot_prompt）← 最快，1 行
3. Task 2（UX 重設計：按鈕文案 + Guest 收合）
4. Task 3（LINE Login 後簡化表單）
5. Task 4（確認 phone 更新機制）
6. Build + deploy + 報告每個 Task 改了什麼
```

---

*— End of Document —*
*妥妥預約 Tuotuo Booking | CC Task Spec — LINE Login UX*
*2026-04-20*
