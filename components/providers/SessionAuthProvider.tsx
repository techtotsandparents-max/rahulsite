'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface SessionAuthProviderProps {
  children: ReactNode;
}

export default function SessionAuthProvider({ children }: SessionAuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
