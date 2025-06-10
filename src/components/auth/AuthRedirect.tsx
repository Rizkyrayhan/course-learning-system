
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const AuthRedirect = () => {
  const { user, admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (admin) {
        router.replace('/admin/dashboard');
      } else if (user) {
        router.replace('/student/dashboard');
      }
    }
  }, [user, admin, loading, router]);

  return null; // This component does not render anything
};

export default AuthRedirect;
