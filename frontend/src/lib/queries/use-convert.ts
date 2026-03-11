"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockUploadInit, mockCreateJob } from "@/lib/mock-api";
import type { ExportFormat } from "@/lib/api-types";

export function useUploadInit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockUploadInit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uploadId, format }: { uploadId: string; format: ExportFormat }) =>
      mockCreateJob(uploadId, format),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}
