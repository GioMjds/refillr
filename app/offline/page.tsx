import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center border-border bg-card">
        <CardHeader className="space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <WifiOff className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            You’re offline
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your internet connection and try again.
          </p>
          <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground font-medium">
            No order has been submitted or changed.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
