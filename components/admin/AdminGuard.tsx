'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, data: session } = useSession();
  const isAdmin = Boolean(session?.user?.isAdmin);

  useEffect(() => {
    if (status !== 'loading' && !isAdmin) {
      router.replace('/admin');
    }
  }, [isAdmin, pathname, router, status]);

  if (status === 'loading' || !isAdmin) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#060d1f', color: '#A78BFA',
      }}>
        <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}

// Legacy helper retained for compatibility with older admin pages.
export function getAdminToken(): string {
  return '';
}
