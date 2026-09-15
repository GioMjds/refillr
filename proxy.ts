import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getRequiredRole } from '@/lib/auth/routes';
import { refreshSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  const { response, userId } = await refreshSession(request);
  const requiredRole = getRequiredRole(request.nextUrl.pathname);

  if (requiredRole && !userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set(
      'next',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    const redirectResponse = NextResponse.redirect(signInUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icon-.*\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
