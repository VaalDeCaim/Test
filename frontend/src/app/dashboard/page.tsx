import { redirect } from "next/navigation";
import { isAuthDisabled } from "@/lib/auth-config";
import { getCurrentUser, getDashboardData } from "@/lib/server-data";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { RecentItems } from "@/components/dashboard/RecentItems";

export default async function DashboardPage() {
  const [user, data] = await Promise.all([
    getCurrentUser(),
    getDashboardData(),
  ]);

  const noAuth = isAuthDisabled();

  if (!noAuth && !user) {
    redirect("/");
  }

  if (!data) {
    return (
      <div className="px-4 py-10">
        <p className="text-sm text-default-600">
          Auth is not wired yet. Set <code>NO_AUTH=true</code> in
          <code>.env.local</code> to see a mock dashboard with sample data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHero />
      <MetricsGrid metrics={data.metrics} />
      <RecentItems items={data.recent} />
    </div>
  );
}

