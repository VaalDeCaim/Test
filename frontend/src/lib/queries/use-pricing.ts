"use client";

import { useQuery } from "@tanstack/react-query";
import { mockFetchPricing } from "@/lib/mock-api";

export function usePricing() {
  return useQuery({
    queryKey: ["pricing"],
    queryFn: mockFetchPricing,
  });
}
