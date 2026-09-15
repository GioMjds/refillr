import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/guards';
import {
  canRoleAccessPath,
  getDefaultRouteForRole,
  isSafeReturnPath,
} from '@/lib/auth/routes';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next');

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=oauth-failed`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=oauth-failed`);
  }

  const context = await getAuthContext();
  const role = context?.role ?? 'customer';

  const safeNext =
    rawNext && isSafeReturnPath(rawNext) && canRoleAccessPath(role, rawNext)
      ? rawNext
      : getDefaultRouteForRole(role);

  const destination = new URL(safeNext, origin);
  return NextResponse.redirect(destination);
}
