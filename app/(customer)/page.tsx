import type { Metadata } from 'next';
import Link from 'next/link';
import { Droplet, Truck, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

import { PageIntro } from '@/components/page-intro';
import { SlimBottleIcon, RoundBottleIcon } from '@/features/orders/components/bottle-icons';
import { OrderLookupForm } from '@/features/orders/components/order-lookup-form';

export const metadata: Metadata = {
  title: 'Pure Water Refills & Delivery',
  description:
    'Fast local 5-gallon water refills and dispenser bottle delivery dispatched in under 60 minutes.',
};

export default function HomePage() {
  return (
    <div className="py-6 sm:py-10 space-y-10 sm:space-y-14">
      {/* Hero Section */}
      <section aria-labelledby="hero-title">
        <PageIntro
          badge={
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/60 border border-border/80 px-3 py-1 text-xs font-semibold text-accent-foreground">
              <span
                className="size-2 rounded-full bg-primary"
                aria-hidden="true"
              />
              <span>Station Open · Dispatching in ~45–60m · 8:00 AM – 6:00 PM</span>
            </div>
          }
          title="Pure water refills, delivered fast."
          description="Standard 5-gallon carboys and dispenser refills delivered straight to your door with zero required registration."
        >
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/order"
              className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-xs transition-all hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Droplet className="size-4 fill-current" aria-hidden="true" />
              <span>Order water now</span>
            </Link>
            <a
              href="#track-section"
              className="h-12 px-6 rounded-lg border border-border bg-card text-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>Track existing order</span>
            </a>
          </div>
        </PageIntro>
      </section>

      {/* Operational Highlights Strip */}
      <section
        aria-label="Service guarantees"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
      >
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <Truck className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Free delivery</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available on any order of 2 or more containers.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <Zap className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Fast fulfillment</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Average dispatch in 45–60 minutes to your neighborhood.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Pay on arrival</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              No prepay needed. Cash or GCash accepted upon drop-off.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Preview Section */}
      <section aria-labelledby="catalog-preview-title" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-border pb-3">
          <h2
            id="catalog-preview-title"
            className="text-lg sm:text-xl font-bold text-foreground"
          >
            Available containers
          </h2>
          <span className="text-xs text-muted-foreground">
            Refill your existing bottle or purchase a new container
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 5-Gallon Slim Dispenser */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted/60 p-2">
                <SlimBottleIcon className="h-full w-auto" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground">
                    5-Gallon Slim Dispenser
                  </h3>
                  <span className="inline-flex rounded-full bg-accent/60 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                    ₱35 refill
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Narrow countertop footprint with built-in front dispensing spigot.
                  New bottle: ₱250.
                </p>
              </div>
            </div>

            <Link
              href="/order"
              className="w-full h-10 rounded-lg border border-border bg-card text-foreground font-semibold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>Configure slim order</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* 5-Gallon Round Dispenser */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted/60 p-2">
                <RoundBottleIcon className="h-full w-auto" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground">
                    5-Gallon Round Dispenser
                  </h3>
                  <span className="inline-flex rounded-full bg-accent/60 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                    ₱40 refill
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Standard ribbed carboy bottle designed for inverted water cooler dispensers.
                  New bottle: ₱260.
                </p>
              </div>
            </div>

            <Link
              href="/order"
              className="w-full h-10 rounded-lg border border-border bg-card text-foreground font-semibold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>Configure round order</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Direct Order Tracking Lookup Card */}
      <section
        id="track-section"
        aria-labelledby="track-section-title"
        className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs scroll-mt-20"
      >
        <div className="max-w-md space-y-3">
          <div>
            <h2
              id="track-section-title"
              className="text-base sm:text-lg font-bold text-foreground"
            >
              Track an existing order
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Have an order reference from an earlier request or receipt? Look up its live dispatch status.
            </p>
          </div>

          <OrderLookupForm />
        </div>
      </section>
    </div>
  );
}
