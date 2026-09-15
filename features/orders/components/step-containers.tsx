'use client';

import React from 'react';
import { WATER_CATALOG } from '../catalog';
import { useOrderWizardStore } from '../store';
import { SlimBottleIcon, RoundBottleIcon } from './bottle-icons';
import { StepperControl } from './stepper-control';
import { PurchaseMode } from '../types';
import { cn } from 'cn';

export function StepContainers() {
  const { items, setItemMode, setItemQuantity } = useOrderWizardStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Select containers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your bottle types and quantities. Select &ldquo;Buy New&rdquo; if you need extra bottles.
        </p>
      </div>

      <div className="space-y-4">
        {WATER_CATALOG.map((catalogItem) => {
          const itemState = items[catalogItem.id] ?? {
            mode: 'refill' as PurchaseMode,
            quantity: 0,
          };
          const isSelected = itemState.quantity > 0;
          const currentPrice =
            itemState.mode === 'refill'
              ? catalogItem.refillPrice
              : catalogItem.newPrice;

          return (
            <div
              key={catalogItem.id}
              className={cn(
                'rounded-xl border bg-card p-4 sm:p-5 transition-all shadow-xs',
                isSelected
                  ? 'border-primary/40 ring-1 ring-primary/20 bg-card'
                  : 'border-border',
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left section: Icon + Details */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-lg bg-muted/60 p-2">
                    {catalogItem.id === 'slim-5gal' ? (
                      <SlimBottleIcon className="h-full w-auto" />
                    ) : (
                      <RoundBottleIcon className="h-full w-auto" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-semibold text-foreground">
                        {catalogItem.name}
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-accent/60 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                        ₱{currentPrice} / {itemState.mode === 'refill' ? 'refill' : 'bottle'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {catalogItem.volume} · {catalogItem.description}
                    </p>
                  </div>
                </div>

                {/* Right section: Mode toggle + Stepper */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                  {/* Segmented Toggle: Refill vs Buy New */}
                  <div
                    role="radiogroup"
                    aria-label={`Purchase mode for ${catalogItem.name}`}
                    className="inline-flex rounded-lg bg-muted p-1 text-xs font-medium"
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={itemState.mode === 'refill'}
                      onClick={() => setItemMode(catalogItem.id, 'refill')}
                      className={cn(
                        'min-h-[36px] sm:min-h-[32px] px-3 rounded-md transition-all',
                        itemState.mode === 'refill'
                          ? 'bg-card text-foreground font-semibold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Refill
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={itemState.mode === 'new'}
                      onClick={() => setItemMode(catalogItem.id, 'new')}
                      className={cn(
                        'min-h-[36px] sm:min-h-[32px] px-3 rounded-md transition-all',
                        itemState.mode === 'new'
                          ? 'bg-card text-foreground font-semibold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Buy New
                    </button>
                  </div>

                  {/* Quantity Stepper */}
                  <StepperControl
                    value={itemState.quantity}
                    onChange={(newQty) =>
                      setItemQuantity(catalogItem.id, newQty)
                    }
                    min={0}
                    max={20}
                    label={catalogItem.name}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Free delivery prompt banner */}
      <div className="rounded-lg bg-secondary/70 border border-border/60 p-3.5 flex items-center justify-between text-xs text-secondary-foreground">
        <span>
          <strong>Free Station Delivery</strong> on orders of 2 or more containers.
        </span>
        <span className="font-semibold text-primary">Standard ₱25 on 1 bottle</span>
      </div>
    </div>
  );
}
