'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, Spinner } from '@heroui/react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<{ balance?: { coins: number }; subscription?: { plan?: string } } | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/auth/token');
      const { accessToken } = await res.json();
      if (accessToken) {
        api.getMe(accessToken).then((p) => setProfile(p as { balance?: { coins: number }; subscription?: { plan?: string } })).catch(() => {});
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl space-y-8 p-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Profile</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Name:</strong> {user?.name}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Balance</h2>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{profile?.balance?.coins ?? 0} coins</p>
          <a href="/topup" className="text-sm text-primary underline">Top up</a>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Subscription</h2>
        </CardHeader>
        <CardContent>
          <p>Plan: {profile?.subscription?.plan ?? 'free'}</p>
          {profile?.subscription?.plan !== 'pro' && (
            <a href="/topup" className="text-sm text-primary underline">Upgrade to Pro</a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
