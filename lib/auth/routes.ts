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
