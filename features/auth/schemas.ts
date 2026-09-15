import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(120, 'Display name must be 120 characters or fewer.')
    .optional()
    .or(z.literal('')),
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must contain at least 6 characters'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;