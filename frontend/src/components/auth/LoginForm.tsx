"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { setDevUserCookie } from "@/lib/auth-config";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

const labelClass = "text-xs font-medium text-default-700";

export function LoginForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = () => {
    setDevUserCookie();
    router.push("/dashboard");
  };

  const handleDevContinue = () => {
    setDevUserCookie();
    router.push("/dashboard");
  };

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
                classNames={{ label: labelClass }}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <div className="space-y-1">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  labelPlacement="outside"
                  classNames={{ label: labelClass }}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <div className="flex justify-end">
              <Button
                as="button"
                type="button"
                variant="light"
                size="sm"
                className="min-w-0 px-0 text-xs font-medium text-default-500"
                onPress={() => router.push("/forgot-password")}
              >
                Forgot password?
              </Button>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Logging in…" : "Log in"}
            </Button>
            <Button
              type="button"
              variant="bordered"
              className="w-full text-xs"
              onPress={handleDevContinue}
            >
              Continue in dev mode
            </Button>
          </div>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-x-1 text-center text-xs text-default-500">
            <span>Don&apos;t have an account?</span>
            <Button
              as="button"
              type="button"
              variant="light"
              className="min-w-0 px-1 font-medium text-foreground"
              onPress={() => router.push("/signup")}
            >
              Sign up
            </Button>
          </p>
        </form>
      </CardBody>
    </Card>
  );
}
