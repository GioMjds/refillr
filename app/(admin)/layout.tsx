import { AdminShell } from '@/components/layouts/admin-shell';
import { requireRole } from '@/lib/auth/guards';

export default async function AdminLayout({
  children,
}: LayoutProps<'/admin'>) {
  await requireRole('admin');
  return <AdminShell>{children}</AdminShell>;
}
