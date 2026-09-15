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
