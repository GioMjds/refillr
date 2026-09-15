import { describe, it, expect, beforeEach } from 'vitest';
import { useOrderWizardStore } from './store';

describe('useOrderWizardStore', () => {
  beforeEach(() => {
    useOrderWizardStore.getState().reset();
  });

  it('initializes with default items and calculations', () => {
    const store = useOrderWizardStore.getState();
    expect(store.step).toBe(1);
    expect(store.getItemCount()).toBe(1);
    expect(store.getSubtotal()).toBe(35); // 1 slim refill
    expect(store.getDeliveryFee()).toBe(25); // 1 container has 25 delivery fee
    expect(store.getTotal()).toBe(60);
  });

  it('updates quantity and recalculates delivery fee for 2+ containers', () => {
    const store = useOrderWizardStore.getState();
    store.setItemQuantity('slim-5gal', 2);

    expect(store.getItemCount()).toBe(2);
    expect(store.getSubtotal()).toBe(70);
    expect(store.getDeliveryFee()).toBe(0); // 2+ containers is free delivery
    expect(store.getTotal()).toBe(70);
  });

  it('adjusts price when changing mode from refill to new container', () => {
    const store = useOrderWizardStore.getState();
    store.setItemQuantity('slim-5gal', 1);
    store.setItemMode('slim-5gal', 'new');

    expect(store.getSubtotal()).toBe(250); // new bottle price
    expect(store.getTotal()).toBe(275); // 250 + 25
  });

  it('advances and steps back through wizard stages', () => {
    const store = useOrderWizardStore.getState();
    expect(store.step).toBe(1);

    store.nextStep();
    expect(useOrderWizardStore.getState().step).toBe(2);

    store.nextStep();
    expect(useOrderWizardStore.getState().step).toBe(3);

    // Cannot advance past 3
    store.nextStep();
    expect(useOrderWizardStore.getState().step).toBe(3);

    store.prevStep();
    expect(useOrderWizardStore.getState().step).toBe(2);
  });
});
