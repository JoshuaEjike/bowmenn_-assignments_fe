# Bowmenn — Freight Platform (Frontend)

Enterprise SaaS frontend for Bowmenn, a freight logistics platform. Customers book
shipments, admins dispatch drivers, and drivers move cargo from pickup to proof of
delivery.

## Demo accounts(Switch between mock or real services from env file)

- admin@bowmenn.com
- driver@bowmenn.com
- customer@bowmenn.com
- password => Password1

## Stack

React 19 · Vite · TypeScript (strict) · React Router v7 · TanStack Query · Zustand ·
React Hook Form + Zod · Axios · Tailwind CSS · Radix primitives · Lucide icons ·
Sonner toasts.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app ships with a mock API layer (`VITE_USE_MOCK_API=true`) so it runs fully
without a backend. Demo accounts, all with password `Password1`:

| Role     | Email                |
| -------- | -------------------- |
| Admin    | admin@bowmenn.com    |
| Driver   | driver@bowmenn.com   |
| Customer | customer@bowmenn.com |

To point at a real backend, set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL`
in `.env` — every feature service (`*.service.ts`) already switches between its
mock and axios implementation behind that flag, so no call sites change.

## Architecture

```
src/
  app/            cross-cutting: config, constants, stores, providers, router, types, lib, utils
  axios/          axios instance, interceptors, real API clients
  components/     reusable design-system + shared UI, organized by kind (ui, layout, tables, ...)
  features/       one folder per domain area, each owning its components/hooks/pages/services/types
```

Each feature is self-contained: `features/shipment` owns its own types, validation,
mock + real services, and query hooks. Pages compose feature hooks and shared
components; they don't call axios or Zustand stores directly for server data —
that's what TanStack Query is for. Zustand only holds client/session state
(auth identity, theme, sidebar, notification badges).

## What's built (this pass — foundation, per the brief's own module order)

1. Project scaffold, Tailwind design tokens, global theme (light/dark)
2. Providers: React Query client, theme sync, global error boundary
3. Router: lazy-loaded routes, protected/role/public-only guards, 403/404/unauthorized pages
4. Full JWT-shaped auth flow: login, register, forgot password, OTP, reset password —
   wired to a mock auth service with a refresh-token interceptor ready for a real API
5. Dashboard shell: collapsible sidebar, topbar with account menu, mobile nav drawer
6. Design system: Button, Input, Textarea, Label, Badge, Card, Avatar, Skeleton,
   Spinner, EmptyState, ErrorState, ConfirmDialog, Pagination, SearchInput, StatCard,
   ShipmentStatusBadge, ShipmentTimeline, ShipmentTable
7. One working dashboard per role (customer, driver, admin) wired to a realistic
   mock shipment API with pagination, search, and status filtering

## What's next (follow-up modules)

- Customer: shipment creation form, shipment list with filters/pagination, shipment
  detail page with timeline + POD viewer
- Driver: shipment list page, POD upload flow, profile page
- Admin: shipment monitoring table, driver assignment flow, customer/driver directories
- Notification center panel
- Dark-mode toggle UI (tokens are already dark-mode ready)

Each of these follows the same pattern already established: `types` → `validation`
(if forms are involved) → mock service → service switch → query hooks → components
→ page.
