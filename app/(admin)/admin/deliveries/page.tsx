import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { Truck } from 'lucide-react';

export default function AdminDeliveriesPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Deliveries"
        description="Driver assignment and delivery progress will be managed here."
      />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Truck className="size-10 text-muted-foreground/60 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No active deliveries</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Delivery assignments, fleet status, and in-transit delivery tracking will be coordinated from this panel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
