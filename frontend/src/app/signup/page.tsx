import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupLeftPanel } from "@/components/auth/AuthLeftPanel";
import { SignupForm } from "@/components/auth/SignupForm";
import { getCurrentUser } from "@/lib/server-data";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      title="Create your StatementFlow account"
      subtitle="Set up access for you and your team to automate statement extraction."
      leftContent={<SignupLeftPanel />}
    >
      <SignupForm />
    </AuthLayout>
  );
}

