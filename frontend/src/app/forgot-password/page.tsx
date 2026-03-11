import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordLeftPanel } from "@/components/auth/AuthLeftPanel";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getCurrentUser } from "@/lib/server-data";

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to set a new password."
      leftContent={<ForgotPasswordLeftPanel />}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
