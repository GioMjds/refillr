import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ListOrdered } from 'lucide-react';

export default async function StaffDeliveriesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const isCompleted = view === 'completed';

  const title = isCompleted ? 'Completed deliveries' : 'Delivery queue';
  const description = isCompleted
    ? 'Record of fulfilled and signed water gallon deliveries.'
    : 'Active dispatch queue and pending customer drop-offs.';

  return (
    <div className="py-6 sm:py-8 space-y-6">
      <PageIntro title={title} description={description} />
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {isCompleted ? (
            <CheckCircle2
              className="size-10 text-muted-foreground/60 mb-3"
              aria-hidden="true"
            />
          ) : (
            <ListOrdered
              className="size-10 text-muted-foreground/60 mb-3"
              aria-hidden="true"
            />
          )}
          <p className="text-sm font-medium text-foreground">
            {isCompleted ? 'No completed deliveries yet' : 'Delivery queue is empty'}
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {isCompleted
              ? 'Deliveries marked as completed during your shift will be archived here.'
              : 'Assigned delivery stops ready for transit will appear in this queue.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
