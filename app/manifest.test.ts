import { describe, expect, it } from 'vitest';

import manifest from '@/app/manifest';

describe('manifest', () => {
  it('returns valid PWA manifest matching the spec', () => {
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
  });
});
