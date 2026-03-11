"use client";

import { User } from "lucide-react";
import { useMe } from "@/lib/queries";
import { Card, CardHeader, CardBody, Spinner, Alert } from "@heroui/react";

export default function SettingsPage() {
  const { data: profile, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Spinner size="lg" color="default" label="Loading profile…" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Alert
        color="danger"
        title="Error"
        description="Failed to load profile."
        className="max-w-xl"
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-default-600">
          Your account details.
        </p>
      </div>

      <Card className="border border-default-200">
        <CardHeader className="flex items-center gap-2">
          <User className="h-4 w-4 text-default-500" />
          <span className="text-sm font-semibold uppercase tracking-wider text-default-500">
            Profile
          </span>
        </CardHeader>
        <CardBody className="pt-0">
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-default-500">Name</dt>
              <dd className="font-medium text-foreground">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-default-500">Email</dt>
              <dd className="font-medium text-foreground">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-default-500">Balance</dt>
              <dd className="font-medium text-foreground">{profile.balance} coins</dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
