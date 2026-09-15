'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from 'cn';

export function OrderLookupForm() {
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = reference.trim();

    if (!cleanRef) {
      setError('Please enter your order reference or tracking code.');
      return;
    }

    // Strip leading '#' if customer typed it
    const normalized = cleanRef.replace(/^#/, '');
    router.push(`/track/${encodeURIComponent(normalized)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            value={reference}
            onChange={(e) => {
              setReference(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Order reference (e.g. REF-8421)"
            aria-label="Order tracking reference"
            aria-invalid={!!error}
            aria-describedby={error ? 'lookup-error' : undefined}
            className={cn(
              'w-full h-11 pl-10 pr-4 rounded-lg border bg-card text-foreground text-sm font-mono transition-colors',
              'placeholder:text-muted-foreground placeholder:font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
              error ? 'border-destructive ring-destructive/20' : 'border-border',
            )}
          />
        </div>
        <button
          type="submit"
          className="h-11 px-5 rounded-lg border border-border bg-card text-foreground font-semibold text-sm inline-flex items-center justify-center gap-1.5 hover:bg-muted active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>Track</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p id="lookup-error" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
