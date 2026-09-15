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
