'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Truck,
  FileText,
  Menu,
} from 'lucide-react';
import { RefillrMark } from '@/components/brand/refillr-mark';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from 'cn';

type NavItem = {
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
};

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/deliveries', label: 'Deliveries', icon: Truck },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
] satisfies NavItem[];

function NavLinks({
  pathname,
  onClick,
}: {
  pathname: string | null;
  onClick?: () => void;
}) {
  const currentPath = pathname ?? '';

  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Admin Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/admin'
            ? currentPath === '/admin'
            : currentPath.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              'min-h-11 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-svh flex flex-col md:flex-row bg-background text-foreground">
      {/* Mobile Header with Sheet */}
      <header
        role="banner"
        className="md:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4"
      >
        <div className="flex items-center gap-2">
          <RefillrMark />
          <Badge variant="secondary" className="text-xs">
            Admin
          </Badge>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open Navigation Menu"
                className="min-h-11 min-w-11"
              />
            }
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar">
            <SheetHeader className="p-4 border-b border-sidebar-border">
              <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
              <div className="flex items-center gap-2">
                <RefillrMark />
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              </div>
            </SheetHeader>
            <div className="py-4">
              <NavLinks pathname={pathname} onClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <RefillrMark />
          <Badge variant="secondary" className="text-xs">
            Admin
          </Badge>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavLinks pathname={pathname} />
        </div>
      </aside>

      {/* Content Region */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 md:pl-64 focus:outline-none"
      >
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
