"use client";

import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
import { FileUp, FileDown, Settings2, ChevronRight } from "lucide-react";
import type { RecentItem } from "@/lib/mock-data";

type Props = {
  items: RecentItem[];
};

function iconForTitle(title: string) {
  if (title.toLowerCase().includes("upload")) return FileUp;
  if (title.toLowerCase().includes("export")) return FileDown;
  return Settings2;
}

export function RecentItems({ items }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Recent activity
        </h2>
        <Button
          as={Link}
          href="/dashboard/history"
          variant="light"
          size="sm"
          className="min-w-0 gap-1 text-default-500"
          endContent={<ChevronRight className="size-4" />}
        >
          View all
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-default-200/80 bg-background shadow-sm">
        <ul className="divide-y divide-default-100">
          {items.map((item) => {
            const Icon = iconForTitle(item.title);
            return (
              <li key={item.id}>
                <div className="flex min-w-0 items-center gap-4 px-4 py-3 transition-colors hover:bg-default-50/80">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-default-100 text-default-600">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <Tooltip content={item.title} delay={300} closeDelay={0}>
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                    </Tooltip>
                    <Tooltip content={item.subtitle} delay={300} closeDelay={0}>
                      <p className="truncate text-xs text-default-500">
                        {item.subtitle}
                      </p>
                    </Tooltip>
                  </div>
                  <span className="shrink-0 text-xs text-default-400">
                    {item.timestamp}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
