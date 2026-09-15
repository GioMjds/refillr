import { create } from 'zustand';
import { WATER_CATALOG } from './catalog';
import {
  ContainerId,
  DeliveryDetails,
  OrderItem,
  PurchaseMode,
} from './types';

interface OrderWizardState {
  step: 1 | 2 | 3;
  items: Record<ContainerId, { mode: PurchaseMode; quantity: number }>;
  delivery: DeliveryDetails;
  isSubmitting: boolean;
  submittedOrder: {
    orderId: string;
    trackingNumber: string;
    createdAt: string;
  } | null;

  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  setItemMode: (id: ContainerId, mode: PurchaseMode) => void;
  setItemQuantity: (id: ContainerId, quantity: number) => void;
  incrementQuantity: (id: ContainerId) => void;
  decrementQuantity: (id: ContainerId) => void;
  setDeliveryDetails: (details: Partial<DeliveryDetails>) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setSubmittedOrder: (
    order: { orderId: string; trackingNumber: string; createdAt: string } | null,
  ) => void;
  reset: () => void;

  // Computed calculations
  getSubtotal: () => number;
  getItemCount: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getOrderItems: () => OrderItem[];
}

const DEFAULT_DELIVERY: DeliveryDetails = {
  fullName: '',
  phoneNumber: '',
  address: '',
  notes: '',
  deliveryWindow: 'asap',
  paymentMethod: 'cod',
};

export const useOrderWizardStore = create<OrderWizardState>((set, get) => ({
  step: 1,
  items: {
    'slim-5gal': { mode: 'refill', quantity: 2 },
    'round-5gal': { mode: 'refill', quantity: 1 },
  },
  delivery: DEFAULT_DELIVERY,
  isSubmitting: false,
  submittedOrder: null,

  setStep: (step) => set({ step }),
  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, 3) as 1 | 2 | 3,
    })),
  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1) as 1 | 2 | 3,
    })),

  setItemMode: (id, mode) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: {
          ...state.items[id],
          mode,
        },
      },
    })),

  setItemQuantity: (id, quantity) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: {
          ...state.items[id],
          quantity: Math.max(0, Math.min(99, quantity)),
        },
      },
    })),

  incrementQuantity: (id) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: {
          ...state.items[id],
          quantity: Math.min(99, state.items[id].quantity + 1),
        },
      },
    })),

  decrementQuantity: (id) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: {
          ...state.items[id],
          quantity: Math.max(0, state.items[id].quantity - 1),
        },
      },
    })),

  setDeliveryDetails: (details) =>
    set((state) => ({
      delivery: {
        ...state.delivery,
        ...details,
      },
    })),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  setSubmittedOrder: (submittedOrder) => set({ submittedOrder }),

  reset: () =>
    set({
      step: 1,
      items: {
        'slim-5gal': { mode: 'refill', quantity: 1 },
        'round-5gal': { mode: 'refill', quantity: 0 },
      },
      delivery: DEFAULT_DELIVERY,
      isSubmitting: false,
      submittedOrder: null,
    }),

  getSubtotal: () => {
    const { items } = get();
    return WATER_CATALOG.reduce((acc, catalogItem) => {
      const itemConfig = items[catalogItem.id];
      if (!itemConfig || itemConfig.quantity <= 0) return acc;
      const unitPrice =
        itemConfig.mode === 'refill'
          ? catalogItem.refillPrice
          : catalogItem.newPrice;
      return acc + unitPrice * itemConfig.quantity;
    }, 0);
  },

  getItemCount: () => {
    const { items } = get();
    return Object.values(items).reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  },

  getDeliveryFee: () => {
    // Free delivery for orders of 2 or more containers or total >= 100
    const itemCount = get().getItemCount();
    if (itemCount === 0) return 0;
    return itemCount >= 2 ? 0 : 25;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const deliveryFee = get().getDeliveryFee();
    return subtotal > 0 ? subtotal + deliveryFee : 0;
  },

  getOrderItems: () => {
    const { items } = get();
    return WATER_CATALOG.flatMap((catalogItem) => {
      const itemConfig = items[catalogItem.id];
      if (!itemConfig || itemConfig.quantity <= 0) return [];
      const unitPrice =
        itemConfig.mode === 'refill'
          ? catalogItem.refillPrice
          : catalogItem.newPrice;
      return [
        {
          containerId: catalogItem.id,
          mode: itemConfig.mode,
          quantity: itemConfig.quantity,
          unitPrice,
        },
      ];
    });
  },
}));
