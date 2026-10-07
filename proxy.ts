import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getEasyAuthSession } from '@/lib/azure/easy-auth';

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
  const isProtectedPage = pathname.startsWith('/admin') && !isPublicAdminPath(pathname);
  const isAdminApi = pathname.startsWith('/api/admin');
  const easyAuthSession = isProtectedPage || isAdminApi
    ? await getEasyAuthSession(request.headers)
    : null;
  const token = !easyAuthSession && (isProtectedPage || isAdminApi)
    ? await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    : null;
  const isAdmin = easyAuthSession ? easyAuthSession.user?.isAdmin : token?.isAdmin;

  // ── Admin pages (except the login page itself) ──
  if (isProtectedPage) {
    if (!isAdmin) {
      const signInUrl = new URL('/admin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      if (easyAuthSession) signInUrl.searchParams.set('error', 'AccessDenied');
      return addSecurityHeaders(NextResponse.redirect(signInUrl));
    }
    if (pathname === '/admin/dashboard') {
      return addSecurityHeaders(NextResponse.redirect(new URL('/blog', request.url)));
    }
  }

  // ── Admin API routes ──
  if (isAdminApi) {
    if (!isAdmin) {
      return addSecurityHeaders(
        NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
      );
    }
    if (easyAuthSession && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.headers.get('origin');
      const allowedOrigins = [`https://${process.env.WEBSITE_HOSTNAME}`];
      if (process.env.NEXTAUTH_URL) allowedOrigins.push(new URL(process.env.NEXTAUTH_URL).origin);
      if (!origin || !allowedOrigins.includes(origin)) {
        return addSecurityHeaders(
          NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
        );
      }
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
