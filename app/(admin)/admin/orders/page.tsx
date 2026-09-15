import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Orders"
        description="Incoming and completed orders will be managed here."
      />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardList className="size-10 text-muted-foreground/60 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No orders in pipeline</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Customer gallon refill and new container orders will be queued here for fulfillment and status transitions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
