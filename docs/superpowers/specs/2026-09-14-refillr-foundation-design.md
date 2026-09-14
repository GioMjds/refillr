# Refillr Foundation Design

**Status:** Approved  
**Date:** 2026-09-14  
**Scope:** Next.js and Supabase foundation only

## Objective

Build the secure, installable, mobile-first foundation for Refillr, a water-refilling ordering and delivery system. This increment establishes the application shells, authentication boundaries, Supabase integration, design tokens, PWA behavior, and verification tooling needed by later vertical feature slices.

The foundation succeeds when:

- Customer, staff, and admin route shells are navigable and use role-appropriate layouts.
- Anonymous customer identities can be created on demand without requiring registration.
- Staff and admin routes require manually provisioned email/password accounts and the correct database role.
- Supabase sessions work across browser, Server Component, Server Action, and proxy contexts.
- The application is installable and has a safe offline fallback without implying offline order submission.
- The hosted Singapore project and the committed migration/type artifacts agree.
- Lint, TypeScript, unit/component tests, database checks, and the production build pass.

## Scope

### Included

- Dependency cleanup and development tooling
- Root layout, metadata, providers, global semantic theme, and error surfaces
- Public customer, protected staff, protected admin, sign-in, access-denied, and offline route shells
- Cookie-based Supabase SSR clients and session-refresh proxy
- Anonymous customer authentication support
- Staff/admin email-password sign-in without public registration
- Foundation database migration for roles and profiles
- Row Level Security policies and privileged-function grant hardening
- Generated database TypeScript types
- Web app manifest, PWA icons, service worker, and offline fallback
- Unit, component, database, and browser-level verification

### Excluded

- Product, order, order-item, address, delivery, payment, or reporting business logic
- Customer permanent-account registration or account linking UI
- Push notifications and the `web-push` package
- Offline order creation, mutation queuing, and background sync
- QR code generation, charts, animation libraries, and advanced date handling
- Payments, GCash integration, SMS, route optimization, and container tracking
- Multi-station or multi-tenant behavior

## Approved Product Decisions

- Architecture: server-first modular monolith.
- Database workflow: versioned local artifacts plus Supabase MCP application and verification against the hosted project.
- Hosted Supabase project: `Refillr` (`wzjdnlswlfigwuotmykf`), Singapore (`ap-southeast-1`), PostgreSQL 17.
- Customer identity: Supabase anonymous Auth identity created only on an identity-requiring action, not on every visit.
- Staff/admin identity: manually provisioned email/password accounts; no public operational-account signup.
- PWA: installable and online-first with an offline fallback; no offline mutations or push notifications.
- Layout: role-specific shells sharing one design language.
- Visual direction: deep aqua, warm white, compact Manrope typography, restrained radii and shadows.

## Architecture

```text
Browser / Installed PWA
          |
          v
Next.js App Router
|- public customer routes
|- staff/admin authenticated route groups
|- Server Components and Server Actions
|- minimal client providers
|  |- TanStack Query provider
|  `- service-worker registration
|
`- proxy.ts
   |- session-cookie refresh
   `- coarse protected-route redirect
          |
          v
Supabase
|- Auth: anonymous customers + permanent operational users
|- PostgreSQL: profiles and role authorization
|- RLS and least-privilege grants
`- generated TypeScript database types
```

### Architectural boundaries

- `proxy.ts` maintains cookies and rejects missing authenticated sessions on protected route families. It is not the final authorization layer.
- Protected route-group layouts load the current profile server-side and enforce the required database role.
- Server Components are the default for initial rendering and reads.
- Server Actions handle framework-local mutations such as sign-in. Route Handlers are added only when an external HTTP contract is required.
- Browser-side Supabase access is limited to operations intentionally exposed through RLS and future realtime subscriptions.
- Feature modules own business rules. Shared `lib/` code contains infrastructure, not water-station domain behavior.

## Technology and Dependency Baseline

### Existing versions retained

| Package                    |            Version | Purpose                                  |
| -------------------------- | -----------------: | ---------------------------------------- |
| Next.js                    |             16.3.5 | App Router full-stack framework          |
| React / React DOM          |             19.2.8 | UI runtime                               |
| TypeScript                 |              5.9.3 | Static typing                            |
| Tailwind CSS               |              4.3.3 | Utility CSS and semantic theme mapping   |
| shadcn                     |             4.21.0 | Base/Mira component source and CLI       |
| `@base-ui/react`           |              1.8.0 | Accessible runtime primitives            |
| `lucide-react`             |             1.45.0 | Single approved icon family              |
| `cn`                       |              0.3.0 | Tailwind-aware class composition         |
| `class-variance-authority` |              0.7.1 | Component variants                       |
| `@supabase/supabase-js`    | 2.116.0, exact pin | Supabase base client                     |
| `@supabase/ssr`            |  0.12.7, exact pin | Cookie-based SSR clients                 |
| `@tanstack/react-query`    |            5.102.8 | Interactive client query state           |
| React Hook Form            |             7.88.0 | Feature-form state                       |
| Zod                        |              4.6.4 | Runtime boundary validation              |
| Zustand                    |             5.0.15 | Future isolated client-only wizard state |

### Approved additions

| Package                     |            Version | Dependency class |
| --------------------------- | -----------------: | ---------------- |
| `@hookform/resolvers`       |              5.9.1 | Production       |
| Supabase CLI                | 2.117.0, exact pin | Development      |
| Vitest                      |              5.0.0 | Development      |
| `@testing-library/react`    |             16.3.3 | Development      |
| `@testing-library/jest-dom` |              7.0.1 | Development      |
| jsdom                       |             30.0.1 | Development      |

### Approved cleanup

- Move `tw-animate-css` to development dependencies.
- Remove `@hugeicons/core-free-icons` and `@hugeicons/react`; shadcn is configured for Lucide.
- Remove the unused `motion`, `qrcode`, `@types/qrcode`, `recharts`, and `date-fns` packages until their feature slices need them.
- Remove the nonfunctional push-notification placeholder in `app/actions.ts`; do not add `web-push` in this increment.
- Keep the lockfile committed. Do not perform unrelated React, TypeScript, ESLint, or Node type major upgrades.

The transitive Zod 3 copy used by shadcn tooling is acceptable and remains isolated from application Zod 4 imports.

## Project Structure

```text
app/
|- (customer)/
|  |- layout.tsx
|  |- page.tsx
|  |- order/page.tsx
|  |- orders/page.tsx
|  `- track/[id]/page.tsx
|- (auth)/
|  `- sign-in/page.tsx
|- (staff)/
|  |- layout.tsx
|  `- staff/
|     |- page.tsx
|     `- deliveries/page.tsx
|- (admin)/
|  |- layout.tsx
|  `- admin/
|     |- page.tsx
|     |- orders/page.tsx
|     |- customers/page.tsx
|     |- deliveries/page.tsx
|     `- reports/page.tsx
|- access-denied/page.tsx
|- offline/page.tsx
|- error.tsx
|- loading.tsx
|- not-found.tsx
|- manifest.ts
|- providers.tsx
|- layout.tsx
`- globals.css

components/
|- layouts/
|  |- customer-shell.tsx
|  |- staff-shell.tsx
|  `- admin-shell.tsx
|- navigation/
`- ui/                       # shadcn-managed source components

features/
`- auth/
   |- actions.ts
   |- schemas.ts
   `- components/

lib/
|- auth/
|  |- guards.ts
|  `- routes.ts
|- env/
|  |- client.ts
|  `- server.ts
|- supabase/
|  |- client.ts
|  |- server.ts
|  `- proxy.ts
`- utils.ts

public/
|- icon-192x192.png
|- icon-512x512.png
|- icon-maskable-512x512.png
`- sw.js

supabase/
|- config.toml
|- migrations/
|- seed.sql
`- tests/database/

types/
`- database.generated.ts

docs/superpowers/
|- specs/
`- plans/
```

## Route and Layout Contract

| URL                 | Access | Shell            | Foundation behavior                                              |
| ------------------- | ------ | ---------------- | ---------------------------------------------------------------- |
| `/`                 | Public | Customer         | Branded landing shell with primary order action                  |
| `/order`            | Public | Customer         | Foundation empty state for future order wizard                   |
| `/orders`           | Public | Customer         | Explains that history appears after an order identity exists     |
| `/track/[id]`       | Public | Customer         | Validated tracking identifier shell; no order lookup yet         |
| `/sign-in`          | Public | Auth             | Staff/admin email-password form                                  |
| `/staff`            | Staff  | Staff            | Assigned-work overview shell                                     |
| `/staff/deliveries` | Staff  | Staff            | Delivery queue empty state                                       |
| `/admin`            | Admin  | Admin            | Operations overview shell                                        |
| `/admin/orders`     | Admin  | Admin            | Orders empty state                                               |
| `/admin/customers`  | Admin  | Admin            | Customers empty state                                            |
| `/admin/deliveries` | Admin  | Admin            | Deliveries empty state                                           |
| `/admin/reports`    | Admin  | Admin            | Reports empty state                                              |
| `/access-denied`    | Public | Minimal          | Role mismatch explanation and safe navigation                    |
| `/offline`          | Public | Customer/minimal | Network-unavailable explanation; never claims an order was saved |

Route groups do not alter public URLs. Mobile customer/staff shells use bottom navigation. Admin uses a desktop sidebar and a mobile sheet. All shells share semantic theme tokens and primitives.

## Visual System

- Use semantic tokens (`background`, `foreground`, `primary`, `muted`, `border`, `ring`, `card`, and their foreground pairs) rather than feature-level raw colors.
- Use deep aqua as the action/active color, dark mineral green as foreground, warm near-white as the page background, and pale mineral/aqua for muted surfaces.
- Use Manrope for body and headings. Retain Geist Mono only for identifiers or technical values.
- Prefer compact spacing, small-to-medium radii, subtle borders, and restrained shadows.
- Do not add a dark-mode toggle in this increment.
- Customer content remains narrow and thumb-oriented; admin content may become denser at desktop widths.
- Required accessibility: semantic landmarks, skip link, visible focus, WCAG AA text contrast, labelled navigation, reduced-motion support, and at least 44px mobile targets.

## Authentication and Authorization

### Session behavior

1. `proxy.ts` matches application requests while excluding Next.js internals, static assets, PWA assets, and obvious public files.
2. The proxy Supabase client reads and writes cookies with the current `getAll`/`setAll` API.
3. Protected route families validate the current identity and redirect unauthenticated requests to `/sign-in` with a safe relative return path.
4. Staff/admin layouts fetch the current profile and require `staff`/`admin` respectively.
5. A signed-in user with the wrong role is sent to `/access-denied`.

### Anonymous customers

- Do not create an anonymous account on homepage or crawler traffic.
- A future identity-requiring action calls `signInAnonymously()` in a cookie-writing server context.
- The Auth insert trigger creates a `customer` profile.
- Future owned customer records use `auth.uid()` ownership policies.
- Anonymous users have the PostgreSQL `authenticated` role; policies must check ownership and must never treat `TO authenticated` as sufficient authorization.

### Operational users

- Staff/admin users are manually provisioned in Supabase Auth.
- Public signup is not exposed.
- `profiles.role` is authoritative. User-editable metadata is never used for authorization.
- Clients may read their own profile but cannot insert, delete, or change the role column.

## Database Foundation

The first migration will:

1. Create an `app_role` enum with `customer`, `staff`, and `admin`.
2. Create `public.profiles` keyed by `auth.users.id`, with role, display name, mobile number, timestamps, and appropriate checks.
3. Enable RLS on `profiles` explicitly even though the existing event trigger also enables it.
4. Add least-privilege grants and own-profile read/update policies. Role changes are excluded from client update privileges and policy checks.
5. Create the new-user profile trigger function in a non-exposed private schema, set a fixed `search_path`, and revoke public execution.
6. Attach a trigger to `auth.users` for permanent and anonymous identities.
7. Revoke direct function execution on the pre-existing `public.rls_auto_enable()` event-trigger function from `PUBLIC`, `anon`, and `authenticated` while preserving the event trigger itself.

After application, use Supabase MCP to:

- inspect tables and migration history;
- run SQL assertions for RLS, policies, grants, triggers, and role immutability;
- generate `types/database.generated.ts`;
- run security and performance advisors and resolve every foundation-relevant finding.

No product/order tables are created in this increment.

## Supabase Client Contract

- `lib/supabase/client.ts`: browser client created with URL and publishable key.
- `lib/supabase/server.ts`: request-scoped server client using `cookies()` asynchronously.
- `lib/supabase/proxy.ts`: request/response cookie bridge used only by `proxy.ts`.
- No application service-role client exists in this increment.
- Server-only environment parsing must not be imported into Client Components.
- Browser environment parsing exposes only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## PWA Contract

- `app/manifest.ts` supplies Refillr name, description, start URL, standalone display, approved colors, and standard/maskable icons.
- `public/sw.js` is a small versioned service worker.
- Navigation uses network-first behavior and falls back to `/offline` only on network failure.
- The worker may precache the offline document and immutable brand assets.
- The worker must not cache Supabase URLs, auth responses, protected HTML, Route Handler/Server Action traffic, non-GET requests, or order data.
- Service-worker responses use `Cache-Control: no-cache` and `Service-Worker-Allowed: /`.
- Push subscription, VAPID configuration, notifications, mutation queues, and background sync are excluded.

## Data and Error Flow

```text
Public navigation
  -> server-rendered route shell

Protected navigation
  -> proxy session verification
  -> protected layout role lookup
  -> authorized shell OR sign-in/access-denied redirect

Sign-in
  -> React Hook Form client validation
  -> Server Action Zod validation
  -> Supabase password sign-in
  -> safe role-aware redirect

Offline navigation
  -> network request fails
  -> service worker returns /offline
  -> no mutation success is shown
```

- Environment errors must name the missing variable without printing credentials.
- Authentication errors remain generic and do not reveal whether an account exists.
- Expected validation failures return structured form state; unexpected failures reach the route error boundary.
- Logs must not contain passwords, access tokens, refresh tokens, API keys, or full customer data.

## Code Style

- Prefer named functions for exported components and helpers.
- Default to Server Components. Add `"use client"` only at the narrow interactive boundary.
- Keep feature code inside its feature module; infrastructure imports flow from `lib/` into features, never the reverse.
- Validate at server boundaries even when the browser already validates.
- Use generated `Database` types in Supabase clients.
- Use shadcn components before custom interactive primitives and use semantic tokens instead of hard-coded UI colors.
- Use double quotes and trailing commas, matching the existing Prettier configuration.

Example:

```ts
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function requireRole(requiredRole: 'staff' | 'admin') {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims.sub) {
    redirect('/sign-in');
  }

  // The implementation then loads the protected profile and compares its role.
}
```

## Commands

```powershell
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm supabase --help
```

Database changes are applied and inspected through the approved Supabase MCP connection. CLI commands are still provided for reproducible local development and type/database tests.

## Testing Strategy

### Unit tests

- Client/server environment schemas accept valid configuration and reject missing/malformed values without leaking values.
- Route helpers correctly classify public, staff, admin, and excluded asset paths.
- Role guards distinguish unauthenticated, wrong-role, and authorized identities.
- Manifest content references existing icons and approved colors.

### Component tests

- Customer, staff, and admin navigation exposes correct labels and destinations.
- Sign-in form reports client/server validation errors accessibly.
- Offline and access-denied pages communicate accurate recovery actions.
- Layouts expose semantic landmarks and skip navigation.

### Database verification

- New Auth users receive customer profiles.
- Own-profile reads/allowed edits work; cross-user access and role changes fail.
- RLS is enabled and expected policies/grants exist.
- Privileged helper/event-trigger functions are not executable by public client roles.
- Supabase security and performance advisors have no unresolved foundation-relevant findings.

### Browser verification

- Customer mobile and admin desktop shells match the approved responsive navigation model.
- PWA manifest, icons, and service-worker registration load successfully.
- Offline navigation returns `/offline` without caching protected content.
- Anonymous users cannot enter staff/admin routes.
- Staff cannot enter admin routes; admin can enter admin routes.

### Completion gate

All of the following must pass on the final working tree:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Database assertions, security advisors, performance advisors, and targeted browser checks must also pass before completion is claimed.

## Boundaries

### Always

- Preserve unrelated and pre-existing uncommitted work.
- Validate untrusted input at the server boundary.
- Enable and test RLS for every exposed table.
- Use least-privilege grants and generated database types.
- Consult the installed Next.js 16 documentation and current official Supabase guidance before framework-specific implementation.
- Run verification before claiming completion.

### Ask first

- Destructive local or hosted database operations.
- Adding paid services or creating billable Supabase resources.
- Enabling SMS, email delivery, push, payments, or third-party integrations.
- Changing the approved authentication, route, PWA, or data-boundary design.
- Overwriting or removing unrelated user-authored changes.

### Never

- Commit secrets or expose service-role/secret keys to client code.
- Authorize from `user_metadata` or from authentication alone without ownership/role predicates.
- Cache authenticated responses, Supabase traffic, or mutations in the service worker.
- disable RLS to fix a permission problem.
- add `SECURITY DEFINER` merely to bypass RLS.
- remove failing tests to make a verification gate pass.

## Risks and Mitigations

| Risk                                                       | Mitigation                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `@supabase/ssr` remains pre-1.0 and may change             | Exact-pin the package, follow current `getAll`/`setAll` docs, and isolate it behind three client factories.   |
| Anonymous Auth users use the `authenticated` database role | Require ownership and explicit role predicates in every future policy.                                        |
| Proxy authorization can become stale or incomplete         | Use proxy only for session continuity/coarse redirects; enforce roles in protected server layouts and RLS.    |
| Service worker serves stale/private data                   | Cache only explicit public assets and offline fallback; bypass protected and non-GET traffic.                 |
| Existing automatic-RLS function is directly executable     | Revoke public-role execution and verify with security advisors.                                               |
| Foundation grows into horizontal business scaffolding      | Do not create domain tables or fake feature logic; the next increment is one end-to-end customer-order slice. |

## Official References

- Next.js PWA guide: https://nextjs.org/docs/app/guides/progressive-web-apps
- Installed Next.js 16 documentation: `node_modules/next/dist/docs/`
- Supabase SSR client setup: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Supabase server-package selection: https://supabase.com/docs/guides/auth/choosing-a-server-package
- Supabase local development workflow: https://supabase.com/docs/guides/local-development/cli-workflows
- Supabase JavaScript installation/Data API grants: https://supabase.com/docs/reference/javascript/installing
- TanStack Query advanced SSR: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
- Zustand with Next.js: https://zustand.docs.pmnd.rs/learn/guides/nextjs
- Tailwind with Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- shadcn with Next.js: https://ui.shadcn.com/docs/installation/next
- shadcn Tailwind 4 guidance: https://ui.shadcn.com/docs/tailwind-v4

## Open Questions

None. Product behavior beyond this foundation requires a separate design and implementation plan.
