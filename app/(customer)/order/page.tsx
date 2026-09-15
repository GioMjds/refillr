import type { Metadata } from 'next';
import { OrderWizard } from '@/features/orders/components/order-wizard';

export const metadata: Metadata = {
  title: 'Order Water',
  description: 'Order fast local water refills and deliveries in under a minute.',
};

export default function OrderPage() {
  return <OrderWizard />;
}
