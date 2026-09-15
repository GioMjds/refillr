import { type ReactNode } from 'react';

import { StaffShell } from '@/components/layouts/staff-shell';
import { requireRole } from '@/lib/auth/guards';

export default async function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole('staff');
  return <StaffShell>{children}</StaffShell>;
}
