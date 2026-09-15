import 'server-only';

import { redirect } from 'next/navigation';

import type { AppRole } from '@/lib/auth/routes';
import { createClient } from '@/lib/supabase/server';

export type AuthContext = { userId: string; role: AppRole };

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims.sub;

  if (!userId) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile) return null;
  return { userId, role: profile.role };
}

export async function requireRole(requiredRole: 'staff' | 'admin') {
  const context = await getAuthContext();
  if (!context) redirect('/sign-in');
  if (context.role !== requiredRole) redirect('/access-denied');
  return context;
}

export async function ensureAnonymousCustomer(): Promise<string> {
  const current = await getAuthContext();
  if (current) {
    if (current.role !== 'customer')
      throw new Error('Customer identity required');
    return current.userId;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user)
    throw new Error('Unable to create customer identity');
  return data.user.id;
}
