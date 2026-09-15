'use client';

import React from 'react';
import { Banknote, QrCode, MapPin, Edit3, ShieldCheck, Truck } from 'lucide-react';
import { useOrderWizardStore } from '../store';
import { WATER_CATALOG, DELIVERY_WINDOWS } from '../catalog';
import { PaymentMethod } from '../types';
import { cn } from 'cn';

export function StepReview() {
  const {
    items,
    delivery,
    setStep,
    setDeliveryDetails,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    getItemCount,
  } = useOrderWizardStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const itemCount = getItemCount();

  const activeWindow =
    DELIVERY_WINDOWS.find((w) => w.id === delivery.deliveryWindow) ??
    DELIVERY_WINDOWS[0];

  const orderItemsList = WATER_CATALOG.flatMap((catalogItem) => {
    const itemState = items[catalogItem.id];
    if (!itemState || itemState.quantity <= 0) return [];
    const unitPrice =
      itemState.mode === 'refill'
        ? catalogItem.refillPrice
        : catalogItem.newPrice;
    return [
      {
        id: catalogItem.id,
        name: catalogItem.name,
        mode: itemState.mode,
        quantity: itemState.quantity,
        unitPrice,
        subtotal: unitPrice * itemState.quantity,
      },
    ];
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Review &amp; payment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm your order details and choose how you would like to pay upon delivery.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <span>Order Summary</span>
            <span className="text-xs font-normal text-muted-foreground">
              ({itemCount} {itemCount === 1 ? 'container' : 'containers'})
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 min-h-[32px] px-2"
          >
            <Edit3 className="size-3" aria-hidden="true" />
            Edit items
          </button>
        </div>

        {/* Itemized List */}
        <div className="space-y-2.5">
          {orderItemsList.map((item) => (
            <div
              key={`${item.id}-${item.mode}`}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {item.quantity}x
                </span>
                <span className="text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
                  {item.mode === 'refill' ? 'Refill' : 'New Bottle'}
                </span>
              </div>
              <span className="font-medium text-foreground">
                ₱{item.subtotal}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Breakdown */}
        <div className="pt-3 border-t border-border/60 space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₱{subtotal}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5 text-primary" aria-hidden="true" />
              Delivery fee
            </span>
            <span>
              {deliveryFee === 0 ? (
                <span className="font-semibold text-primary">FREE</span>
              ) : (
                `₱${deliveryFee}`
              )}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border/60">
            <span>Total amount to pay</span>
            <span className="text-primary font-mono text-lg">₱{total}</span>
          </div>
        </div>
      </div>

      {/* Delivery Destination Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            Delivery Destination
          </h2>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 min-h-[32px] px-2"
          >
            <Edit3 className="size-3" aria-hidden="true" />
            Edit details
          </button>
        </div>

        <div className="mt-3 space-y-1 text-sm">
          <p className="font-semibold text-foreground">{delivery.fullName}</p>
          <p className="text-muted-foreground">{delivery.phoneNumber}</p>
          <p className="text-foreground mt-1 whitespace-pre-line">
            {delivery.address}
          </p>
          {delivery.notes && (
            <p className="text-xs text-muted-foreground bg-muted/60 p-2.5 rounded-md mt-2 italic">
              Note: &ldquo;{delivery.notes}&rdquo;
            </p>
          )}
          <div className="pt-2 flex items-center gap-1.5 text-xs text-primary font-medium">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Scheduled for: {activeWindow.label}
          </div>
        </div>
      </div>

      {/* Payment Selection Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <h2 className="text-base font-semibold text-foreground mb-3">
          Payment Method
        </h2>

        <div
          role="radiogroup"
          aria-label="Payment method"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* Cash on Delivery */}
          <button
            type="button"
            role="radio"
            aria-checked={delivery.paymentMethod === 'cod'}
            onClick={() =>
              setDeliveryDetails({ paymentMethod: 'cod' as PaymentMethod })
            }
            className={cn(
              'flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all min-h-[64px]',
              delivery.paymentMethod === 'cod'
                ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
              <Banknote className="size-5" aria-hidden="true" />
            </div>
            <div>
              <div className="font-semibold text-sm text-foreground">
                Cash on Delivery
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pay cash directly to our rider upon container arrival.
              </p>
            </div>
          </button>

          {/* GCash on Delivery */}
          <button
            type="button"
            role="radio"
            aria-checked={delivery.paymentMethod === 'gcash'}
            onClick={() =>
              setDeliveryDetails({ paymentMethod: 'gcash' as PaymentMethod })
            }
            className={cn(
              'flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all min-h-[64px]',
              delivery.paymentMethod === 'gcash'
                ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
              <QrCode className="size-5" aria-hidden="true" />
            </div>
            <div>
              <div className="font-semibold text-sm text-foreground">
                GCash on Delivery
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Scan the rider&apos;s GCash QR code upon delivery confirmation.
              </p>
            </div>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg">
          <ShieldCheck className="size-4 text-primary shrink-0" aria-hidden="true" />
          <span>Zero pre-payment required. Pay only after your refill containers arrive safely.</span>
        </div>
      </div>
    </div>
  );
}
