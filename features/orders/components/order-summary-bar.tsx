'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useOrderWizardStore } from '../store';
import { cn } from 'cn';

interface OrderSummaryBarProps {
  onConfirmOrder: () => void;
}

export function OrderSummaryBar({ onConfirmOrder }: OrderSummaryBarProps) {
  const {
    step,
    nextStep,
    prevStep,
    getTotal,
    getItemCount,
    isSubmitting,
  } = useOrderWizardStore();

  const total = getTotal();
  const itemCount = getItemCount();

  const isStep1Disabled = itemCount === 0;

  return (
    <div
      role="region"
      aria-label="Order actions and summary"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 px-4 py-3 sm:py-4 shadow-lg pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        {/* Step back or Total breakdown */}
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="flex size-11 sm:size-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Previous step"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
          ) : null}

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {step === 1 ? 'Subtotal' : 'Total to pay'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-mono text-foreground">
                ₱{total}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                ({itemCount} {itemCount === 1 ? 'bottle' : 'bottles'})
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex-1 max-w-xs sm:max-w-sm flex justify-end">
          {step === 1 && (
            <button
              type="button"
              onClick={nextStep}
              disabled={isStep1Disabled}
              className={cn(
                'w-full h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm',
                'hover:bg-primary/90 active:scale-[0.98]',
                'disabled:pointer-events-none disabled:opacity-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              <span>Continue to delivery</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          )}

          {step === 2 && (
            <button
              type="submit"
              form="delivery-form"
              className={cn(
                'w-full h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm',
                'hover:bg-primary/90 active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              <span>Continue to review</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={onConfirmOrder}
              disabled={isSubmitting}
              className={cn(
                'w-full h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm',
                'hover:bg-primary/90 active:scale-[0.98]',
                'disabled:pointer-events-none disabled:opacity-70',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Placing order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  <span>Confirm order</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
