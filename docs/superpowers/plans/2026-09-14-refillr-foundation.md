# Refillr Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a secure, installable Next.js foundation with Supabase anonymous/customer identity support, protected staff/admin shells, role-aware authentication, and production-grade verification.

**Architecture:** Build a server-first modular monolith in the Next.js 16 App Router. Supabase SSR factories isolate browser, Server Component/Action, and proxy cookie behavior; proxy performs session continuity while protected layouts and PostgreSQL RLS remain the authorization boundaries. Role-specific customer, staff, and admin shells share one deep-aqua design system and an online-first PWA layer.

**Tech Stack:** Next.js 16.3.5, React 19.2.8, TypeScript 5.9.3, Tailwind CSS 4.3.3, shadcn/Base UI, Supabase PostgreSQL 17/Auth/SSR, Zod 4.6.4, React Hook Form 7.88.0, TanStack Query 5.102.8, Zustand 5.0.15, Vitest 5.0.0, Testing Library 16.3.3.

**Spec:** `docs/superpowers/specs/2026-09-14-refillr-foundation-design.md`

## Global Constraints

- Work against Supabase project `wzjdnlswlfigwuotmykf` (`Refillr`) in `ap-southeast-1`; use Supabase MCP for hosted schema operations and verification.
- Preserve unrelated staged and unstaged work. Before every commit, inspect `git status --short` and commit only explicit task paths with `git commit --only`.
- Keep Next.js at 16.3.5, React/React DOM at 19.2.8, TypeScript at 5.9.3, and the current pnpm 11 lockfile format.
- Exact-pin `@supabase/ssr` 0.12.7, `@supabase/supabase-js` 2.116.0, and Supabase CLI 2.117.0.
- Use the root-level `app/` directory and `@/* -> ./*` alias; do not migrate to `src/`.
- Default to Server Components. Add `"use client"` only for forms, query context, service-worker registration, mobile navigation state, and error boundaries.
- Use database `profiles.role` plus RLS for authorization. Never authorize from user-editable metadata or authentication alone.
- Never create or expose a service-role client, and never print or commit credentials.
- Keep the PWA online-first. Never cache authenticated HTML, Supabase traffic, Server Actions, Route Handlers, non-GET requests, or future order mutations.
- Use semantic Tailwind/shadcn tokens, Manrope, Lucide, 44px touch targets, visible focus, semantic landmarks, and reduced-motion behavior.
- The foundation contains route shells and auth infrastructure only; do not add order, product, address, delivery, payment, reporting, or notification business logic.
- Before modifying Next.js or Supabase integration code, re-check the installed Next.js docs under `node_modules/next/dist/docs/` and current Supabase MCP documentation results.

## File Responsibility Map

### Configuration and verification

- `package.json` / `pnpm-lock.yaml`: exact toolchain and scripts.
- `vitest.config.ts` / `vitest.setup.ts`: jsdom, alias, cleanup, and DOM matchers.
- `.gitignore`: keep `.env.local` and visual-companion artifacts out of Git while allowing `.env.example`.
- `.env.example`: public variable names only, with no credentials.
- `tests/foundation/dependencies.test.ts`: dependency-policy regression test.

### Environment and Supabase infrastructure

- `lib/env/client.ts`: parse the two browser-safe environment variables.
- `lib/env/server.ts`: server-only access to the same public connection values.
- `lib/supabase/client.ts`: browser client factory.
- `lib/supabase/server.ts`: request-scoped cookie client factory.
- `lib/supabase/proxy.ts`: request/response cookie bridge and verified subject lookup.
- `types/database.generated.ts`: MCP-generated database contract.
- `supabase/config.toml`: local Supabase configuration with anonymous sign-ins enabled.
- `supabase/migrations/*_foundation_auth.sql`: roles, profiles, RLS, triggers, and grant hardening.
- `supabase/tests/database/001_foundation_auth.test.sql`: pgTAP schema/security assertions.

### Authentication

- `lib/auth/routes.ts`: pure path classification, safe return paths, and role route defaults.
- `lib/auth/guards.ts`: current profile lookup, role guard, and on-demand anonymous customer identity.
- `features/auth/schemas.ts`: shared Zod sign-in input contract.
- `features/auth/actions.ts`: server-side password sign-in.
- `features/auth/components/sign-in-form.tsx`: React Hook Form UI.
- `proxy.ts`: top-level Next.js proxy and static matcher.

### Application and PWA

- `app/globals.css`: deep-aqua semantic tokens and global accessibility defaults.
- `app/layout.tsx`: metadata, fonts, skip link, and providers.
- `app/providers.tsx`: stable TanStack Query client plus service-worker registration.
- `app/manifest.ts`: install manifest and icon declarations.
- `components/pwa/register-service-worker.tsx`: narrow browser registration boundary.
- `public/sw.js`: navigation-only network-first fallback.
- `public/icon-192x192.png`, `public/icon-512x512.png`, `public/icon-maskable-512x512.png`: install assets.
- `next.config.ts`: typed routes, React compiler, global security headers, and service-worker headers.

### Shared UI and route shells

- `components/brand/refillr-mark.tsx`: accessible brand mark.
- `components/layouts/customer-shell.tsx`: customer header, content region, and mobile bottom navigation.
- `components/layouts/staff-shell.tsx`: delivery-task navigation.
- `components/layouts/admin-shell.tsx`: desktop sidebar and mobile sheet.
- `components/page-intro.tsx`: consistent route-shell title/description/empty-state structure.
- Route-group layouts own role enforcement; page files contain only approved foundation copy.

---

### Task 1: Establish the dependency and test baseline

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tsconfig.json`
- Modify: `.gitignore`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tests/foundation/dependencies.test.ts`
- Delete: `app/actions.ts`
- Delete: `lib/service-worker.js`

**Interfaces:**

- Consumes: approved package versions and cleanup rules from the spec.
- Produces: `pnpm typecheck`, `pnpm test`, and `pnpm test:watch`; a clean TypeScript baseline; ignored `.superpowers/`; no push-notification placeholder.

- [ ] **Step 1: Write the dependency contract test before changing packages**

```ts
// tests/foundation/dependencies.test.ts
import { describe, expect, it } from 'vitest';

import packageJson from '../../package.json';

describe('foundation dependency policy', () => {
  it('pins Supabase SSR dependencies', () => {
    expect(packageJson.dependencies['@supabase/ssr']).toBe('0.12.7');
    expect(packageJson.dependencies['@supabase/supabase-js']).toBe('2.116.0');
    expect(packageJson.devDependencies.supabase).toBe('2.117.0');
  });

  it('keeps deferred and conflicting packages out of the foundation', () => {
    const direct = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    expect(direct).not.toHaveProperty('@supabase/server');
    expect(direct).not.toHaveProperty('@hugeicons/react');
    expect(direct).not.toHaveProperty('@hugeicons/core-free-icons');
    expect(direct).not.toHaveProperty('web-push');
    expect(direct).not.toHaveProperty('motion');
    expect(direct).not.toHaveProperty('qrcode');
    expect(direct).not.toHaveProperty('recharts');
    expect(direct).not.toHaveProperty('date-fns');
  });

  it('keeps build-time tooling in development dependencies', () => {
    expect(packageJson.dependencies).not.toHaveProperty('tw-animate-css');
    expect(packageJson.devDependencies['tw-animate-css']).toBe('1.4.0');
    expect(packageJson.dependencies['@hookform/resolvers']).toBe('5.9.1');
  });
});
```

- [ ] **Step 2: Run the contract against the current package file**

Run: `pnpm dlx vitest@5.0.0 run tests/foundation/dependencies.test.ts --environment node`

Expected: FAIL because Supabase versions use ranges, `@supabase/server` and deferred packages are present, and the test toolchain is not installed locally.

- [ ] **Step 3: Reconcile dependencies with explicit pnpm operations**

Run:

```powershell
pnpm remove @supabase/server @hugeicons/core-free-icons @hugeicons/react date-fns motion qrcode recharts @types/qrcode tw-animate-css
pnpm add -E @supabase/ssr@0.12.7 @supabase/supabase-js@2.116.0 @hookform/resolvers@5.9.1
pnpm add -D -E supabase@2.117.0 vitest@5.0.0 @testing-library/react@16.3.3 @testing-library/jest-dom@7.0.1 jsdom@30.0.1 tw-animate-css@1.4.0
```

Keep `@tanstack/react-query`, `react-hook-form`, Zod, and Zustand. Do not update React, TypeScript, ESLint, or `@types/node` during these operations.

- [ ] **Step 4: Add scripts and the Vitest harness**

Add these exact scripts to `package.json`:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

```ts
// vitest.config.ts
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules/**', '.next/**', 'supabase/tests/**'],
  },
});
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
```

- [ ] **Step 5: Clean TypeScript and ignored-file configuration**

Remove the stray `lib/service-worker.js` entry from `tsconfig.json`; retain the standard Next.js includes. Add these lines to `.gitignore`:

```gitignore
!.env.example
/.superpowers/
```

Delete the untracked push-only `app/actions.ts` and `lib/service-worker.js`. These files implement the explicitly deferred notification feature and currently break TypeScript.

- [ ] **Step 6: Verify the baseline**

Run:

```powershell
pnpm test -- tests/foundation/dependencies.test.ts
pnpm typecheck
pnpm lint
```

Expected: dependency test PASS and TypeScript PASS. ESLint may retain only the two pre-existing unused-import/parameter warnings from the empty `proxy.ts`; Task 5 removes them when it implements the proxy.

- [ ] **Step 7: Commit only this task**

```powershell
git status --short
git add package.json pnpm-lock.yaml tsconfig.json .gitignore vitest.config.ts vitest.setup.ts tests/foundation/dependencies.test.ts
git commit --only -m "chore: establish foundation toolchain" -- package.json pnpm-lock.yaml tsconfig.json .gitignore vitest.config.ts vitest.setup.ts tests/foundation/dependencies.test.ts
```

### Task 2: Validate public environment configuration

**Files:**

- Create: `.env.example`
- Create: `lib/env/client.ts`
- Create: `lib/env/server.ts`
- Test: `lib/env/client.test.ts`
- Local only: `.env.local`

**Interfaces:**

- Consumes: Zod 4.6.4; Supabase project `wzjdnlswlfigwuotmykf`.
- Produces: `PublicEnv`, `getPublicEnv(): PublicEnv`, and `getServerEnv(): PublicEnv`.

- [ ] **Step 1: Write failing environment tests**

```ts
// lib/env/client.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPublicEnv } from '@/lib/env/client';

describe('getPublicEnv', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('returns validated public Supabase configuration', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv(
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'sb_publishable_example_key',
    );

    expect(getPublicEnv()).toEqual({
      supabaseUrl: 'https://example.supabase.co',
      supabasePublishableKey: 'sb_publishable_example_key',
    });
  });

  it('rejects missing configuration without echoing credentials', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');

    expect(() => getPublicEnv()).toThrow(
      'Missing or invalid environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    );
  });
});
```

- [ ] **Step 2: Run the focused test**

Run: `pnpm test -- lib/env/client.test.ts`

Expected: FAIL because `@/lib/env/client` does not exist.

- [ ] **Step 3: Implement the client and server environment readers**

```ts
// lib/env/client.ts
import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().startsWith('https://'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
});

export type PublicEnv = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

export function getPublicEnv(): PublicEnv {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!result.success) {
    const variableNames = [
      ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
    ];
    throw new Error(
      `Missing or invalid environment variables: ${variableNames.join(', ')}`,
    );
  }

  return {
    supabaseUrl: result.data.NEXT_PUBLIC_SUPABASE_URL,
    supabasePublishableKey: result.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}
```

```ts
// lib/env/server.ts
import 'server-only';

import { getPublicEnv, type PublicEnv } from '@/lib/env/client';

export function getServerEnv(): PublicEnv {
  return getPublicEnv();
}
```

`.env.example` contains only:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

- [ ] **Step 4: Populate ignored local configuration through Supabase MCP**

Call `supabase_get_project_url` for project `wzjdnlswlfigwuotmykf`. Call `supabase_get_publishable_keys` for the same project and choose the enabled modern key beginning with `sb_publishable_`. Write those two values to `.env.local` using the exact variable names above. Do not stage `.env.local` and do not print the key in commentary or the final handoff.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test -- lib/env/client.test.ts`

Expected: PASS.

```powershell
git status --short
git add .env.example lib/env/client.ts lib/env/server.ts lib/env/client.test.ts
git commit --only -m "feat: validate Supabase environment" -- .env.example lib/env/client.ts lib/env/server.ts lib/env/client.test.ts
```

### Task 3: Create Supabase client factories

**Files:**

- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/proxy.ts`
- Test: `lib/supabase/client.test.ts`
- Delete: `utils/supabase/client.ts`
- Delete: `utils/supabase/server.ts`
- Delete: `utils/supabase/middleware.ts`

**Interfaces:**

- Consumes: `getPublicEnv()` and `getServerEnv()`.
- Produces: browser `createClient()`, async server `createClient()`, and `refreshSession(request): Promise<{ response: NextResponse; userId: string | null }>`; Task 4 adds generated database typing to all three factories.

- [ ] **Step 1: Query current Supabase SSR docs through MCP**

Call `supabase_search_docs` with a GraphQL `searchDocs` query for `Next.js createServerClient getAll setAll getClaims proxy @supabase/ssr`. Confirm the documented cookie API still matches package 0.12.7 before implementing.

- [ ] **Step 2: Write a failing browser-factory test**

```ts
// lib/supabase/client.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createBrowserClient = vi.fn();

vi.mock('@supabase/ssr', () => ({ createBrowserClient }));
vi.mock('@/lib/env/client', () => ({
  getPublicEnv: () => ({
    supabaseUrl: 'https://example.supabase.co',
    supabasePublishableKey: 'sb_publishable_example_key',
  }),
}));

describe('browser Supabase client', () => {
  beforeEach(() => createBrowserClient.mockReset());

  it('uses only browser-safe project credentials', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'sb_publishable_example_key',
    );
  });
});
```

- [ ] **Step 3: Run the focused test**

Run: `pnpm test -- lib/supabase/client.test.ts`

Expected: FAIL because the approved factory path does not exist.

- [ ] **Step 4: Implement the three factories**

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

import { getPublicEnv } from '@/lib/env/client';
export function createClient() {
  const env = getPublicEnv();
  return createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
}
```

```ts
// lib/supabase/server.ts
import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { getServerEnv } from '@/lib/env/server';
export async function createClient() {
  const cookieStore = await cookies();
  const env = getServerEnv();

  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies; proxy performs refresh.
        }
      },
    },
  });
}
```

```ts
// lib/supabase/proxy.ts
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { getServerEnv } from '@/lib/env/server';

export async function refreshSession(request: NextRequest): Promise<{
  response: NextResponse;
  userId: string | null;
}> {
  const env = getServerEnv();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
  const { data } = await supabase.auth.getClaims();
  return { response, userId: data?.claims.sub ?? null };
}
```

Do not call `getSession()` for authorization.

- [ ] **Step 5: Remove the overlapping utility directory and verify**

Delete the three untracked files under `utils/supabase/`. Run:

```powershell
pnpm test -- lib/supabase/client.test.ts
pnpm typecheck
```

Expected: PASS. Do not create a handwritten database type; Task 4 generates the authoritative type and then wires it into these factories.

- [ ] **Step 6: Commit only the approved factories**

```powershell
git status --short
git add lib/supabase/client.ts lib/supabase/server.ts lib/supabase/proxy.ts lib/supabase/client.test.ts
git commit --only -m "feat: add Supabase SSR clients" -- lib/supabase/client.ts lib/supabase/server.ts lib/supabase/proxy.ts lib/supabase/client.test.ts
```

### Task 4: Establish the Supabase role/profile schema and generated types

**Files:**

- Create: `supabase/config.toml`
- Create: `supabase/migrations/<cli-generated-version>_foundation_auth.sql`
- Create: `supabase/seed.sql`
- Create: `supabase/tests/database/001_foundation_auth.test.sql`
- Create: `types/database.generated.ts`
- Modify: `lib/supabase/client.ts`
- Modify: `lib/supabase/server.ts`
- Modify: `lib/supabase/proxy.ts`

**Interfaces:**

- Consumes: Supabase CLI 2.117.0 and hosted project `wzjdnlswlfigwuotmykf`.
- Produces: `public.app_role`, `public.profiles`, Auth profile triggers, RLS policies, hardened function grants, and generated `Database` types.

- [ ] **Step 1: Discover CLI syntax and initialize local artifacts**

Run:

```powershell
pnpm supabase --help
pnpm supabase init
pnpm supabase migration new foundation_auth
```

Use the filename created by the CLI; never invent its timestamp. Set `auth.enable_anonymous_sign_ins = true` in `supabase/config.toml`. Set `supabase/seed.sql` to the explicit no-domain-data statement:

```sql
-- Foundation intentionally has no product or order seed data.
```

- [ ] **Step 2: Write the pgTAP contract before the migration**

```sql
-- supabase/tests/database/001_foundation_auth.test.sql
begin;
select plan(14);

select has_type('public', 'app_role', 'app_role enum exists');
select has_table('public', 'profiles', 'profiles table exists');
select col_is_pk('public', 'profiles', 'id', 'profiles.id is the primary key');
select col_type_is('public', 'profiles', 'role', 'app_role', 'role uses app_role');
select is(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  true,
  'profiles has RLS enabled'
);
select policies_are(
  'public',
  'profiles',
  array['profiles_select_own', 'profiles_update_own'],
  'profiles exposes only own-row policies'
);
select ok(
  case
    when to_regprocedure('public.rls_auto_enable()') is null then true
    else not has_function_privilege('anon', 'public.rls_auto_enable()', 'EXECUTE')
  end,
  'anon cannot execute rls_auto_enable'
);
select ok(
  case
    when to_regprocedure('public.rls_auto_enable()') is null then true
    else not has_function_privilege('authenticated', 'public.rls_auto_enable()', 'EXECUTE')
  end,
  'authenticated cannot execute rls_auto_enable'
);
select has_trigger(
  'public',
  'profiles',
  'profiles_set_updated_at',
  'profile timestamp trigger exists'
);
select has_trigger(
  'auth',
  'users',
  'auth_user_created_profile',
  'auth profile trigger exists'
);
select ok(
  has_table_privilege('authenticated', 'public.profiles', 'SELECT'),
  'authenticated can select profiles through RLS'
);
select ok(
  has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE')
  and has_column_privilege('authenticated', 'public.profiles', 'mobile_number', 'UPDATE'),
  'authenticated can update editable profile columns'
);
select ok(
  not has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE'),
  'authenticated cannot update profile roles'
);
select ok(
  not has_table_privilege('authenticated', 'public.profiles', 'INSERT')
  and not has_table_privilege('authenticated', 'public.profiles', 'DELETE'),
  'authenticated cannot insert or delete profiles'
);

select * from finish();
rollback;
```

- [ ] **Step 3: Run the database contract red**

Run `pnpm supabase start`, then `pnpm supabase test db`.

Expected: FAIL because `app_role` and `profiles` do not exist. If Docker is unavailable, retain this red test and use the pre-migration MCP table/advisor results as the failing hosted baseline; do not weaken the assertions.

- [ ] **Step 4: Write the migration**

Put this SQL in the CLI-generated migration file:

```sql
create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

create type public.app_role as enum ('customer', 'staff', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  display_name text check (display_name is null or char_length(display_name) between 1 and 120),
  mobile_number text check (mobile_number is null or mobile_number ~ '^\\+?[0-9]{10,15}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, mobile_number) on table public.profiles to authenticated;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create function private.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_profile_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_profile_updated_at();

create function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

create trigger auth_user_created_profile
after insert on auth.users
for each row execute function private.handle_new_auth_user();

insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
```

- [ ] **Step 5: Run the local database contract green**

Run:

```powershell
pnpm supabase db reset
pnpm supabase test db
```

Expected: all 14 pgTAP assertions PASS.

- [ ] **Step 6: Apply the identical migration through Supabase MCP**

Call `supabase_apply_migration` with:

- `project_id`: `wzjdnlswlfigwuotmykf`
- `name`: `foundation_auth`
- `query`: the exact SQL from Step 4

Then call `supabase_list_tables` for `public` with `verbose: true` and `supabase_list_migrations`. Confirm `profiles`, `app_role`, and `foundation_auth` are present.

- [ ] **Step 7: Assert hosted security and generate types**

Call `supabase_execute_sql` with:

```sql
select jsonb_build_object(
  'profiles_rls', (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'anon_rls_function_execute', has_function_privilege('anon', 'public.rls_auto_enable()', 'EXECUTE'),
  'authenticated_rls_function_execute', has_function_privilege('authenticated', 'public.rls_auto_enable()', 'EXECUTE'),
  'authenticated_can_select', has_table_privilege('authenticated', 'public.profiles', 'SELECT'),
  'authenticated_can_update_display_name', has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE'),
  'authenticated_can_update_mobile_number', has_column_privilege('authenticated', 'public.profiles', 'mobile_number', 'UPDATE'),
  'authenticated_can_update_role', has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE'),
  'authenticated_can_insert', has_table_privilege('authenticated', 'public.profiles', 'INSERT'),
  'authenticated_can_delete', has_table_privilege('authenticated', 'public.profiles', 'DELETE'),
  'triggers', (
    select jsonb_agg(event_object_schema || '.' || event_object_table || ':' || trigger_name order by trigger_name)
    from information_schema.triggers
    where trigger_name in ('profiles_set_updated_at', 'auth_user_created_profile')
  ),
  'profile_policies', (
    select jsonb_agg(policyname order by policyname)
    from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  )
);
```

Expected: `profiles_rls=true`; both execute values `false`; select and the two editable-column update privileges `true`; role update, insert, and delete privileges `false`; both named triggers present; policies exactly `profiles_select_own` and `profiles_update_own`.

Call `supabase_generate_typescript_types` and save its returned TypeScript verbatim to `types/database.generated.ts`. Add `import type { Database } from "@/types/database.generated"` to each Supabase factory, then supply `<Database>` to `createBrowserClient` and both `createServerClient` calls. Run both `supabase_get_advisors` calls (`security` and `performance`) and resolve every foundation-related finding before continuing.

- [ ] **Step 8: Verify and commit**

Run:

```powershell
pnpm typecheck
pnpm supabase test db
```

```powershell
git status --short
git add supabase/config.toml supabase/migrations supabase/seed.sql supabase/tests/database/001_foundation_auth.test.sql types/database.generated.ts lib/supabase/client.ts lib/supabase/server.ts lib/supabase/proxy.ts
git commit --only -m "feat: establish Supabase auth foundation" -- supabase/config.toml supabase/migrations supabase/seed.sql supabase/tests/database/001_foundation_auth.test.sql types/database.generated.ts lib/supabase/client.ts lib/supabase/server.ts lib/supabase/proxy.ts
```

### Task 5: Define route authorization and proxy behavior

**Files:**

- Create: `lib/auth/routes.ts`
- Test: `lib/auth/routes.test.ts`
- Modify: `proxy.ts`
- Test: `proxy.test.ts`

**Interfaces:**

- Consumes: `refreshSession(request)` from Task 3.
- Produces: `AppRole`, `getRequiredRole(pathname)`, `isSafeReturnPath(value)`, `getDefaultRouteForRole(role)`, and Next.js `proxy(request)`.

- [ ] **Step 1: Write failing pure route tests**

```ts
// lib/auth/routes.test.ts
import { describe, expect, it } from 'vitest';

import {
  getDefaultRouteForRole,
  getRequiredRole,
  isSafeReturnPath,
} from '@/lib/auth/routes';

describe('route authorization', () => {
  it.each([
    ['/', null],
    ['/order', null],
    ['/staff', 'staff'],
    ['/staff/deliveries', 'staff'],
    ['/admin', 'admin'],
    ['/admin/orders', 'admin'],
  ] as const)('classifies %s', (path, role) => {
    expect(getRequiredRole(path)).toBe(role);
  });

  it('accepts only same-origin relative return paths', () => {
    expect(isSafeReturnPath('/admin/orders')).toBe(true);
    expect(isSafeReturnPath('//evil.example')).toBe(false);
    expect(isSafeReturnPath('https://evil.example')).toBe(false);
    expect(isSafeReturnPath('admin/orders')).toBe(false);
  });

  it('maps roles to their home routes', () => {
    expect(getDefaultRouteForRole('customer')).toBe('/');
    expect(getDefaultRouteForRole('staff')).toBe('/staff');
    expect(getDefaultRouteForRole('admin')).toBe('/admin');
  });
});
```

- [ ] **Step 2: Run the route tests red**

Run: `pnpm test -- lib/auth/routes.test.ts`

Expected: FAIL because `routes.ts` does not exist.

- [ ] **Step 3: Implement pure route helpers**

```ts
// lib/auth/routes.ts
export type AppRole = 'customer' | 'staff' | 'admin';

export function getRequiredRole(pathname: string): AppRole | null {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'admin';
  }

  if (pathname === '/staff' || pathname.startsWith('/staff/')) {
    return 'staff';
  }

  return null;
}

export function isSafeReturnPath(value: string | null): value is string {
  return Boolean(value?.startsWith('/') && !value.startsWith('//'));
}

export function getDefaultRouteForRole(role: AppRole): string {
  return { customer: '/', staff: '/staff', admin: '/admin' }[role];
}

export function canRoleAccessPath(role: AppRole, pathname: string): boolean {
  const required = getRequiredRole(pathname);
  return required === null || required === role;
}
```

- [ ] **Step 4: Write failing proxy tests**

```ts
// proxy.test.ts
import { unstable_doesProxyMatch } from 'next/experimental/testing/server';
import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { refreshSession } = vi.hoisted(() => ({
  refreshSession: vi.fn(),
}));

vi.mock('@/lib/supabase/proxy', () => ({ refreshSession }));

import { config, proxy } from '@/proxy';

describe('proxy', () => {
  beforeEach(() => refreshSession.mockReset());

  it('redirects an unauthenticated operational request', async () => {
    refreshSession.mockResolvedValue({
      response: NextResponse.next(),
      userId: null,
    });
    const response = await proxy(
      new NextRequest('https://refillr.example/admin/orders'),
    );

    expect(response.headers.get('location')).toBe(
      'https://refillr.example/sign-in?next=%2Fadmin%2Forders',
    );
  });

  it.each([
    ['/order', null],
    ['/staff', 'staff-user-id'],
  ])(
    'continues %s when its coarse auth requirement is met',
    async (path, userId) => {
      refreshSession.mockResolvedValue({
        response: NextResponse.next(),
        userId,
      });
      const response = await proxy(
        new NextRequest(`https://refillr.example${path}`),
      );

      expect(response.headers.get('x-middleware-next')).toBe('1');
    },
  );

  it.each([
    ['/sw.js', false],
    ['/icon-192x192.png', false],
    ['/_next/static/app.js', false],
    ['/admin', true],
  ])('matches %s: %s', (url, expected) => {
    expect(unstable_doesProxyMatch({ config, nextConfig: {}, url })).toBe(
      expected,
    );
  });
});
```

- [ ] **Step 5: Implement the top-level proxy**

```ts
// proxy.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getRequiredRole } from '@/lib/auth/routes';
import { refreshSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  const { response, userId } = await refreshSession(request);
  const requiredRole = getRequiredRole(request.nextUrl.pathname);

  if (requiredRole && !userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set(
      'next',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    const redirectResponse = NextResponse.redirect(signInUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icon-.*\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

- [ ] **Step 6: Verify and commit**

Run:

```powershell
pnpm test -- lib/auth/routes.test.ts proxy.test.ts
pnpm typecheck
pnpm lint
```

```powershell
git status --short
git add lib/auth/routes.ts lib/auth/routes.test.ts proxy.ts proxy.test.ts
git commit --only -m "feat: protect operational routes" -- lib/auth/routes.ts lib/auth/routes.test.ts proxy.ts proxy.test.ts
```

### Task 6: Implement role guards and on-demand anonymous identity

**Files:**

- Create: `lib/auth/guards.ts`
- Test: `lib/auth/guards.test.ts`

**Interfaces:**

- Consumes: async server `createClient()`, generated `Database`, and `AppRole`.
- Produces: `AuthContext`, `getAuthContext()`, `requireRole(requiredRole)`, and `ensureAnonymousCustomer()`.

- [ ] **Step 1: Write failing guard tests**

Mock the server client and `next/navigation`. Cover these exact cases:

- missing claims returns `null` from `getAuthContext()`;
- customer claim plus own profile returns `{ userId, role: "customer" }`;
- `requireRole("admin")` redirects a staff profile to `/access-denied`;
- no current identity causes `ensureAnonymousCustomer()` to call `signInAnonymously()` and return the created user ID;
- an existing staff/admin identity causes `ensureAnonymousCustomer()` to throw `Customer identity required`.

- [ ] **Step 2: Run the focused test red**

Run: `pnpm test -- lib/auth/guards.test.ts`

Expected: FAIL because the guard module does not exist.

- [ ] **Step 3: Implement guard behavior**

```ts
// lib/auth/guards.ts
import 'server-only';

import { redirect } from 'next/navigation';

import type { AppRole } from '@/lib/auth/routes';
import { createClient } from '@/lib/supabase/server';

export type AuthContext = { userId: string; role: AppRole };

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims.sub;

  if (!userId) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile) return null;
  return { userId, role: profile.role };
}

export async function requireRole(requiredRole: 'staff' | 'admin') {
  const context = await getAuthContext();
  if (!context) redirect('/sign-in');
  if (context.role !== requiredRole) redirect('/access-denied');
  return context;
}

export async function ensureAnonymousCustomer(): Promise<string> {
  const current = await getAuthContext();
  if (current) {
    if (current.role !== 'customer')
      throw new Error('Customer identity required');
    return current.userId;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user)
    throw new Error('Unable to create customer identity');
  return data.user.id;
}
```

- [ ] **Step 4: Verify and commit**

Run:

```powershell
pnpm test -- lib/auth/guards.test.ts
pnpm typecheck
```

```powershell
git status --short
git add lib/auth/guards.ts lib/auth/guards.test.ts
git commit --only -m "feat: add role-aware auth guards" -- lib/auth/guards.ts lib/auth/guards.test.ts
```

### Task 7: Build the operational sign-in vertical slice

**Files:**

- Create: `components/ui/field.tsx` through the shadcn registry
- Create: `features/auth/schemas.ts`
- Create: `features/auth/actions.ts`
- Create: `features/auth/components/sign-in-form.tsx`
- Create: `app/(auth)/sign-in/page.tsx`
- Test: `features/auth/schemas.test.ts`
- Test: `features/auth/components/sign-in-form.test.tsx`

**Interfaces:**

- Consumes: server Supabase client, `getAuthContext()`, `canRoleAccessPath()`, and `getDefaultRouteForRole()`.
- Produces: `SignInInput`, `SignInState`, `signInAction(previousState, formData)`, and `<SignInForm nextPath />`.

- [ ] **Step 1: Inspect and add the explicit shadcn Field component**

Run:

```powershell
pnpm dlx shadcn@latest docs field
pnpm dlx shadcn@latest add @shadcn/field
```

Read the generated file and preserve the configured Base UI/Mira/Lucide conventions. Do not overwrite any existing UI component.

- [ ] **Step 2: Write failing schema and form tests**

```ts
// features/auth/schemas.test.ts
import { describe, expect, it } from 'vitest';

import { signInSchema } from '@/features/auth/schemas';

describe('signInSchema', () => {
  it('normalizes a valid operational login', () => {
    expect(
      signInSchema.parse({
        email: ' STAFF@EXAMPLE.COM ',
        password: 'password123',
      }),
    ).toEqual({ email: 'staff@example.com', password: 'password123' });
  });

  it('rejects malformed credentials', () => {
    expect(
      signInSchema.safeParse({ email: 'bad', password: 'short' }).success,
    ).toBe(false);
  });
});
```

The component test renders `<SignInForm nextPath="/admin/orders" />`, submits malformed input, and expects accessible email/password error text without invoking the server action.

- [ ] **Step 3: Run the focused tests red**

Run: `pnpm test -- features/auth/schemas.test.ts features/auth/components/sign-in-form.test.tsx`

Expected: FAIL because the feature files do not exist.

- [ ] **Step 4: Implement schema and action**

```ts
// features/auth/schemas.ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Enter a valid email address').trim().toLowerCase(),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export type SignInInput = z.infer<typeof signInSchema>;
```

`features/auth/actions.ts` must:

1. declare `"use server"`;
2. parse only `email`, `password`, and `next` using `signInSchema` plus `isSafeReturnPath`;
3. return `{ status: "error", message: "Check your email and password and try again." }` for Supabase auth errors;
4. load `getAuthContext()` after successful sign-in;
5. reject customer-role accounts with the generic operational-access message;
6. redirect to the safe requested path only when `canRoleAccessPath(context.role, next)` is true; otherwise use `getDefaultRouteForRole(context.role)`.

Define `SignInState` as:

```ts
export type SignInState = {
  status: 'idle' | 'error';
  message: string;
  fieldErrors?: Partial<Record<'email' | 'password', string[]>>;
};
```

- [ ] **Step 5: Implement React Hook Form UI and page**

Use `useForm<SignInInput>({ resolver: zodResolver(signInSchema) })`, `useActionState(signInAction, initialState)`, and `startTransition` to submit a `FormData` containing the normalized fields plus `next`. Use shadcn `Card`, `FieldGroup`, `Field`, `FieldLabel`, `FieldError`, `Input`, and `Button`. Apply `aria-invalid` and `data-invalid` exactly where errors exist. The button text is `Sign in`, becomes disabled while pending, and shows no account-existence details.

`app/(auth)/sign-in/page.tsx` awaits `searchParams`, passes only a safe `next` string, and renders the form inside a centered `<main>` with the Refillr brand text.

- [ ] **Step 6: Verify and commit**

Run:

```powershell
pnpm test -- features/auth
pnpm typecheck
pnpm lint
```

```powershell
git status --short
git add components/ui/field.tsx features/auth "app/(auth)/sign-in/page.tsx" package.json pnpm-lock.yaml
git commit --only -m "feat: add operational sign in" -- components/ui/field.tsx features/auth "app/(auth)/sign-in/page.tsx" package.json pnpm-lock.yaml
```

### Task 8: Implement the deep-aqua root visual system and providers

**Files:**

- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `app/providers.tsx`
- Create: `components/brand/refillr-mark.tsx`
- Test: `components/brand/refillr-mark.test.tsx`

**Interfaces:**

- Consumes: Manrope/Geist Mono and TanStack Query.
- Produces: root metadata, semantic tokens, global skip link, `<Providers>`, and `<RefillrMark>`.

- [ ] **Step 1: Write the brand accessibility test**

Render `<RefillrMark />` and assert that the visible `Refillr` wordmark is present. Render `<RefillrMark compact />` and assert that the decorative droplet is hidden from assistive technology while the accessible brand name remains available.

- [ ] **Step 2: Run the test red**

Run: `pnpm test -- components/brand/refillr-mark.test.tsx`

Expected: FAIL because the brand component does not exist.

- [ ] **Step 3: Implement root providers**

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

- [ ] **Step 4: Implement the approved root layout**

Load Manrope with the Next font variable `--font-manrope` and Geist Mono with `--font-geist-mono`. Map them in `@theme inline` as `--font-sans: var(--font-manrope)` and `--font-mono: var(--font-geist-mono)`; do not define a self-referencing `--font-sans`. Export metadata with title template `%s · Refillr`, default `Refillr`, the description `Fast local water refills and delivery tracking.`, application name `Refillr`, manifest `/manifest.webmanifest`, and Apple web-app capability. Render a skip link to `#main-content`, then `<Providers>{children}</Providers>`. The body must use `min-h-svh bg-background text-foreground`.

- [ ] **Step 5: Apply exact semantic theme values**

Retain shadcn/Tailwind imports and map the approved palette through CSS variables. Use:

```css
:root {
  --background: oklch(0.985 0.006 168);
  --foreground: oklch(0.25 0.035 183);
  --card: oklch(1 0 0);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(0.52 0.105 176);
  --primary-foreground: oklch(0.99 0.004 168);
  --secondary: oklch(0.94 0.022 173);
  --secondary-foreground: oklch(0.31 0.055 180);
  --muted: oklch(0.95 0.014 170);
  --muted-foreground: oklch(0.49 0.03 180);
  --accent: oklch(0.91 0.045 173);
  --accent-foreground: oklch(0.29 0.055 180);
  --destructive: oklch(0.58 0.22 27);
  --border: oklch(0.88 0.022 172);
  --input: var(--border);
  --ring: oklch(0.52 0.105 176);
  --radius: 0.65rem;
}
```

Map sidebar tokens from the same palette. Remove the unused dark token block from this increment. Add `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`, and give the skip link a visible focused position.

- [ ] **Step 6: Verify and commit**

Run:

```powershell
pnpm test -- components/brand/refillr-mark.test.tsx
pnpm typecheck
pnpm lint
```

```powershell
git status --short
git add app/globals.css app/layout.tsx app/providers.tsx components/brand/refillr-mark.tsx components/brand/refillr-mark.test.tsx
git commit --only -m "feat: add Refillr visual foundation" -- app/globals.css app/layout.tsx app/providers.tsx components/brand/refillr-mark.tsx components/brand/refillr-mark.test.tsx
```

### Task 9: Add the installable online-first PWA

**Files:**

- Modify: `app/manifest.ts`
- Create: `app/manifest.test.ts`
- Create: `components/pwa/register-service-worker.tsx`
- Create: `components/pwa/register-service-worker.test.tsx`
- Create: `app/offline/page.tsx`
- Create: `app/offline/page.test.tsx`
- Create: `public/sw.js`
- Create: `public/icon-192x192.png`
- Create: `public/icon-512x512.png`
- Create: `public/icon-maskable-512x512.png`
- Modify: `next.config.ts`
- Modify: `app/providers.tsx`

**Interfaces:**

- Consumes: the approved visual palette and the root `<Providers>` from Task 8.
- Produces: valid install manifest, install icons, service-worker registration, navigation-only offline fallback, and security/cache headers.

- [ ] **Step 1: Write manifest and registration tests**

The manifest test calls `manifest()` and asserts:

```ts
expect(manifest()).toMatchObject({
  name: 'Refillr Water Delivery',
  short_name: 'Refillr',
  start_url: '/',
  display: 'standalone',
  background_color: '#f8fbfa',
  theme_color: '#087f74',
});
expect(manifest().icons).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ src: '/icon-192x192.png', sizes: '192x192' }),
    expect.objectContaining({ src: '/icon-512x512.png', sizes: '512x512' }),
    expect.objectContaining({
      src: '/icon-maskable-512x512.png',
      purpose: 'maskable',
    }),
  ]),
);
```

The registrar test stubs `navigator.serviceWorker.register`, renders `<RegisterServiceWorker />`, and expects one call with `/sw.js` and `{ scope: "/", updateViaCache: "none" }`. The offline-page test renders the page and asserts heading `You’re offline` plus text `No order has been submitted or changed.`.

- [ ] **Step 2: Run both tests red**

Run: `pnpm test -- app/manifest.test.ts components/pwa/register-service-worker.test.tsx app/offline/page.test.tsx`

Expected: FAIL because the manifest values and registrar do not meet the contract.

- [ ] **Step 3: Implement the manifest and registrar**

Return the exact values from Step 1, add description `Order water refills and track local deliveries.`, set `scope: "/"`, and declare all icons as `image/png`; set the first two icon purposes to `any` and the third to `maskable`. Implement `app/offline/page.tsx` as a static warm-white recovery card with exactly the tested heading and safety statement; it must never imply queued work exists.

```tsx
// components/pwa/register-service-worker.tsx
'use client';

import { useEffect } from 'react';

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    void navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
  }, []);

  return null;
}
```

Modify `app/providers.tsx` to import `<RegisterServiceWorker>` and render it after `{children}` inside `QueryClientProvider`. This is the first task in which that import may appear.

- [ ] **Step 4: Implement navigation-only offline behavior**

```js
// public/sw.js
const CACHE_NAME = 'refillr-public-shell-v1';
const OFFLINE_URL = '/offline';
const PUBLIC_ASSETS = [
  OFFLINE_URL,
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-maskable-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PUBLIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;

  event.respondWith(
    fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(OFFLINE_URL)) ?? Response.error();
    }),
  );
});
```

- [ ] **Step 5: Create exact-size icon assets**

Create a square source mark with a deep-aqua field (`#087f74`) and a centered warm-white water droplet whose negative space suggests a lowercase `r`; no text, gradients, shadows, or edge-touching details. Produce PNGs at exactly 192×192 and 512×512. For the maskable file, keep all essential artwork inside the central 80% safe zone. Verify dimensions before adding them to Git.

- [ ] **Step 6: Harden Next.js headers**

Retain `typedRoutes: true` and `reactCompiler: true`. Remove unused remote image patterns and the unrelated COOP-only header. Configure global `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`. Add `/sw.js` headers for JavaScript content type, `Cache-Control: no-cache, no-store, must-revalidate`, `Service-Worker-Allowed: /`, and `Content-Security-Policy: default-src 'self'; script-src 'self'`.

- [ ] **Step 7: Verify and commit**

Run:

```powershell
pnpm test -- app/manifest.test.ts components/pwa/register-service-worker.test.tsx app/offline/page.test.tsx
pnpm typecheck
pnpm lint
```

Verify all three PNG dimensions using a local image metadata tool before committing.

```powershell
git status --short
git add app/manifest.ts app/manifest.test.ts app/offline app/providers.tsx components/pwa public/sw.js public/icon-192x192.png public/icon-512x512.png public/icon-maskable-512x512.png next.config.ts
git commit --only -m "feat: add online-first PWA foundation" -- app/manifest.ts app/manifest.test.ts app/offline app/providers.tsx components/pwa public/sw.js public/icon-192x192.png public/icon-512x512.png public/icon-maskable-512x512.png next.config.ts
```

### Task 10: Create customer shell and public route pages

**Files:**

- Create: `components/layouts/customer-shell.tsx`
- Create: `components/page-intro.tsx`
- Create: `app/(customer)/layout.tsx`
- Create: `app/(customer)/page.tsx`
- Create: `app/(customer)/order/page.tsx`
- Create: `app/(customer)/orders/page.tsx`
- Create: `app/(customer)/track/[id]/page.tsx`
- Delete: `app/page.tsx`
- Test: `components/layouts/customer-shell.test.tsx`

**Interfaces:**

- Consumes: `<RefillrMark>`, shadcn Button/Card, and typed Next.js routes.
- Produces: `<CustomerShell>`, `<PageIntro>`, and public pages `/`, `/order`, `/orders`, `/track/[id]`.

- [ ] **Step 1: Write the customer-shell test**

Render `<CustomerShell><div>Content</div></CustomerShell>`. Assert a banner landmark, a main landmark with id `main-content`, links named `Home`, `Orders`, and `Track`, one prominent `Order water` link to `/order`, and visible child content.

- [ ] **Step 2: Run the focused test red**

Run: `pnpm test -- components/layouts/customer-shell.test.tsx`

Expected: FAIL because the shell does not exist.

- [ ] **Step 3: Implement the role-specific customer shell**

Use a sticky warm-white header, centered `max-w-5xl` content, and a mobile fixed bottom nav hidden at `md`. Give all links a minimum height of 44px and semantic active/focus states. The desktop header shows the brand, `Track order`, `My orders`, and the primary `Order water` action. The mobile nav shows `Home`, `Orders`, and `Track`; do not add an account page that does not exist.

`app/(customer)/layout.tsx` simply wraps children in `<CustomerShell>`.

- [ ] **Step 4: Implement exact foundation page copy**

- `/`: eyebrow `Fresh water, on schedule`; heading `Refill today. Relax tomorrow.`; body `Place a local refill or delivery request in under a minute.`; primary link `Order water`; secondary link `Track an order`.
- `/order`: title `Order water`; description `The guided order flow is the next Refillr feature slice.`; action back to `/`.
- `/orders`: title `Your orders`; description `Order history and one-tap repeat ordering will appear after your first order.`.
- `/track/[id]`: await `params`, validate `id` with `z.string().trim().min(4).max(40).regex(/^[A-Za-z0-9-]+$/)`, call `notFound()` on failure, and render title `Track order {id}` plus copy `Live order lookup will be connected in the customer-order slice.`.

Use `<PageIntro>` and shadcn components; do not show fake orders, prices, statuses, or reports.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
pnpm test -- components/layouts/customer-shell.test.tsx
pnpm typecheck
pnpm lint
```

```powershell
git status --short
git add components/layouts/customer-shell.tsx components/layouts/customer-shell.test.tsx components/page-intro.tsx "app/(customer)" app/page.tsx
git commit --only -m "feat: add customer route shell" -- components/layouts/customer-shell.tsx components/layouts/customer-shell.test.tsx components/page-intro.tsx "app/(customer)" app/page.tsx
```

Delete the original `app/page.tsx` as part of the same commit so only the route-group root page owns `/`.

### Task 11: Create the protected delivery-staff shell

**Files:**

- Create: `components/layouts/staff-shell.tsx`
- Create: `app/(staff)/layout.tsx`
- Create: `app/(staff)/staff/page.tsx`
- Create: `app/(staff)/staff/deliveries/page.tsx`
- Test: `components/layouts/staff-shell.test.tsx`

**Interfaces:**

- Consumes: `requireRole("staff")`, `<RefillrMark>`, and `<PageIntro>`.
- Produces: protected `/staff` and `/staff/deliveries` route shells.

- [ ] **Step 1: Write the staff-shell test**

Render the shell and assert links named `Assigned`, `Deliveries`, and `Completed`, a main landmark with `id="main-content"`, and minimum touch-target classes. `Completed` links to `/staff/deliveries?view=completed`; the shell does not query delivery data.

- [ ] **Step 2: Run the test red**

Run: `pnpm test -- components/layouts/staff-shell.test.tsx`

Expected: FAIL because the shell does not exist.

- [ ] **Step 3: Implement staff layout and pages**

The async route-group layout calls `await requireRole("staff")` before rendering `<StaffShell>`. Use a compact mobile-first task header and fixed bottom navigation; at desktop widths, use a simple horizontal task nav rather than the admin sidebar.

- `/staff`: title `Assigned work`; description `New delivery assignments will appear here when order management is connected.`.
- `/staff/deliveries`: await `searchParams`; when `view === "completed"`, title `Completed deliveries`, otherwise `Delivery queue`; use truthful empty-state copy in both cases.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
pnpm test -- components/layouts/staff-shell.test.tsx
pnpm typecheck
pnpm lint
```

```powershell
git status --short
git add components/layouts/staff-shell.tsx components/layouts/staff-shell.test.tsx "app/(staff)"
git commit --only -m "feat: add protected staff shell" -- components/layouts/staff-shell.tsx components/layouts/staff-shell.test.tsx "app/(staff)"
```

### Task 12: Create the protected admin shell and route pages

**Files:**

- Create: `components/layouts/admin-shell.tsx`
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/admin/page.tsx`
- Create: `app/(admin)/admin/orders/page.tsx`
- Create: `app/(admin)/admin/customers/page.tsx`
- Create: `app/(admin)/admin/deliveries/page.tsx`
- Create: `app/(admin)/admin/reports/page.tsx`
- Test: `components/layouts/admin-shell.test.tsx`

**Interfaces:**

- Consumes: `requireRole("admin")`, shadcn Sheet, `<RefillrMark>`, and `<PageIntro>`.
- Produces: responsive admin navigation and all approved `/admin` route shells.

- [ ] **Step 1: Write the admin-shell test**

Render the shell and assert labelled navigation plus links to `/admin`, `/admin/orders`, `/admin/customers`, `/admin/deliveries`, and `/admin/reports`. Assert a mobile menu button has an accessible name and the main landmark has `id="main-content"`.

- [ ] **Step 2: Run the test red**

Run: `pnpm test -- components/layouts/admin-shell.test.tsx`

Expected: FAIL because the shell does not exist.

- [ ] **Step 3: Implement responsive admin navigation**

Use a persistent `md` sidebar with semantic sidebar tokens and a mobile shadcn Sheet trigger. Because the project uses Base UI primitives, follow the installed shadcn Sheet API and use `render` rather than Radix-only `asChild`. Include `SheetTitle` even when visually hidden. Keep the content area independently scrollable and use Lucide icons through the configured library.

The async route-group layout calls `await requireRole("admin")` before rendering `<AdminShell>`.

- [ ] **Step 4: Implement exact route-shell copy**

| Route               | Title               | Description                                                               |
| ------------------- | ------------------- | ------------------------------------------------------------------------- |
| `/admin`            | Operations overview | Live operational metrics arrive with the order-management slice.          |
| `/admin/orders`     | Orders              | Incoming and completed orders will be managed here.                       |
| `/admin/customers`  | Customers           | Customer records will appear after the ordering workflow is connected.    |
| `/admin/deliveries` | Deliveries          | Driver assignment and delivery progress will be managed here.             |
| `/admin/reports`    | Reports             | Sales and operational summaries will appear after completed orders exist. |

Use `<PageIntro>` and truthful empty states; do not generate sample metrics.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
pnpm test -- components/layouts/admin-shell.test.tsx
pnpm typecheck
pnpm lint
```

```powershell
git status --short
git add components/layouts/admin-shell.tsx components/layouts/admin-shell.test.tsx "app/(admin)"
git commit --only -m "feat: add protected admin shell" -- components/layouts/admin-shell.tsx components/layouts/admin-shell.test.tsx "app/(admin)"
```

### Task 13: Add recovery, loading, and denied-access surfaces

**Files:**

- Create: `app/access-denied/page.tsx`
- Create: `app/error.tsx`
- Create: `app/not-found.tsx`
- Create: `app/loading.tsx`
- Test: `app/system-pages.test.tsx`

**Interfaces:**

- Consumes: root tokens and shadcn Button/Card/Skeleton.
- Produces: truthful recovery UI for auth, routing, loading, and runtime failures; Task 9 owns connectivity recovery.

- [ ] **Step 1: Write system-page tests**

Render each static page and assert these exact user-facing outcomes:

- access denied: heading `You don’t have access to this area` and link `Return home`;
- not found: heading `We couldn’t find that page` and link `Go to Refillr`;
- loading: an element with accessible label `Loading page`;
- error: button `Try again` invokes the supplied `retry` callback.

- [ ] **Step 2: Run the test red**

Run: `pnpm test -- app/system-pages.test.tsx`

Expected: FAIL because the system pages do not exist.

- [ ] **Step 3: Implement the five surfaces**

`app/error.tsx` must begin with `"use client"`, log only `error.digest` through `console.error("Route error", error.digest)`, and call `retry()` from the button. Do not render the error message. The loading page uses existing shadcn Skeleton components and an `aria-label`.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
pnpm test -- app/system-pages.test.tsx
pnpm typecheck
pnpm lint
```

```powershell
git status --short
git add app/access-denied app/error.tsx app/not-found.tsx app/loading.tsx app/system-pages.test.tsx
git commit --only -m "feat: add application recovery states" -- app/access-denied app/error.tsx app/not-found.tsx app/loading.tsx app/system-pages.test.tsx
```

### Task 14: Verify hosted auth, PWA behavior, and the full production story

**Files:**

- Modify: `README.md`
- Create: `docs/setup/supabase.md`

**Interfaces:**

- Consumes: every previous task and the hosted Supabase project.
- Produces: reproducible setup documentation and complete verification evidence.

- [ ] **Step 1: Document local and hosted setup**

Update README with the exact commands `pnpm install`, environment variable names, `pnpm dev`, `pnpm test`, `pnpm typecheck`, `pnpm build`, and local Supabase commands. In `docs/setup/supabase.md`, document project ref `wzjdnlswlfigwuotmykf`, Singapore region, migration application through MCP, generated types, manual staff/admin provisioning, and the requirement that hosted anonymous sign-ins be enabled. Never include an API key, password, access token, or database connection string.

- [ ] **Step 2: Run the complete automated gate**

Run:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Expected: all commands exit 0 with no warnings introduced by foundation files.

- [ ] **Step 3: Verify hosted anonymous identity safely**

Use the ignored `.env.local` publishable configuration to call `signInAnonymously()` once. If hosted anonymous sign-ins are disabled, stop and ask the user to enable **Authentication → Providers → Anonymous Sign-Ins** in the Refillr Supabase dashboard, then retry. Capture the created user ID, verify through Supabase MCP that exactly one corresponding `profiles` row exists with role `customer`, then sign out. Do not change its role or expose its token.

- [ ] **Step 4: Re-run hosted database advisors**

Call security and performance `supabase_get_advisors` for project `wzjdnlswlfigwuotmykf`. Expected: no foundation-relevant warnings, including no anonymous/authenticated execution finding for `public.rls_auto_enable()`.

- [ ] **Step 5: Run browser verification**

Start `pnpm dev`. At 390×844 and 1440×900 viewports verify:

1. `/`, `/order`, `/orders`, and `/track/ABC-1234` render without console or hydration errors.
2. `/staff` and `/admin` redirect an unauthenticated browser to `/sign-in` with a safe encoded `next` parameter.
3. Customer mobile bottom navigation, staff task navigation, and admin desktop/sidebar behavior match the approved role-specific structure.
4. `/manifest.webmanifest`, all three icons, and `/sw.js` return 200.
5. `/sw.js` carries no-store and service-worker-scope headers.
6. After one online load of `/offline`, simulate offline mode and navigate; the offline page appears and explicitly states no order was submitted or changed.
7. No protected document, Supabase request, or POST response appears in Cache Storage.

- [ ] **Step 6: Inspect final repository and database diffs**

Run:

```powershell
git diff --check
git status --short
git diff --stat
```

Confirm unrelated pre-existing index entries were neither dropped nor swept into task commits. Compare hosted table/migration listings with `supabase/migrations` and regenerate `types/database.generated.ts` once more; expect no type diff.

- [ ] **Step 7: Commit documentation only**

```powershell
git status --short
git add README.md docs/setup/supabase.md
git commit --only -m "docs: add Refillr setup guide" -- README.md docs/setup/supabase.md
```

## Final Checkpoint

- [ ] All 14 task-level tests and commits are complete.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass from the final working tree.
- [ ] Supabase schema, generated types, migration listing, and advisor results are verified through MCP.
- [ ] Anonymous sign-in creates a customer profile on the hosted project.
- [ ] Customer, staff, and admin access boundaries are verified.
- [ ] PWA manifest, icons, service worker, offline fallback, and cache exclusions are verified in a real browser.
- [ ] No secrets, service-role client, fake business data, notification code, or domain-feature logic were added.
- [ ] Unrelated user changes remain preserved.
