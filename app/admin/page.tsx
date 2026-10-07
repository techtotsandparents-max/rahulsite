import { redirect } from 'next/navigation';
import { authProviderAvailability, getAdminSession } from '@/lib/auth';
import AdminLoginCard from '@/components/admin/AdminLoginCard';

interface AdminLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await getAdminSession();
  if (session?.user?.isAdmin) {
    redirect('/blog');
  }

  const params = await searchParams;
  const callbackParam = params.callbackUrl;
  const callbackUrl = typeof callbackParam === 'string' && /^\/(blog|travel|adventure|projects|about|youtube)(\/[a-z0-9-]+)?$/i.test(callbackParam)
    ? callbackParam
    : '/blog';
  // Only show access-denied error when it's a real OAuth rejection (not an undefined stale redirect).
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const hasAccessError = errorParam === 'AccessDenied' || Boolean(session && !session.user?.isAdmin);

  return (
    <AdminLoginCard
      callbackUrl={callbackUrl}
      hasAccessError={hasAccessError}
      useEasyAuth={Boolean(process.env.WEBSITE_HOSTNAME)}
      providerAvailability={authProviderAvailability}
    />
  );
}
