import { z } from 'zod';

export const deliveryDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters.'),
  phoneNumber: z
    .string()
    .trim()
    .min(10, 'Enter a valid mobile number (e.g. 09171234567).')
    .regex(
      /^(09|\+?639)\d{9}$/,
      'Please provide a valid 11-digit mobile number (e.g. 09123456789).',
    ),
  address: z
    .string()
    .trim()
    .min(5, 'Please enter a complete street address, house/unit number, and barangay.'),
  notes: z.string().trim().optional(),
  deliveryWindow: z.enum(['asap', 'today_pm', 'tomorrow_am'], {
    error: 'Please select a delivery window.',
  }),
  paymentMethod: z.enum(['cod', 'gcash'], {
    error: 'Please select a payment method.',
  }),
});

export type DeliveryDetailsFormData = z.infer<typeof deliveryDetailsSchema>;
