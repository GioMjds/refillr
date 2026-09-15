import { CustomerShell } from '@/components/layouts/customer-shell';

export default function CustomerLayout({ children }: LayoutProps<'/'>) {
  return <CustomerShell>{children}</CustomerShell>;
}
