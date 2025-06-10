
"use client";

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { user, admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || admin) { // Redirect if not a student or if an admin is logged in
        router.replace('/login');
      }
    }
  }, [user, admin, loading, router]);

  if (loading || !user || admin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <div className="container mx-auto px-4 py-8">{children}</div>;
}
