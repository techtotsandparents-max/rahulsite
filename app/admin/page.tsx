import { redirect } from 'next/navigation';
import { authProviderAvailability, getAdminSession } from '@/lib/auth';
import AdminLoginCard from '@/components/admin/AdminLoginCard';

interface AdminLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await getAdminSession();
  if (session?.user?.isAdmin) {
    redirect('/admin/dashboard');
  }

  const params = await searchParams;
  const callbackParam = params.callbackUrl;
  const callbackUrl = typeof callbackParam === 'string' ? callbackParam : '/admin/dashboard';
  // Only show access-denied error when it's a real OAuth rejection (not an undefined stale redirect).
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const hasAccessError = errorParam === 'AccessDenied';

  return (
    <AdminLoginCard
      callbackUrl={callbackUrl}
      hasAccessError={hasAccessError}
      providerAvailability={authProviderAvailability}
    />
  );
}
