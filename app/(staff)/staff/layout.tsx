import { StaffShell } from '@/components/layouts/staff-shell';
import { requireRole } from '@/lib/auth/guards';

export default async function StaffLayout({ children }: LayoutProps<'/staff'>) {
  await requireRole('staff');
  return <StaffShell>{children}</StaffShell>;
}
