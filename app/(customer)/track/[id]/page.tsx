import { notFound } from 'next/navigation';
import { z } from 'zod';

import { PageIntro } from '@/components/page-intro';
import { Card, CardContent } from '@/components/ui/card';

const trackIdSchema = z
  .string()
  .trim()
  .min(4)
  .max(40)
  .regex(/^[A-Za-z0-9-]+$/);

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = trackIdSchema.safeParse(id);

  if (!parsed.success) {
    notFound();
  }

  return (
    <div className="py-6 sm:py-8 space-y-6">
      <PageIntro
        title={`Track order ${parsed.data}`}
        description="Live order lookup will be connected in the customer-order slice."
      />
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Order status and delivery dispatch updates will appear here once active orders exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
