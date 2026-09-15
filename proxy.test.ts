import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
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
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(
      expected,
    );
  });
});
