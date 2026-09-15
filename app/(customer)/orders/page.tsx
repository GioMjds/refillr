import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="py-6 sm:py-8 space-y-6">
      <PageIntro
        title="Your orders"
        description="Order history and one-tap repeat ordering will appear after your first order."
      />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="size-10 text-muted-foreground/60 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No orders yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            When you place an order for delivery or pickup, it will appear here for easy tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
