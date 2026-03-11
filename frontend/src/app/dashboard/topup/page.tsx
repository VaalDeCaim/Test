"use client";

import { Coins } from "lucide-react";
import { usePricing } from "@/lib/queries";
import { Button, Card, CardBody, Spinner, Alert } from "@heroui/react";

export default function TopUpPage() {
  const { data: packages, isLoading, error } = usePricing();

  const handleTopUp = (packageId: string) => {
    // Mock: would POST /users/topup and redirect to Stripe
    window.alert(`Mock: Redirect to Stripe checkout for package ${packageId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Spinner size="lg" color="default" label="Loading pricing…" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        color="danger"
        title="Error"
        description="Failed to load pricing."
        className="max-w-xl"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">Top Up</h1>
        <p className="mt-1 text-sm text-default-600">
          Buy coin packages to run conversions. Success/cancel return URLs are handled by the app.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {packages?.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative overflow-visible border ${
              pkg.popular
                ? "border-foreground bg-default-50"
                : "border-default-200"
            }`}
          >
            {pkg.popular && (
              <span className="absolute right-4 top-3 z-10 rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background">
                Popular
              </span>
            )}
            <CardBody className="gap-0">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-warning-500" />
                <span className="font-semibold text-foreground">{pkg.name}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                ${(pkg.priceCents / 100).toFixed(2)}
              </p>
              <p className="text-sm text-default-600">
                {pkg.coins} coins
              </p>
              <Button
                className="mt-4 w-full"
                color={pkg.popular ? "primary" : "default"}
                variant={pkg.popular ? "solid" : "bordered"}
                onPress={() => handleTopUp(pkg.id)}
              >
                Buy
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
