"use client";

import Link from "next/link";
import {Button} from "@heroui/react";
import {useUser} from "@/lib/auth-context";
import {ArrowUpRight, FileText} from "lucide-react";

const STAR_POSITIONS = [
  {left: "12%", top: "20%", delay: "0s", size: 4},
  {left: "88%", top: "30%", delay: "0.8s", size: 3},
  {left: "75%", top: "70%", delay: "0.3s", size: 5},
  {left: "22%", top: "75%", delay: "0.5s", size: 3},
  {left: "50%", top: "15%", delay: "0.2s", size: 4},
  {left: "35%", top: "55%", delay: "0.6s", size: 3},
  {left: "65%", top: "45%", delay: "0.4s", size: 4},
  {left: "8%", top: "50%", delay: "0.7s", size: 3},
  {left: "92%", top: "80%", delay: "0.1s", size: 4},
];

export function DashboardHero() {
  const {user} = useUser();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-default-200/80 bg-gradient-to-br from-default-50 via-background to-primary-50/30 p-6 shadow-sm md:p-8 mt-4">
      {/* Floating star particles */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {STAR_POSITIONS.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-foreground/40"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animation: "hero-star-float 4s ease-in-out infinite",
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-default-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-default-600">
            See how your statement ingestion is performing and start your next
            conversion run.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            color="primary"
            as={Link}
            href="/dashboard/convert"
            className="gap-2 font-medium"
            endContent={<ArrowUpRight className="size-4" />}
          >
            Upload statements
          </Button>
          <Button
            variant="bordered"
            as={Link}
            href="/dashboard/history"
            className="gap-2 border-default-200 bg-background/80"
            endContent={<FileText className="size-4" />}
          >
            View history
          </Button>
        </div>
      </div>
    </div>
  );
}
