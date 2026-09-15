'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from 'cn';

interface StepperControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export function StepperControl({
  value,
  onChange,
  min = 0,
  max = 99,
  label = 'Quantity',
  className,
}: StepperControlProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex items-center rounded-lg border border-border bg-card p-0.5 shadow-xs',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        aria-label={`Decrease ${label}`}
        className="flex size-10 sm:size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>

      <span
        aria-live="polite"
        className="w-10 sm:w-8 text-center text-base font-semibold text-foreground select-none"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        aria-label={`Increase ${label}`}
        className="flex size-10 sm:size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
