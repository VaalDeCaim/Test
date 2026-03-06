'use client';

import useSWR from 'swr';
import { useUser } from '@auth0/nextjs-auth0/client';

const isDevBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';

async function fetchDevSession() {
  const res = await fetch('/api/auth/dev-session');
  if (res.status === 204) return null;
  return res.json();
}

export function useAuth() {
  const auth0 = useUser();
  const { data: devUser, isLoading: devLoading, mutate: devMutate } = useSWR(
    isDevBypass ? '/api/auth/dev-session' : null,
    fetchDevSession
  );

  if (isDevBypass) {
    return {
      user: devUser ?? null,
      isLoading: devLoading,
      loginUrl: '/auth/dev-login',
      logoutUrl: '/api/auth/dev-logout',
      isDevBypass: true,
    };
  }

  return {
    user: auth0.user ?? null,
    isLoading: auth0.isLoading,
    loginUrl: '/auth/login',
    logoutUrl: '/auth/logout',
    isDevBypass: false,
  };
}
