import { type ReactNode } from 'react';
import Link from 'next/link';
import { Home, ClipboardList, MapPin, Droplet } from 'lucide-react';

import { RefillrMark } from '@/components/brand/refillr-mark';
import { buttonVariants } from '@/components/ui/button';
import { cn } from 'cn';

export function CustomerShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col bg-background text-foreground">
      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-border bg-background"
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <RefillrMark />

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
            >
              Home
            </Link>
            <Link
              href="/#track-section"
              className="min-h-[44px] inline-flex items-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
            >
              Track order
            </Link>
            <Link
              href="/orders"
              className="min-h-[44px] inline-flex items-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
            >
              My orders
            </Link>
            <Link
              href="/order"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'min-h-[44px] px-4 font-semibold',
              )}
            >
              <Droplet className="mr-1.5 size-4 fill-current" aria-hidden="true" />
              Order water
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
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background"
      >
        <div className="grid grid-cols-3 h-16 items-center px-4">
          <Link
            href="/"
            className="flex flex-col items-center justify-center min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Home className="size-5 mb-1" aria-hidden="true" />
            Home
          </Link>
          <Link
            href="/#track-section"
            className="flex flex-col items-center justify-center min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <MapPin className="size-5 mb-1" aria-hidden="true" />
            Track
          </Link>
          <Link
            href="/orders"
            className="flex flex-col items-center justify-center min-h-[44px] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <ClipboardList className="size-5 mb-1" aria-hidden="true" />
            My orders
          </Link>
        </div>
      </nav>
    </div>
  );
}
