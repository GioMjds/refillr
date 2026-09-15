import { Droplet } from 'lucide-react';
import Link from 'next/link';

export function RefillrMark({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Refillr Home"
      className={`inline-flex items-center gap-2 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 ${className}`}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Droplet className="size-4.5 fill-current" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="text-lg tracking-tight font-bold text-foreground">
          Refillr
        </span>
      )}
    </Link>
  );
}
