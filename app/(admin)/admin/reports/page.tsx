import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Reports"
        description="Sales and operational summaries will appear after completed orders exist."
      />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="size-10 text-muted-foreground/60 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No reports generated</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Daily gallon tallies, payment settlement breakdowns, and delivery performance summaries will compute here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
