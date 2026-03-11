import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginLeftPanel } from "@/components/auth/AuthLeftPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/server-data";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      title="Log in to StatementFlow"
      subtitle="Access your dashboards, uploads, and exports."
      leftContent={<LoginLeftPanel />}
    >
      <LoginForm />
    </AuthLayout>
  );
}

