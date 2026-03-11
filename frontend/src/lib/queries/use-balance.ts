"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetBalance } from "@/lib/mock-api";

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: mockGetBalance,
  });
}
