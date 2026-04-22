# Tuotuo CC Task — 師傅選擇功能

> **Priority:** P1（Shadow Launch 體驗優化）
> **Supabase project:** `xfysiyqkasmloiosdyfs` (Asia-Pacific)
> **Web Booking Repo:** `O:\Projects\tuotuo-booking\`
> **EF Repo:** `O:\Projects\supabase\functions\`
> **EF deploy:** `supabase functions deploy web-booking-api --project-ref xfysiyqkasmloiosdyfs`

---

## 背景

`booking_rules.staff_selection_mode` 已從 `"hidden"` 改為 `"optional"`。客人預約時應可以選擇師傅，也可以不選（由系統自動分配）。目前前端沒有師傅選擇 UI，EF 沒有師傅列表 API。

---

## Task 1：EF — 新增 `?action=resources` 端點

**檔案：** `functions/web-booking-api/index.ts`

### 偵查指令

```bash
# 找現有 action 路由模式
grep -n "action.*==\|case.*action" functions/web-booking-api/index.ts | head -30

# 找 merchant-info 或 services 的 handler 作為範例
grep -n "merchant-info\|services" functions/web-booking-api/index.ts | head -20

# 找 booking_rules 讀取方式
grep -n "booking_rules\|staff_selection" functions/web-booking-api/index.ts | head -10
```

### 規格

新增 GET `?action=resources&m=chikang` 端點：

```typescript
// 公開端點，不需 JWT
// 1. 從 merchant_settings 讀 booking_rules.staff_selection_mode
// 2. 如果是 "hidden" → 回傳 { staff_selection_mode: "hidden", resources: [] }
// 3. 如果是 "optional" 或 "required" → 查 booking.resources 回傳列表

// 查詢（⚠️ 注意 schema 是 booking）
const { data: resources } = await supabase
  .schema('booking')
  .from('resources')
  .select('id, name, title, avatar_url, bio')
  .eq('merchant_code', merchantCode)
  .eq('is_active', true)
  .eq('accept_booking', true)
  .order('sort_order');
```

**回傳格式：**

```json
{
  "staff_selection_mode": "optional",
  "resources": [
    {
      "id": "6cbf331a-...",
      "name": "陳師傅",
      "title": null,
      "avatar_url": null,
      "bio": null
    },
    {
      "id": "cfd6c388-...",
      "name": "林師傅",
      "title": null,
      "avatar_url": null,
      "bio": null
    }
  ]
}
```

### 注意

- `staff_selection_mode` 來自 `booking.merchant_settings` 的 `booking_rules` JSONB → `booking_rules.staff_selection_mode`
- **不要**回傳 `line_user_id`、`phone`、`commission_rate` 等敏感欄位
- follow 現有 `services` 端點的 pattern（CORS、error handling、response format）

---

## Task 2：EF — `available-slots` 支援 `resource_id` 過濾

**檔案：** `functions/web-booking-api/index.ts`

### 偵查指令

```bash
# 找 available-slots handler
grep -n "available-slots\|available_slots\|handleAvailableSlots" functions/web-booking-api/index.ts | head -20

# 找 slot-calculator 引用
grep -rn "slot-calculator\|slotCalculator\|calculateSlots\|getAvailableSlots" functions/web-booking-api/ functions/_shared/ | head -20
```

### 規格

`GET ?action=available-slots&m=chikang&date=2026-04-21&resource_id=6cbf331a-...`

- `resource_id` 是**可選**參數
- 有傳 `resource_id` → 只回傳該師傅的可用時段（過濾該師傅的排班 + 衝突）
- 沒傳 → 維持現有行為（回傳所有師傅聯集的可用時段）

**實作方式取決於現有 slot-calculator 的結構：**

- 如果 slot-calculator 已經接受 `resource_id` 參數 → 直接傳入
- 如果沒有 → 在查完所有 slots 後，額外過濾：查該 resource 在該日期的排班 + 已有預約，排除衝突時段

**⚠️ 不確定 slot-calculator.ts 的函數簽名，務必先 `grep` 看實際代碼再改。**

---

## Task 3：EF — `create-booking` 接受可選 `resource_id`

**檔案：** `functions/web-booking-api/index.ts`

### 偵查指令

```bash
# 找 create-booking handler
grep -n "create-booking\|create_booking\|handleCreateBooking" functions/web-booking-api/index.ts | head -20

# 找 fn_assign_resource 呼叫方式
grep -n "fn_assign_resource\|assign_resource" functions/web-booking-api/index.ts | head -10
```

### 規格

POST body 新增可選 `resource_id` 欄位：

```json
{
  "merchant_code": "chikang",
  "date": "2026-04-21",
  "time": "14:00",
  "resource_id": "6cbf331a-...",
  "customer_name": "...",
  "customer_phone": "...",
  "customer_gender": "male"
}
```

**邏輯：**

```typescript
let resourceId = body.resource_id;
let resourceName;

if (resourceId) {
  // 客人指定師傅 — 驗證該師傅存在且可用
  const { data: resource } = await supabase
    .schema('booking')
    .from('resources')
    .select('id, name, is_active, accept_booking')
    .eq('id', resourceId)
    .eq('merchant_code', merchantCode)
    .single();

  if (!resource || !resource.is_active || !resource.accept_booking) {
    return error(400, 'INVALID_RESOURCE', '指定的服務人員不可用');
  }

  // 檢查該師傅在該時段是否有衝突
  // （現有的衝突檢查邏輯，加上 resource_id 過濾）
  resourceName = resource.name;
} else {
  // 沒指定 → 走 fn_assign_resource 自動分配（現有邏輯不動）
  const assignResult = await supabase
    .schema('booking')
    .rpc('fn_assign_resource', { ... });
  // ...現有代碼...
}
```

**⚠️ 即使客人指定了師傅，仍然要做衝突檢查（該時段該師傅是否已有預約）。不能跳過。**

### fn_assign_resource 簽名（供參考）

```sql
fn_assign_resource(
  p_merchant_code VARCHAR,
  p_service_id UUID,
  p_start_time TIMESTAMPTZ,
  p_duration_minutes INT DEFAULT 60,
  p_exclude_resource_ids UUID[] DEFAULT '{}'
) RETURNS JSONB
```

---

## Task 4：前端 — 師傅選擇步驟

**Repo:** `O:\Projects\tuotuo-booking\`

### 偵查指令

```bash
# 找預約流程主組件
grep -rn "Step\|step\|currentStep\|setStep" src/pages/BookingPage.tsx | head -30

# 找服務選擇組件（參考 pattern）
grep -rn "ServiceSelector\|services" src/components/booking/ | head -20

# 找 API 呼叫方式
grep -rn "fetch\|api\|API_BASE\|VITE_API" src/ | head -20

# 找現有步驟定義
grep -n "type Step\|enum Step\|steps\|stepper" src/pages/BookingPage.tsx | head -10
```

### 規格

#### 4a. 載入時讀取 `staff_selection_mode`

在 BookingPage 初始化時（跟 `merchant-info` 或 `services` 同時），呼叫 `?action=resources&m=${mc}`：

```typescript
const [staffSelectionMode, setStaffSelectionMode] = useState<string>('hidden');
const [resources, setResources] = useState<Resource[]>([]);
const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

useEffect(() => {
  fetch(`${API_BASE}?action=resources&m=${mc}`)
    .then(res => res.json())
    .then(data => {
      setStaffSelectionMode(data.staff_selection_mode);
      setResources(data.resources || []);
    });
}, [mc]);
```

#### 4b. 步驟流程調整

```
現有：選服務 → 選日期 → 選時段 → 填資料 → 確認
新增：選服務 → 【選師傅】→ 選日期 → 選時段 → 填資料 → 確認
```

- `staff_selection_mode === "hidden"` → 跳過師傅步驟（現有行為）
- `staff_selection_mode === "optional"` → 顯示師傅步驟，**加一個「不指定（自動安排）」選項**
- `staff_selection_mode === "required"` → 顯示師傅步驟，**必須選一位**

#### 4c. 師傅選擇 UI（新組件）

**檔案：** `src/components/booking/StaffSelector.tsx`

```
┌─────────────────────────────────────┐
│  選擇服務人員                        │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🔄 不指定（自動安排最佳人選） │  │  ← optional 模式才顯示
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  👤 陳師傅                     │  │
│  │     {bio 或 title}            │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  👤 林師傅                     │  │
│  │     {bio 或 title}            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

- 卡片式，跟 ServiceSelector 同風格
- 有 `avatar_url` 就顯示頭像，沒有用預設 icon
- 點擊直接進入下一步（跟選服務一樣的交互）
- **按鈕高度 ≥ 44px**（觸控友好，坑 #97）
- 用商家主題色（CSS variables `var(--color-primary)`）

#### 4d. 選師傅後的時段過濾

選了特定師傅 → `available-slots` API 加上 `resource_id` 參數：

```typescript
const slotsUrl = selectedResourceId
  ? `${API_BASE}?action=available-slots&m=${mc}&date=${date}&resource_id=${selectedResourceId}`
  : `${API_BASE}?action=available-slots&m=${mc}&date=${date}`;
```

#### 4e. 建立預約時帶入 `resource_id`

```typescript
const bookingBody = {
  merchant_code: mc,
  date: selectedDate,
  time: selectedTime,
  customer_name: name,
  customer_phone: phone,
  customer_gender: gender,
  // 新增：有選師傅就帶入
  ...(selectedResourceId && { resource_id: selectedResourceId }),
};
```

#### 4f. 確認頁顯示師傅

確認步驟（BookingConfirm.tsx）已經有顯示師傅名稱。確認資料來源：

- 客人指定 → 用前端已知的 `resource.name`
- 自動分配 → `create-booking` API response 會回傳 `resource_name`

**⚠️ 成功頁 SuccessPage 已有顯示師傅名稱，不用改。**

---

## Task 5：Stepper 更新

**檔案：** `src/components/booking/Stepper.tsx`

### 偵查指令

```bash
grep -n "step\|label\|steps" src/components/booking/Stepper.tsx | head -20
```

### 規格

步驟標籤要根據 `staffSelectionMode` 動態調整：

```typescript
const steps = [
  { label: '選服務' },
  // 只在非 hidden 時顯示
  ...(staffSelectionMode !== 'hidden' ? [{ label: '選師傅' }] : []),
  { label: '選日期' },
  { label: '選時段' },
  { label: '填資料' },
  { label: '確認' },
];
```

---

## 驗收標準

### 功能驗收

| # | 場景 | 預期 |
|:-:|------|------|
| 1 | 開啟預約頁 | 看到「選師傅」步驟 |
| 2 | 點「不指定」| 進入選日期，時段顯示所有師傅聯集 |
| 3 | 點「陳師傅」| 進入選日期，時段只顯示陳師傅可用時段 |
| 4 | 選陳師傅 → 選時段 → 確認 | 確認頁顯示「陳師傅」 |
| 5 | 不指定 → 選時段 → 確認 | 確認頁顯示系統分配的師傅名稱 |
| 6 | 選陳師傅 → 該時段陳師傅已滿 | 時段顯示為不可選 |
| 7 | 成功預約 → 查 DB | `resource_id` 正確、`status=confirmed` |

### 回歸驗收

| # | 場景 | 預期 |
|:-:|------|------|
| 1 | 把 `staff_selection_mode` 改回 `"hidden"` | 跳過選師傅步驟，行為跟現在一樣 |
| 2 | 群組預約（2 人）+ 指定師傅 | 應該仍然正常（第 2 人自動分配另一位）|
| 3 | 現有的自動化測試 | 0 FAIL |

---

## 注意事項

1. **偵查再改** — 每個 Task 都有 grep 指令，務必先跑再改。不要假設 step 的變數名、API 格式
2. **坑 #94** — 要改 UI 組件前，`grep` 實際渲染的文字確認改對組件
3. **坑 #95** — Build 通過 ≠ 功能正確，改完用 Chrome Claude 驗收
4. **theme 一致** — 新組件必須使用 CSS variables（`var(--color-primary)` 等），不要硬編碼顏色
5. **EF deploy 後要測** — `curl` 打 `?action=resources&m=chikang` 確認有回傳

---

## 執行順序

```
1. Task 1（EF resources 端點）→ deploy → curl 驗證
2. Task 2（EF available-slots 加 resource_id）→ deploy → curl 驗證
3. Task 3（EF create-booking 接受 resource_id）→ deploy
4. Task 4 + 5（前端 UI）→ build → Chrome Claude 驗收
```

---

*— End of Document —*
*妥妥預約 Tuotuo Booking | CC Task Spec — Staff Selection*
*2026-04-19*
