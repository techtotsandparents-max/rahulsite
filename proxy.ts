import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ────────────────────────────────────────────────────
// Middleware — RahulTripathi.dev
// Guards /admin/* pages and /api/admin/* API routes.
// Injects security headers on every response.
// ────────────────────────────────────────────────────

const PUBLIC_ADMIN_PATHS = ['/admin'];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.includes(pathname);
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=()'
  );
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin pages (except the login page itself) ──
  if (pathname.startsWith('/admin') && !isPublicAdminPath(pathname)) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.isAdmin) {
      const signInUrl = new URL('/admin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return addSecurityHeaders(NextResponse.redirect(signInUrl));
    }
  }

  // ── Admin API routes ──
  if (pathname.startsWith('/api/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.isAdmin) {
      return addSecurityHeaders(
        NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
      );
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
