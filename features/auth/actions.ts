'use server';

import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { signInSchema, signUpSchema } from '@/features/auth/schemas';
import { getAuthContext } from '@/lib/auth/guards';
import {
  canRoleAccessPath,
  getDefaultRouteForRole,
  isSafeReturnPath,
} from '@/lib/auth/routes';
import { createClient } from '@/lib/supabase/server';

export type AuthFormState = {
  status: 'idle' | 'error';
  message: string;
  fieldErrors?: Partial<Record<'email' | 'password', string[]>>;
};

export type SignInState = AuthFormState;
export type SignUpState = AuthFormState;

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
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

  redirect(destination as Route);
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawDisplayName = formData.get('displayName');
  const rawEmail = formData.get('email');
  const rawPassword = formData.get('password');
  const rawNext = formData.get('next');

  const parsed = signUpSchema.safeParse({
    displayName: rawDisplayName,
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
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        displayName: parsed.data.displayName || null,
      },
    },
  });

  if (error) {
    return {
      status: 'error',
      message: error.message || 'Unable to create account. Please try again.',
    };
  }

  const context = await getAuthContext();
  const role = context?.role || 'customer';
  const next =
    typeof rawNext === 'string' && isSafeReturnPath(rawNext) ? rawNext : null;
  const destination =
    next && canRoleAccessPath(role, next) ? next : getDefaultRouteForRole(role);

  redirect(destination as Route);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/sign-in' as Route);
}
