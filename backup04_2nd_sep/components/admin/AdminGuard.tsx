'use client';

import { useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  const verify = useCallback(() => {
    const token = sessionStorage.getItem('admin-token');
    if (!token) {
      router.replace('/admin');
    } else {
      setChecked(true);
    }
  }, [router]);

  useEffect(() => {
    verify();
  }, [pathname, verify]);

  if (!checked) {
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

// Helper to get stored token for API calls
export function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin-token') || '';
}
