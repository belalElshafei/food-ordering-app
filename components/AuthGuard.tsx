'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { data: session, status } = useSession();
  const { isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = !!session || isLoggedIn;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status === 'loading') return;
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
    }
  }, [isAuthenticated, status, router, locale, mounted]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-terracotta-500/30 border-t-terracotta-500 rounded-full animate-spin" />
          <p className="text-charcoal-400 font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
