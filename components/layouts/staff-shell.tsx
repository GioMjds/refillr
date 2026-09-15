import { type ReactNode } from 'react';
import Link from 'next/link';
import { Truck, CheckCircle2, ListOrdered } from 'lucide-react';

import { RefillrMark } from '@/components/brand/refillr-mark';
import { Badge } from '@/components/ui/badge';

export function StaffShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col bg-background text-foreground">
      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <RefillrMark />
            <Badge variant="secondary" className="text-xs font-medium">
              Delivery Staff
            </Badge>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/staff"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
            >
              <Truck className="size-4" aria-hidden="true" />
              Assigned
            </Link>
            <Link
              href="/staff/deliveries"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
            >
              <ListOrdered className="size-4" aria-hidden="true" />
              Deliveries
            </Link>
            <Link
              href="/staff/deliveries?view=completed"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Completed
            </Link>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8 pb-24 md:pb-8 focus:outline-none"
      >
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Staff Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <div className="grid grid-cols-3 h-16 items-center px-4">
          <Link
            href="/staff"
            className="flex flex-col items-center justify-center min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Truck className="size-5 mb-1" aria-hidden="true" />
            Assigned
          </Link>
          <Link
            href="/staff/deliveries"
            className="flex flex-col items-center justify-center min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <ListOrdered className="size-5 mb-1" aria-hidden="true" />
            Deliveries
          </Link>
          <Link
            href="/staff/deliveries?view=completed"
            className="flex flex-col items-center justify-center min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <CheckCircle2 className="size-5 mb-1" aria-hidden="true" />
            Completed
          </Link>
        </div>
      </nav>
    </div>
  );
}
