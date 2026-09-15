import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Customers"
        description="Customer records will appear after the ordering workflow is connected."
      />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="size-10 text-muted-foreground/60 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No customer records</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Saved customer profiles, delivery addresses, and gallon transaction history will be organized here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
