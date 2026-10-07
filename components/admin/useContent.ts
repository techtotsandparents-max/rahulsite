'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ContentRecord, ContentType } from '@/lib/content';

export function useContent<T extends object>(type: ContentType, initial: T[]) {
  const { data: session, status } = useSession();
  const isAdmin = Boolean(session?.user?.isAdmin);
  const [items, setItems] = useState<(T & ContentRecord)[]>(initial);
  const [source, setSource] = useState('loading');
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (status === 'loading') return;
    const controller = new AbortController();
    async function load() {
      try {
        const endpoint = isAdmin ? '/api/admin/data/' : '/api/content/';
        const response = await fetch(`${endpoint}${type}`, { signal: controller.signal, cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error || 'Unable to load content.');
        setItems(payload.data);
        setSource(payload.source);
        setError('');
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : 'Unable to load content.');
      }
    }
    void load();
    return () => controller.abort();
  }, [type, isAdmin, status, revision]);

  return { items: isAdmin ? items : items.filter((item) => item.isPublished !== false), source, error, isAdmin, loading: !error && (status === 'loading' || source === 'loading'), reload: () => setRevision((value) => value + 1) };
}