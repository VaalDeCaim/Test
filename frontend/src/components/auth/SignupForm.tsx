"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Input, Checkbox } from "@heroui/react";
import { setDevUserCookie } from "@/lib/auth-config";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

const labelClass = "text-xs font-medium text-default-700";

export function SignupForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
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
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                name="name"
                type="text"
                label="Full name"
                autoComplete="name"
                placeholder="Ada Lovelace"
                labelPlacement="outside"
                classNames={{ label: labelClass }}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
          />
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
                autoComplete="new-password"
                placeholder="••••••••"
                labelPlacement="outside"
                classNames={{ label: labelClass }}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                name="confirmPassword"
                type="password"
                label="Confirm password"
                autoComplete="new-password"
                placeholder="••••••••"
                labelPlacement="outside"
                classNames={{ label: labelClass }}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Checkbox
                  name="terms"
                  isSelected={!!field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  classNames={{
                    label: "text-[11px] text-default-600",
                  }}
                  isInvalid={!!errors.terms}
                >
                  I agree to the terms and understand this is a demo environment.
                </Checkbox>
                {errors.terms?.message ? (
                  <p className="text-xs text-danger">{errors.terms.message}</p>
                ) : null}
              </div>
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
              {isSubmitting ? "Creating account…" : "Create account"}
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
            <span>Already have an account?</span>
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
