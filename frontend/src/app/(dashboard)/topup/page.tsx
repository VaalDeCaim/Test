'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Spinner } from '@heroui/react';
import { api } from '@/lib/api';


export default function TopUpPage() {
  const [pricing, setPricing] = useState<Awaited<ReturnType<typeof api.getPricing>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPricing().then(setPricing).finally(() => setLoading(false));
  }, []);

  const handleTopUp = async (packageId: string) => {
    try {
      const res = await fetch('/api/auth/token');
      const { accessToken } = await res.json();
      const baseUrl = window.location.origin;
      const { url } = await api.topUp(accessToken, {
        packageId,
        successUrl: `${baseUrl}/topup?success=1`,
        cancelUrl: `${baseUrl}/topup`,
      });
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  };

  const handlePro = async () => {
    try {
      const res = await fetch('/api/auth/token');
      const { accessToken } = await res.json();
      const baseUrl = window.location.origin;
      const { url } = await api.proCheckout(accessToken, {
        successUrl: `${baseUrl}/settings?success=1`,
        cancelUrl: `${baseUrl}/topup`,
      });
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl space-y-8 p-8">
      <h1 className="text-2xl font-bold">Top Up & Subscription</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Coin Packages</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricing?.coinPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{pkg.coins} coins</p>
                  <p className="text-sm text-muted-foreground">${pkg.priceUsd}</p>
                </div>
                <Button variant="primary" onPress={() => handleTopUp(pkg.id)}>
                  Buy
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Pro Subscription</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricing?.proSubscription ? (
              <>
                <p className="text-muted-foreground">
                  Unlimited conversions. ${pricing.proSubscription.priceUsd}/{pricing.proSubscription.interval}.
                </p>
                <Button variant="primary" onPress={handlePro}>
                  Subscribe to Pro
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">Pro subscription coming soon.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
