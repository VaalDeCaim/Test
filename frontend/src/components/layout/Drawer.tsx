'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, Separator } from '@heroui/react';

const navItems = [
  { href: '/convert', label: 'Convert' },
  { href: '/history', label: 'History' },
  { href: '/topup', label: 'Top Up' },
  { href: '/settings', label: 'Settings' },
];

export function Drawer() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-4 py-3 text-sm font-medium ${
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Separator />
      <div className="space-y-1 p-4">
        <Link href="/settings" className="block">
          <Button variant="ghost" className="w-full justify-start">
            Settings
          </Button>
        </Link>
        <Link href="/auth/logout" className="block">
          <Button variant="danger" className="w-full justify-start">
            Log out
          </Button>
        </Link>
      </div>
    </aside>
  );
}
