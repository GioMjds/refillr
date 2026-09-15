import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Operations overview"
        description="Live operational metrics arrive with the order-management slice."
      />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <LayoutDashboard className="size-10 text-muted-foreground/60 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">Operational dashboard idle</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Live volume, revenue, and delivery velocity metrics will activate when order lifecycle events are recorded.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}