"use client";

import { usePathname } from "next/navigation";
import { Appear } from "./Appear";

type PageAppearProps = {
  children: React.ReactNode;
};

/**
 * Wraps page content with the shared appear animation on route change.
 * Dashboard routes (sidebar + header + main) render without animation.
 */
export function PageAppear({ children }: PageAppearProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <Appear key={pathname} duration={400} distance={16}>
      {children}
    </Appear>
  );
}
