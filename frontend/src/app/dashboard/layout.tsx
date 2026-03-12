"use client";

import {DashboardSidebar} from "@/components/dashboard/DashboardSidebar";
import {DashboardHeader} from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col min-w-0 pl-56">
        <DashboardHeader />
        <main className="flex-1 overflow-auto overscroll-none p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
