import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { PageIntro } from '@/components/page-intro';
import { cn } from 'cn';

export default function OrderPage() {
  return (
    <div className="py-6 sm:py-8">
      <PageIntro
        title="Order water"
        description="The guided order flow is the next Refillr feature slice."
      >
        <div className="pt-4">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'min-h-[44px] px-4',
            )}
          >
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </PageIntro>
    </div>
  );
}
