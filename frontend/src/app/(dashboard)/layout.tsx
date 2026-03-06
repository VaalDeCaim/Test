import { Drawer } from '@/components/layout/Drawer';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/auth/login?returnTo=/convert');
  }

  return (
    <div className="flex h-screen">
      <Drawer />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
