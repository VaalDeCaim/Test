"use client";

import { Card, CardBody } from "@heroui/react";
import { FileBarChart, FileOutput } from "lucide-react";
import type { DashboardMetric } from "@/lib/mock-data";

type Props = {
  metrics: DashboardMetric[];
};

const metricIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Parsed Statements": FileBarChart,
  "Exported Reports": FileOutput,
};

export function MetricsGrid({ metrics }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => {
        const Icon = metricIcons[m.label] ?? FileBarChart;
        return (
          <Card
            key={m.id}
            shadow="none"
            className="border border-default-200/80 bg-background/60 transition-colors hover:border-default-300 hover:bg-default-50/50"
          >
            <CardBody className="flex flex-row items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-default-500">
                  {m.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                  {m.value}
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <span className="flex size-9 items-center justify-center rounded-lg bg-default-100">
                  <Icon className="size-4 text-default-600" aria-hidden />
                </span>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </section>
  );
}
