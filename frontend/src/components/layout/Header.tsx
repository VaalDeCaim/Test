'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, isLoading, loginUrl } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          StatementFlow
        </Link>
        <nav className="flex items-center gap-4">
          {!user && (
            <>
              <a href="#features" className="text-sm font-medium hover:underline">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:underline">
                Pricing
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:underline">
                How it works
              </a>
              <a href="#faq" className="text-sm font-medium hover:underline">
                FAQ
              </a>
              <Link href={loginUrl}>
                <Button variant="primary">Log in</Button>
              </Link>
              <Link href={loginUrl === '/auth/dev-login' ? loginUrl : `${loginUrl}?screen_hint=signup`}>
                <Button variant="primary">Create account</Button>
              </Link>
            </>
          )}
          {user && (
            <Link href="/convert">
              <Button variant="primary">Dashboard</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
