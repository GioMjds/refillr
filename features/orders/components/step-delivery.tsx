'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, MapPin, Phone, User, FileText } from 'lucide-react';
import { deliveryDetailsSchema, DeliveryDetailsFormData } from '../schemas';
import { useOrderWizardStore } from '../store';
import { DELIVERY_WINDOWS } from '../catalog';
import { DeliveryWindow } from '../types';
import { cn } from 'cn';

interface StepDeliveryProps {
  onValidSubmit?: () => void;
}

export function StepDelivery({ onValidSubmit }: StepDeliveryProps) {
  const { delivery, setDeliveryDetails, nextStep } = useOrderWizardStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeliveryDetailsFormData>({
    resolver: zodResolver(deliveryDetailsSchema),
    defaultValues: delivery,
    mode: 'onBlur',
  });

  const selectedWindow = watch('deliveryWindow');

  const onSubmit = (data: DeliveryDetailsFormData) => {
    setDeliveryDetails(data);
    if (onValidSubmit) {
      onValidSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <form
      id="delivery-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Delivery details
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Where should the station delivery staff drop off your fresh water?
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <User
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. Maria Santos"
              {...register('fullName')}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={cn(
                'w-full h-12 pl-10 pr-4 rounded-lg border bg-card text-foreground text-sm transition-colors',
                'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
                errors.fullName ? 'border-destructive ring-destructive/20' : 'border-border',
              )}
            />
          </div>
          {errors.fullName && (
            <p id="fullName-error" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Mobile Number
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="0917 123 4567"
              {...register('phoneNumber')}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
              className={cn(
                'w-full h-12 pl-10 pr-4 rounded-lg border bg-card text-foreground text-sm transition-colors',
                'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
                errors.phoneNumber ? 'border-destructive ring-destructive/20' : 'border-border',
              )}
            />
          </div>
          {errors.phoneNumber && (
            <p id="phoneNumber-error" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Complete Street Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Street Address / House &amp; Barangay
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3.5 top-3 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <textarea
              id="address"
              rows={3}
              autoComplete="street-address"
              placeholder="House/Unit #, Street, Subdivision, and Barangay"
              {...register('address')}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'address-error' : undefined}
              className={cn(
                'w-full py-2.5 pl-10 pr-4 rounded-lg border bg-card text-foreground text-sm transition-colors resize-none',
                'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
                errors.address ? 'border-destructive ring-destructive/20' : 'border-border',
              )}
            />
          </div>
          {errors.address && (
            <p id="address-error" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Delivery Schedule selector */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Delivery Schedule
          </label>
          <div
            role="radiogroup"
            aria-label="Delivery Schedule"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
          >
            {DELIVERY_WINDOWS.map((window) => {
              const isSelected = selectedWindow === window.id;
              return (
                <button
                  key={window.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() =>
                    setValue('deliveryWindow', window.id as DeliveryWindow, {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    'flex flex-col items-start p-3 rounded-lg border text-left transition-all min-h-[56px]',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground',
                  )}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                    <Clock className="size-3.5 text-primary" aria-hidden="true" />
                    <span>{window.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {window.description}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.deliveryWindow && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.deliveryWindow.message}
            </p>
          )}
        </div>

        {/* Delivery Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Special Instructions <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <FileText
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="notes"
              type="text"
              placeholder="e.g. Leave empty bottles by front gate, ring bell twice"
              {...register('notes')}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
