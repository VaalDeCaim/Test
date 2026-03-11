"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mockFetchJobs, mockGetJobStatus } from "@/lib/mock-api";
import type { Job } from "@/lib/api-types";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: mockFetchJobs,
  });
}

export function useJobStatus(jobId: string | null) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => (jobId ? mockGetJobStatus(jobId) : null),
    enabled: !!jobId,
  });
}

export function usePollJobStatus(jobId: string | null) {
  return useQuery<Job | null>({
    queryKey: ["job", jobId],
    queryFn: () => (jobId ? mockGetJobStatus(jobId) : Promise.resolve(null)),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === "completed" || data.status === "failed"))
        return false;
      return 2000;
    },
  });
}
