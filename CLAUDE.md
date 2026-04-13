# Tuotuo Booking — Web Booking V2

Multi-merchant booking frontend. One codebase serves all merchants via dynamic branding.

## Tech Stack
- React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router
- Deploy: Cloudflare Pages
- Backend: Supabase Edge Function `web-booking-api`

## Key Architecture
- `/s/:merchantCode` — all routes scoped by merchant
- MerchantProvider fetches merchant-info API, injects CSS Variables for brand theming
- AuthProvider handles Guest / LIFF / LINE Login auth modes
- useBooking hook manages 4-step booking flow state machine
- API base: `VITE_API_BASE` env var → Supabase Edge Function

## API (web-booking-api)
- GET `?action=merchant-info&m={code}` — flat merchant object (not wrapped)
- GET `?action=services&m={code}` — `{ services: [...] }`
- GET `?action=calendar-status&m={code}&month=YYYY-MM` — `{ days: [...] }`
- GET `?action=available-slots&m={code}&date=YYYY-MM-DD&service_id=...` — `{ slots: [...] }`
- POST `?action=verify-identity` — returns `session_token` (not `token`)
- POST `?action=create-booking` (JWT) — body: `{ date, time, sessions }` (no merchant_code/service_id needed)
- GET `?action=my-bookings&m={code}&status=upcoming|past` (JWT) — `{ bookings: [...] }`
- POST `?action=cancel-booking` (JWT) — body: `{ booking_id, reason, cancel_group }`

## Supabase
- Project ID: `xfysiyqkasmloiosdyfs`
- Schemas: booking, platform, public

## Commands
- `npm run dev` — dev server on :5173
- `npm run build` — production build to `dist/`
