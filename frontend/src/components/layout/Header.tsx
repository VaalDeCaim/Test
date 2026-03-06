'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';

export function Header() {
  const { user, isLoading } = useUser();

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
              <Link href="/auth/login">
                <Button variant="primary">Log in</Button>
              </Link>
              <Link href="/auth/login?screen_hint=signup">
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
