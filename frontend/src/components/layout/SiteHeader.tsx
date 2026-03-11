"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useUser} from "@/lib/auth-context";
import {Button} from "@heroui/react";
import {StatementFlowLogo} from "@/components/layout/StatementFlowLogo";
import {ThemeSwitcher} from "@/components/ui/ThemeSwitcher";

const landingAnchors = [
  {href: "#features", label: "Features"},
  {href: "#how-it-works", label: "How it works"},
  {href: "#use-cases", label: "Use cases"},
  {href: "#faq", label: "FAQ"},
];

export function SiteHeader() {
  const {user} = useUser();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const onLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({top: 0, behavior: "smooth"});
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-default-200 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-6">
          <StatementFlowLogo onClick={onLogoClick} />
          {pathname === "/" ? (
            <nav className="hidden items-center gap-4 text-xs font-medium text-default-600 md:flex">
              {landingAnchors.map((item) => (
                <Link
                  key={item.href}
                  href={`/${item.href}`}
                  scroll
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {user ? (
            <Button variant="bordered" as={Link} href="/dashboard">
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button variant="bordered" as={Link} href="/login">
                Log in
              </Button>
              <Button color="primary" as={Link} href="/signup">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
