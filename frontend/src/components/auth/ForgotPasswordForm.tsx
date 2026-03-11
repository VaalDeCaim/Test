"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

const labelClass = "text-xs font-medium text-default-700";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card shadow="sm" className="border border-default-200">
        <CardBody className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="size-6 text-success-600" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-default-600">
              If an account exists for{" "}
              <span className="font-medium text-foreground">
                {email || "that address"}
              </span>
              , we&apos;ve sent a link to reset your password.
            </p>
            <p className="mt-3 text-xs text-default-500">
              Didn&apos;t get it? Check spam or{" "}
              <Button
                as="button"
                type="button"
                variant="light"
                className="min-w-0 font-medium text-foreground"
                onPress={() => setSubmitted(false)}
              >
                try again
              </Button>
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="button"
              color="primary"
              className="w-full gap-2"
              startContent={<ArrowLeft className="size-4" aria-hidden />}
              onPress={() => router.push("/login")}
            >
              Back to log in
            </Button>
            <Link
              href="/signup"
              className="text-center text-xs text-default-500 hover:text-foreground"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                placeholder="you@company.com"
                labelPlacement="outside"
                description="Enter the email you use to sign in. We'll send a reset link if the account exists."
                startContent={<Mail className="size-4 text-default-400" aria-hidden />}
                classNames={{ label: labelClass }}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send reset link"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full gap-2 text-xs"
              startContent={<ArrowLeft className="size-4" aria-hidden />}
              onPress={() => router.push("/login")}
            >
              Back to log in
            </Button>
          </div>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-x-1 text-center text-xs text-default-500">
            <span>Remember your password?</span>
            <Button
              as="button"
              type="button"
              variant="light"
              className="min-w-0 px-1 font-medium text-foreground"
              onPress={() => router.push("/login")}
            >
              Log in
            </Button>
          </p>
        </form>
      </CardBody>
    </Card>
  );
}
