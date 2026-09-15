'use server';

import { redirect } from 'next/navigation';

import { signInSchema } from '@/features/auth/schemas';
import { getAuthContext } from '@/lib/auth/guards';
import {
  canRoleAccessPath,
  getDefaultRouteForRole,
  isSafeReturnPath,
} from '@/lib/auth/routes';
import { createClient } from '@/lib/supabase/server';

export type SignInState = {
  status: 'idle' | 'error';
  message: string;
  fieldErrors?: Partial<Record<'email' | 'password', string[]>>;
};

export async function signInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const rawEmail = formData.get('email');
  const rawPassword = formData.get('password');
  const rawNext = formData.get('next');

  const parsed = signInSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please correct the errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      status: 'error',
      message: 'Check your email and password and try again.',
    };
  }

  const context = await getAuthContext();
  if (!context || context.role === 'customer') {
    await supabase.auth.signOut();
    return {
      status: 'error',
      message: 'Check your email and password and try again.',
    };
  }

  const next =
    typeof rawNext === 'string' && isSafeReturnPath(rawNext) ? rawNext : null;
  const destination =
    next && canRoleAccessPath(context.role, next)
      ? next
      : getDefaultRouteForRole(context.role);

  redirect(destination);
}
