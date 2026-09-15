'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from 'cn';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
}

const STEPS = [
  { step: 1, title: 'Containers' },
  { step: 2, title: 'Delivery' },
  { step: 3, title: 'Review' },
] as const;

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Order progress" className="w-full py-2">
      <ol className="relative flex items-center justify-between w-full max-w-sm mx-auto">
        {/* Background connector track */}
        <div
          className="absolute left-6 right-6 top-4 -translate-y-1/2 h-0.5 bg-border -z-0"
          aria-hidden="true"
        />

        {/* Active progress fill */}
        <div
          className="absolute left-6 top-4 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 ease-out -z-0"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
          }}
          aria-hidden="true"
        />

        {STEPS.map(({ step, title }) => {
          const isCurrent = currentStep === step;
          const isCompleted = currentStep > step;
          const isClickable = onStepClick && isCompleted;

          return (
            <li key={step} className="flex flex-col items-center relative z-10">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step)}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
                  isCurrent &&
                    'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-105',
                  isCompleted &&
                    'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer',
                  !isCurrent &&
                    !isCompleted &&
                    'bg-card text-muted-foreground border-2 border-border',
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 stroke-[3]" aria-hidden="true" />
                ) : (
                  <span>{step}</span>
                )}
              </button>

              <span
                className={cn(
                  'mt-2 text-xs font-medium transition-colors',
                  isCurrent && 'text-foreground font-semibold',
                  isCompleted && 'text-foreground',
                  !isCurrent && !isCompleted && 'text-muted-foreground',
                )}
              >
                {title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
