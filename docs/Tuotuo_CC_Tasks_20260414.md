# Tuotuo Claude Code Tasks — 2026-04-14

## 背景

妥妥預約平台已完成新站遷移（Supabase project: `xfysiyqkasmloiosdyfs`），所有 Edge Functions 已部署，第一筆 completed booking 已達成。

**決策變更：** Web Booking 不再遷移舊 `liff-booking` repo，改為建新 repo `tuotuo-booking` 做 V2 版本，多商家通用。

---

## Task 1：Web Booking V2 — 多商家預約前端（全新建置）

### 目標
建立全新的多商家預約前端。一套代碼服務所有商家，品牌色和術語從 DB 動態載入。

### 完整 SDD
見 `Tuotuo_Web_Booking_V2_SDD.md`（同目錄），包含架構圖、專案結構、API 封裝、CSS Variables 動態注入、認證策略。

### Repo
新建 `O:\Projects\tuotuo-booking\`（不動舊的 liff-booking）

### 技術棧
React 18 + TypeScript + Vite + Tailwind CSS + React Router

### 路由
```
/s/:merchantCode           → 預約流程（首頁即預約）
/s/:merchantCode/services  → 服務介紹
/s/:merchantCode/member    → 會員中心
/s/:merchantCode/callback  → LINE Login 回調
```

### 環境變數（只需要 1 個必要的）
```env
VITE_API_BASE=https://xfysiyqkasmloiosdyfs.supabase.co/functions/v1/web-booking-api
```

### 多商家品牌機制
1. 用戶訪問 `/s/chikang`
2. MerchantProvider 呼叫 `?action=merchant-info&m=chikang`
3. API 回傳 `display_settings.theme`（primary_color, accent_color 等）
4. 注入 CSS Variables → Tailwind 使用 `bg-primary`, `text-accent` 等 class
5. 術語從 `display_settings.terminology` 讀取（「老師」/「美容師」/「醫師」）

### 預約流程 4 步
1. **選服務** — 如果只有 1 個 active service → 自動跳過
2. **選日期+時段** — 月曆 → 時段格子（API: calendar-status + available-slots）
3. **填資料** — Guest 表單（姓名+手機+性別）或 LIFF 自動帶入。人員選擇根據 `booking_rules.staff_selection_mode`（hidden/optional/required）
4. **確認** — 價格從 API 取，免責聲明，確認按鈕

### 認證策略（Guest 優先）
- LIFF 內 → 自動取 profile
- 瀏覽器 → Guest 表單（3 欄位，不需登入）
- LINE Login → 可選升級（看歷史/儲值卡）

### CORS
部署後更新 `O:\Projects\supabase\supabase\functions\web-booking-api\index.ts` 的 ALLOWED_ORIGINS，加入新的 Cloudflare Pages 域名，重新部署 EF。

### 部署
1. GitHub 新 repo `lvslovism/tuotuo-booking`
2. Cloudflare Pages 連接 → Build: `npm run build` → Output: `dist`
3. `public/_redirects` → `/* /index.html 200`
4. 測試 `tuotuo-booking.pages.dev/s/chikang`

### 驗收標準
- [ ] `/s/chikang` 載入顯示奇康品牌色 + 店名
- [ ] `/s/nonexistent` 顯示 404
- [ ] Guest 完整預約 → DB 有 confirmed booking（source=web）
- [ ] 價格從 API 取（前端不計算）
- [ ] 手機版 375px 排版正常
- [ ] Cloudflare Pages 線上可用

---

## Task 2：CMS v2 設定中心

### 目標
在 `cms-booking-v2` repo 新增設定中心頁面，讓商家管理員可以自助修改常用設定。

### Repo
`O:\Projects\cms-booking-v2\`（部署在 cms-booking-v2.vercel.app）

### 路由
`/s/[token]/booking/settings`

### 需要的設定區塊（MVP，先做最常用的 3 個）

#### 2a. 營業時間 (business_hours)
讀寫 `booking.merchant_settings.business_hours` JSONB：
```json
{
  "default_start": "13:00",
  "default_end": "21:00",
  "lunch_break": { "enabled": false },
  "closed_days": [0]  // 0=週日
}
```
UI：每日開關 + 開始/結束時間 picker + 午休設定

#### 2b. 預約規則 (booking_rules)
讀寫 `booking.merchant_settings.booking_rules` JSONB：
```json
{
  "slot_interval_minutes": 60,
  "min_advance_hours": 2,
  "max_advance_days": 30,
  "max_daily_bookings_per_customer": 1,
  "auto_confirm": true,
  "allow_same_day": true,
  "cancellation_policy": {
    "allowed": true,
    "min_hours_before": 24
  }
}
```
UI：各欄位對應 input/toggle，附說明文字

#### 2c. 通知設定 (notification_settings)
讀寫 `booking.merchant_settings.notification_settings` JSONB：
```json
{
  "admin_notify_new_booking": true,
  "admin_notify_cancel": true,
  "admin_daily_summary": true,
  "customer_remind_hours": [24, 1],
  "admin_line_user_ids": ["Uxxxxxx"]
}
```
UI：各項 toggle + 管理員 LINE ID 清單管理

### API 模式
CMS 已有 PostgREST 連線模式（用 session token 認證 → 取得 merchant_code → 查/改 DB）。設定中心的 API 也用同樣模式。

**已建好 DB RPC，直接用：**

讀取所有設定：
```typescript
const { data } = await supabase.schema('booking').rpc('fn_get_merchant_settings', { p_merchant_code: merchantCode });
// 回傳所有 11 個 JSONB 欄位 + updated_at
```

更新單個設定區塊（有白名單保護，只接受合法欄位名）：
```typescript
const { data } = await supabase.schema('booking').rpc('fn_update_merchant_setting', {
  p_merchant_code: merchantCode,
  p_setting_name: 'business_hours',  // 白名單：booking_rules, business_hours, notification_settings, etc.
  p_value: { default_start: "13:00", default_end: "21:00", ... }
});
// 回傳 { success: true, setting: "business_hours", value: {...} }
```

### 注意事項
1. **先偵察** cms-booking-v2 repo 裡現有的 API 模式（認證、DB 連線、錯誤處理），follow 同樣的 pattern
2. **用 RPC 不用直接 UPDATE** — `fn_get_merchant_settings` 讀、`fn_update_merchant_setting` 寫，有白名單保護
3. 每個 JSONB 欄位是獨立 column（`booking_rules`, `business_hours`, `notification_settings` 是三個獨立的 JSONB column）
4. 更新時傳整個 JSONB 物件（RPC 會做 column-level UPDATE），前端先 merge 再送
5. 表名是 `booking.merchant_settings`，RPC 已封裝，不需要直接 `.from()`
6. 儲存成功要有 toast 回饋

### 驗收標準
- [ ] /settings 頁面可載入目前設定值
- [ ] 修改營業時間 → 儲存 → 重新載入 → 值正確
- [ ] 修改預約規則 → 儲存 → 重新載入 → 值正確
- [ ] 修改通知設定 → 儲存 → 重新載入 → 值正確

---

## Task 3：CMS v2 Dashboard（老闆面板）

### 目標
首頁 Dashboard，顯示商家關鍵經營數據。

### 路由
`/s/[token]/booking/dashboard` 或首頁 `/s/[token]/booking`

### 需要的數據卡片

| 卡片 | 來源 | 說明 |
|------|------|------|
| 今日預約 | `bookings WHERE DATE(start_time) = today` | 計數 + 列表 |
| 本週預約 | `bookings WHERE start_time 本週` | 計數 |
| 本月營收 | `pos_transactions WHERE DATE(created_at) 本月` | SUM |
| 待確認 | `bookings WHERE status = 'pending'` | 計數（0 = auto_confirm） |
| 客戶總數 | `customers COUNT` | 總數 |
| 新客數（本月） | `customers WHERE DATE(created_at) 本月` | 計數 |

### UI 參考
- 上方 6 個數據卡片（2×3 grid）
- 下方今日預約列表（時間、客戶、服務、師傅、狀態）
- 響應式：手機版 1 column

### API
```
GET /api/booking/dashboard → 一次回傳所有數據
```

**已建好 DB RPC**：`booking.fn_dashboard_stats(p_merchant_code)`，一次呼叫回傳所有數據。CMS 只要：
```typescript
const { data } = await supabase.schema('booking').rpc('fn_dashboard_stats', { p_merchant_code: merchantCode });
```
回傳結構：
```json
{
  "today_bookings": 1, "today_completed": 1,
  "week_bookings": 1, "month_bookings": 1,
  "month_revenue": 1600,
  "pending_bookings": 0, "confirmed_upcoming": 0,
  "total_customers": 1, "month_new_customers": 1,
  "today_schedule": [{ "customer_name": "...", "service_name": "...", "start_time": "...", "status": "..." }],
  "today_date": "2026-04-14"
}
```

---

## Task 4：slot-calculator 改用 per-service duration（第二商家 blocker）

### 目標
目前 slot-calculator 用 `booking_rules.slot_interval_minutes`（全局 60 分鐘）計算所有時段。美容院有 30/60/90 分鐘不同服務，全局 interval 不適用。改為接收 service 的 `duration_minutes` 動態計算。

### 影響範圍
- `supabase/supabase/functions/_shared/booking/slot-calculator.ts`
- 呼叫 slot-calculator 的地方：`web-booking-api`（GET available-slots）、`booking-handler`（LINE Bot 選時段）

### 改法
1. `grep -rn "slot_interval" supabase/supabase/functions/` 找出所有引用
2. slot-calculator 的主函數加一個 `serviceDurationMinutes` 參數
3. 計算可用時段時用 `serviceDurationMinutes` 而非 `slot_interval_minutes`
4. `slot_interval_minutes` 降級為「時段顯示間隔」（例如 30 分鐘顯示一格），duration 才是佔用時間
5. 衝突檢查：`start_time + serviceDurationMinutes` 不能和既有預約重疊

### 測試
- 顱脊系統調理 60 分鐘 → 時段佔 60 分鐘 ✅（和現在一樣）
- 假設新服務 30 分鐘 → 同一時段可以排兩位 ✅
- 假設新服務 90 分鐘 → 跨兩個 slot，第二個 slot 不可選 ✅

### 注意
- `booking_rules.staff_selection_mode` 已加入 DB（chikang = "hidden"）
- LINE Bot 的人員選擇步驟要根據 mode 決定是否顯示（但這是另一個 Task）

---

## Task 5：Staff LIFF 績效面板（可延後）

### 目標
師傅用 LIFF 看自己的績效。

### 已有 DB RPC
```typescript
const { data } = await supabase.schema('booking').rpc('fn_staff_performance', {
  p_merchant_code: merchantCode,
  p_resource_id: resourceId,
  p_period: 'month'  // 'today' | 'week' | 'month'
});
```
回傳：total_bookings, completed_bookings, no_show_bookings, total_revenue, today_schedule, commission_earned

### 前置
師傅需要 LINE 綁定（`resources.line_user_id`），目前陳師傅和林師傅都沒綁。LIFF 打開後用 LINE user_id 反查 resource_id。

---

## 通用規則

1. **偵查再改** — 任何修改前先 `grep -n` 找到目標代碼，確認上下文
2. **不在 web Claude 寫的 spec 裡的欄位名，都要自己查** — 用 `information_schema.columns` 確認
3. **新站 Supabase URL**: `https://xfysiyqkasmloiosdyfs.supabase.co`
4. **新站 ANON_KEY 和 SERVICE_ROLE_KEY**: 從 Supabase Dashboard 取得（Settings → API）
5. **PostgREST schema 已暴露**: public, booking, platform — CMS 可直接用 `.schema('booking')` 查詢
