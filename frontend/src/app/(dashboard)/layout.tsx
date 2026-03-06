import { Drawer } from '@/components/layout/Drawer';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    const loginPath =
      process.env.DEV_AUTH_BYPASS === 'true' ? '/auth/dev-login' : '/auth/login';
    redirect(`${loginPath}?returnTo=/convert`);
  }

  return (
    <div className="flex h-screen">
      <Drawer />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
