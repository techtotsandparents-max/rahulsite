'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function ProjectsNewRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/projects'); }, [router]);
  return null;
}
