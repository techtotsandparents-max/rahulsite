import type { Session } from 'next-auth';
import { z } from 'zod';

const identitiesSchema = z.array(z.object({
  provider_name: z.string(),
  user_id: z.string(),
  user_claims: z.array(z.object({ typ: z.string(), val: z.string() })),
}));

export function isAdminEmail(email?: string | null) {
  const allowedEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowedEmails.includes((email ?? '').trim().toLowerCase());
}

export async function getEasyAuthSession(requestHeaders: Pick<Headers, 'get'>): Promise<Session | null> {
  const hostname = process.env.WEBSITE_HOSTNAME;
  const cookie = requestHeaders.get('cookie');
  if (!hostname || !cookie || !cookie.includes('AppServiceAuthSession=')) return null;

  try {
    const response = await fetch(`https://${hostname}/.auth/me`, {
      headers: { cookie },
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const identities = identitiesSchema.parse(await response.json());
    const identity = identities.find((value) => value.provider_name === 'aad');
    if (!identity) return null;

    const claims = new Map(identity.user_claims.map(({ typ, val }) => [typ, val]));
    const email = (
      claims.get('email') ||
      claims.get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress') ||
      claims.get('preferred_username') ||
      claims.get('upn') ||
      claims.get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn') ||
      identity.user_id
    ).trim().toLowerCase();

    return {
      user: {
        email,
        name: claims.get('name') || email,
        isAdmin: isAdminEmail(email),
      },
      authProvider: 'easy-auth',
      expires: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}