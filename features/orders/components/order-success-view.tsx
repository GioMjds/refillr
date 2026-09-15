'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy, Check, ArrowRight, RefreshCw, Clock, MapPin } from 'lucide-react';
import { useOrderWizardStore } from '../store';
import { DELIVERY_WINDOWS } from '../catalog';
import { cn } from 'cn';

interface OrderSuccessViewProps {
  order: {
    orderId: string;
    trackingNumber: string;
    createdAt: string;
  };
}

export function OrderSuccessView({ order }: OrderSuccessViewProps) {
  const { delivery, getTotal, getItemCount, reset } = useOrderWizardStore();
  const [copied, setCopied] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();

  const activeWindow =
    DELIVERY_WINDOWS.find((w) => w.id === delivery.deliveryWindow) ??
    DELIVERY_WINDOWS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in-50 duration-300">
      {/* Success Badge & Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-10" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Order placed successfully!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Your water refill request has been dispatched to the local station.
        </p>
      </div>

      {/* Tracking ID Card */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs text-center space-y-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Tracking Reference Number
        </span>

        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
            {order.trackingNumber}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Copy tracking reference"
          >
            {copied ? (
              <Check className="size-4 text-primary" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-primary font-medium">
          <Clock className="size-3.5" aria-hidden="true" />
          <span>Expected Delivery: {activeWindow.label}</span>
        </div>
      </div>

      {/* Summary Info */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3 text-sm">
        <div className="flex justify-between items-center pb-2 border-b border-border/60">
          <span className="text-muted-foreground">Delivery recipient</span>
          <span className="font-semibold text-foreground">{delivery.fullName}</span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-border/60">
          <span className="text-muted-foreground">Mobile contact</span>
          <span className="font-semibold text-foreground font-mono">{delivery.phoneNumber}</span>
        </div>

        <div className="flex justify-between items-start pb-2 border-b border-border/60">
          <span className="text-muted-foreground flex items-center gap-1">
            <MapPin className="size-3.5 text-primary" aria-hidden="true" />
            Drop-off
          </span>
          <span className="font-medium text-foreground text-right max-w-xs">{delivery.address}</span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-border/60">
          <span className="text-muted-foreground">Quantity ordered</span>
          <span className="font-semibold text-foreground">
            {itemCount} {itemCount === 1 ? 'container' : 'containers'}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1 font-bold">
          <span className="text-foreground">Payment upon delivery</span>
          <span className="text-primary font-mono text-base">
            ₱{total} ({delivery.paymentMethod === 'cod' ? 'Cash' : 'GCash'})
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href={`/track/${order.orderId}`}
          className={cn(
            'flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors hover:bg-primary/90',
          )}
        >
          <span>Track live delivery</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={reset}
          className="flex-1 h-12 rounded-lg border border-border bg-card text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors"
        >
          <RefreshCw className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>Place another order</span>
        </button>
      </div>
    </div>
  );
}
