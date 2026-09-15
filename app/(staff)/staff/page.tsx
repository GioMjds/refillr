import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { Truck } from 'lucide-react';

export default function StaffAssignedPage() {
  return (
    <div className="py-6 sm:py-8 space-y-6">
      <PageIntro
        title="Assigned work"
        description="New delivery assignments will appear here when order management is connected."
      />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Truck className="size-10 text-muted-foreground/60 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No assigned deliveries</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            When station dispatch assigns orders to your route, they will be listed here with addresses and gallon counts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
