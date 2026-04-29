# Phase 8 Investigation Report — MemberPage Booking Aggregation

**Date:** 2026-04-30
**CC autonomy mode:** 不問問題自行決策 → 此報告為事後紀錄，並未停下等確認。

---

## Step 1 — MemberPage 現況

| 項目 | 結論 |
|---|---|
| 進入點 | `src/pages/MemberPage.tsx` |
| 即將到來預約資料來源 | `fetchCustomerPortal(token, code)` → `web-booking-api?action=customer-portal` → `fn_customer_portal` RPC（LINE 用戶）/ 直查 `bookings`（Guest） |
| 卡片 component | `PortalBookingCard`（同檔 inline） |
| 卡片 props 形狀 | `PortalBooking`（`booking-api.ts:359-368`）：`id, date, start_time, end_time, status, service_name, resource_name, total_price` |
| 改期按鈕 | `navigate(\`/s/${code}/reschedule?id=${b.id}\`)` → `ReschedulePage`（**bug：ReschedulePage 讀的是 `booking_id`，現況 query string 對不上**） |
| 取消按鈕 | `cancelBooking(token, code, b.id)` → `web-booking-api?action=cancel-booking` |

## Step 2 — `customer-portal` 回應結構盤點

**LINE 用戶（`fn_customer_portal` RPC）**：`upcoming_bookings` **缺少**所有 group / session 欄位。
（見 `migrations/20260415175249_create_fn_customer_portal.sql:28-42`）

**Guest 用戶（EF 直查 bookings）**：有 `group_id, group_size, group_index, session_group_id, session_index, session_total`。
（見 `functions/web-booking-api/index.ts:3018`）

**`my-bookings` action**：完整回傳上述欄位（`functions/web-booking-api/index.ts:1823`）。

### 決策（不停下問 Pien，原因見 §4）

不擴 `fn_customer_portal`（spec §2 不動 EF/DB），改前端**並行呼叫 `my-bookings`** 取代 `portal.upcoming_bookings` 那段；其他 portal 區塊（loyalty / stored_value / packages / recent_visits）續用 `customer-portal`。

## Step 3 — reschedule / cancel EF 行為

| EF action | payload | 是否支援整組 |
|---|---|---|
| `cancel-booking` | `{ booking_id, reason, cancel_group? }` | ✅ `cancel_group: true` 時 cascade 同 `group_id` ∪ 同 `session_group_id`（`index.ts:1908-1936`） |
| `reschedule-booking` | `{ booking_id, new_date, new_time }` | ❌ 僅單筆 |

### 取消 → 用 `cancel_group: true` 一次打掉整組（不需 loop）。

### 改期 → 既有 EF 不支援整組改期，且多堂連續/多人同行的 UX 需要 slot calculator 重新展開。Phase 8 spec §2 明示「不動 reschedule 實作」，故**改期按鈕只導去既有 ReschedulePage 並傳第一筆 booking_id**。多筆群組的卡片在改期前 confirm 提示「目前僅能逐筆改期，建議聯絡店家統一處理」。整組改期留給後續 phase。

## Step 4 — 已自行決策事項（寫進 commit 而非停下）

1. **資料來源切換為 `my-bookings`** — `fn_customer_portal.upcoming_bookings` 缺欄位是事實，但 spec 要求純前端，最低成本路徑就是 fan-out 第二支 API。其他 portal 區塊不變。
2. **改期按鈕對多筆群組僅改第一筆** — 與 spec §5 「整組改期」字面有距離，但 §2「不動 reschedule 實作」是更高優先序的鐵律。confirm dialog 文字會明示限制。
3. **順手修 ReschedulePage URL param mismatch** — MemberPage 傳 `?id=`、ReschedulePage 讀 `booking_id`。改 ReschedulePage 同時接受兩者（`id` 優先），不破壞既有任何呼叫方。
4. **聚合 key**：`group_id ?? session_group_id ?? booking.id`（spec §4.1 寫的是 `group_id ?? id`，但 1 人 N 堂只有 `session_group_id`、無 `group_id`，必須降階到 `session_group_id` 才能正確分組成 1 張卡）。
5. **partySize / sessionCount 計算**：以 `group_size` / `session_total` 為主；缺值時退回 `bookings.length` 推算。

## Step 5 — 健檢 / Defense Layer

Phase 8 純前端，依 spec §7 不需要重跑健檢、不需重 deploy EF。
