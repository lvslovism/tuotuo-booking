# 奇康 Web Booking 上線前最後修復

> 做完這 3 件事，Web Booking 就可以接真客人。

---

## Fix 1：師傅智能分配（EF）

**檔案：** `O:\Projects\supabase\functions\web-booking-api\index.ts`

**問題：** `availableResources` 按 `sort_order` 排序，永遠先選陳師傅。

**找到這行（約 L834）：**
```typescript
const availableResources = allResources.filter(r => !occupiedIds.has(r.id))
```

**在這行後面加：**
```typescript
  // ── 智能分配：當日預約最少的師傅優先 ──
  const { data: dayBookings } = await sb
    .from('bookings')
    .select('resource_id')
    .eq('merchant_code', merchantCode)
    .in('status', ['confirmed', 'pending'])
    .gte('start_time', `${date}T00:00:00+08:00`)
    .lt('start_time', `${date}T23:59:59+08:00`)

  const dayCountMap = new Map<string, number>()
  for (const b of dayBookings || []) {
    dayCountMap.set(b.resource_id, (dayCountMap.get(b.resource_id) || 0) + 1)
  }
  availableResources.sort((a: any, b: any) => {
    const countDiff = (dayCountMap.get(a.id) || 0) - (dayCountMap.get(b.id) || 0)
    if (countDiff !== 0) return countDiff       // 預約少的優先
    return (a.sort_order || 0) - (b.sort_order || 0) // 同數量按 sort_order
  })
```

**效果：** 陳師傅今天有 2 筆、林師傅有 0 筆 → 下一位客人自動分配林師傅。

---

## Fix 2：API 回傳增加商家資訊（EF）

**同一檔案。**

**找到 create-booking 的回傳（約 L1122-1147，單人單堂 response）：**
```typescript
    return {
      booking: {
        id: booking.id,
        service_name: booking.service_name,
        ...
        customer_line_user_id: lineUserId,
      },
    }
```

**改成：**
```typescript
    return {
      booking: {
        id: booking.id,
        service_name: booking.service_name,
        resource_name: booking.resource_name,
        start_time: booking.start_time,
        end_time: booking.end_time,
        duration_minutes: booking.duration_minutes,
        session_count: 1,
        applied_price_type: booking.applied_price_type,
        original_price: booking.original_price,
        discount_amount: booking.discount_amount,
        final_price: booking.final_price,
        payment_status: booking.payment_status,
        source: booking.source,
        status: booking.status,
        customer_line_user_id: lineUserId,
      },
      merchant: {
        display_name: merchant?.display_name || '',
        address: merchant?.address || '',
        google_map_url: merchant?.google_map_url || '',
        phone: settings?.display_settings?.phone || merchant?.phone || '',
        line_oa_url: merchant?.line_oa_url || '',
      },
    }
```

**同樣在多人多堂的 response（~L1155 附近）也加上 `merchant` 物件。**

**改完部署：**
```bash
cd O:\Projects\supabase
supabase functions deploy web-booking-api --project-ref xfysiyqkasmloiosdyfs --no-verify-jwt
```

**另外：** 在 create-booking handler 裡查 merchant 的地方（約 L884-889）：
```typescript
const { data: merchant } = await sb
    .from('v_merchants')
    .select('display_name, address, google_map_url, line_oa_url, line_channel_access_token')
```
加 `phone` 到 select：
```typescript
    .select('display_name, address, phone, google_map_url, line_oa_url, line_channel_access_token')
```

---

## Fix 3：成功頁顯示預約明細 + 地圖（前端）

**檔案：** `O:\Projects\tuotuo-booking\src\pages\SuccessPage.tsx`

**目前：** 只顯示「預約成功！」一行字。

**改成顯示：**

1. **預約明細卡片：**
   - 服務名稱（booking.service_name）
   - 日期時間（booking.start_time，格式化為 `4/15 (二) 14:00`）
   - 時長（booking.duration_minutes + `分鐘`）
   - 師傅（booking.resource_name）
   - 費用（`NT$` + booking.final_price）
   - 付款方式（`到店付款`）

2. **商家資訊卡片：**
   - 地址（merchant.address）
   - Google Maps 按鈕（連結到 merchant.google_map_url）
   - 電話（merchant.phone，點擊可撥打 `tel:`）
   - LINE 官方帳號（merchant.line_oa_url，如有）

3. **按鈕：**
   - 「回到首頁」
   - 「查看我的預約」（連到 /s/{merchantCode}/member）

**資料來源：**
- booking 明細：從 `BookingConfirm.tsx` navigate 時帶 state（`navigate('/s/' + merchantCode + '/success', { state: { booking: response.booking, merchant: response.merchant } })`）
- 如果 state 為空（直接打開成功頁），顯示簡化版 + 「回到首頁」按鈕

**改完部署：**
```bash
cd O:\Projects\tuotuo-booking
git add -A && git commit -m "feat: success page with booking details + map"
git push origin main
# Cloudflare Pages 自動部署，或手動 wrangler pages deploy dist
```

---

## 驗證流程

全部修完後，跑一次完整 E2E：

1. 打開 `https://tuotuo-booking.pages.dev/s/chikang`
2. 選時段 → 填 Guest 資料 → 確認預約
3. ✅ 確認分配的師傅（應該是林師傅，因為陳師傅當日已有預約）
4. ✅ 成功頁顯示：服務名、時間、費用、師傅名、地址、地圖連結
5. 再預約一筆同日 → ✅ 確認分配到另一位師傅
6. 打開 CMS (cms-booking-v2.vercel.app) → ✅ 預約列表有這 2 筆
7. POS 結帳其中一筆 → ✅ 狀態變 completed
