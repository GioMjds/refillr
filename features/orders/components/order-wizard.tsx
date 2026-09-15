'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useOrderWizardStore } from '../store';
import { StepIndicator } from './step-indicator';
import { StepContainers } from './step-containers';
import { StepDelivery } from './step-delivery';
import { StepReview } from './step-review';
import { OrderSummaryBar } from './order-summary-bar';
import { OrderSuccessView } from './order-success-view';
import { submitOrderAction } from '../actions';

export function OrderWizard() {
  const {
    step,
    setStep,
    delivery,
    submittedOrder,
    setSubmittedOrder,
    setIsSubmitting,
    getOrderItems,
    getSubtotal,
    getDeliveryFee,
    getTotal,
  } = useOrderWizardStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const items = getOrderItems();
      const subtotal = getSubtotal();
      const deliveryFee = getDeliveryFee();
      const total = getTotal();

      const result = await submitOrderAction({
        items,
        delivery,
        subtotal,
        deliveryFee,
        total,
      });

      if (result.success && result.orderId && result.trackingNumber) {
        setSubmittedOrder({
          orderId: result.orderId,
          trackingNumber: result.trackingNumber,
          createdAt: new Date().toISOString(),
        });
      } else {
        setErrorMessage(
          result.error ?? 'Unable to process your order. Please try again.',
        );
      }
    } catch {
      setErrorMessage(
        'A network error occurred while submitting your order. Please check your connection.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrder) {
    return <OrderSuccessView order={submittedOrder} />;
  }

  return (
    <div className="max-w-2xl mx-auto pb-32 sm:pb-28 pt-2 sm:pt-4">
      {/* Step Progress Navigation */}
      <div className="mb-6 sm:mb-8">
        <StepIndicator currentStep={step} onStepClick={(s) => setStep(s)} />
      </div>

      {/* Submission Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-start gap-3"
        >
          <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <span className="font-semibold block">Order submission failed</span>
            <span className="text-xs text-destructive/90">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Active Step Surface */}
      <div className="animate-in fade-in-50 duration-200">
        {step === 1 && <StepContainers />}
        {step === 2 && <StepDelivery />}
        {step === 3 && <StepReview />}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <OrderSummaryBar onConfirmOrder={handleConfirmOrder} />
    </div>
  );
}
