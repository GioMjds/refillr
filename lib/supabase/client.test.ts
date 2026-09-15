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
