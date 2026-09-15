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
