"use client";

import { useQuery } from "@tanstack/react-query";
import { mockFetchMe } from "@/lib/mock-api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: mockFetchMe,
  });
}
