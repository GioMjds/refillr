import Link from 'next/link';
import { Droplet, Search } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { PageIntro } from '@/components/page-intro';
import { cn } from 'cn';

export default function HomePage() {
  return (
    <div className="py-8 sm:py-12">
      <PageIntro
        eyebrow="Fresh water, on schedule"
        title="Refill today. Relax tomorrow."
        description="Place a local refill or delivery request in under a minute."
      >
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/order"
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'h-12 px-6 font-semibold shadow-sm',
            )}
          >
            <Droplet className="mr-2 size-5 fill-current" aria-hidden="true" />
            Order water
          </Link>
          <Link
            href="/orders"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-12 px-6',
            )}
          >
            <Search className="mr-2 size-5" aria-hidden="true" />
            Track an order
          </Link>
        </div>
      </PageIntro>
    </div>
  );
}
