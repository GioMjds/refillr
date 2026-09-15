export type ContainerId = 'slim-5gal' | 'round-5gal';
export type PurchaseMode = 'refill' | 'new';
export type DeliveryWindow = 'asap' | 'today_pm' | 'tomorrow_am';
export type PaymentMethod = 'cod' | 'gcash';

export interface CatalogItem {
  id: ContainerId;
  name: string;
  description: string;
  volume: string;
  refillPrice: number;
  newPrice: number;
}

export interface OrderItem {
  containerId: ContainerId;
  mode: PurchaseMode;
  quantity: number;
  unitPrice: number;
}

export interface DeliveryDetails {
  fullName: string;
  phoneNumber: string;
  address: string;
  notes?: string;
  deliveryWindow: DeliveryWindow;
  paymentMethod: PaymentMethod;
}

export interface OrderSubmissionPayload {
  items: OrderItem[];
  delivery: DeliveryDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface OrderSubmissionResult {
  success: boolean;
  orderId?: string;
  trackingNumber?: string;
  error?: string;
}
