const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getPricing: () => apiFetch<{ operations: Array<{ id: string; coins: number }>; coinPackages: Array<{ id: string; coins: number; priceUsd: string }>; proSubscription: { priceUsd: string; interval: string } | null }>('/users/pricing'),
  getMe: (token: string) => apiFetch<{ sub: string; email?: string; balance: { coins: number }; subscription: unknown }>('/users/me', { token }),
  getBalance: (token: string) => apiFetch<{ coins: number }>('/users/balance', { token }),
  initUpload: (token: string, body: { filename: string; contentType?: string }) =>
    apiFetch<{ uploadUrl: string; key: string }>('/uploads/init', { method: 'POST', body: JSON.stringify(body), token }),
  createJob: (token: string, body: { key: string; originalFilename?: string }) =>
    apiFetch<{ id: string; status: string }>('/jobs', { method: 'POST', body: JSON.stringify(body), token }),
  getJobs: (token: string) => apiFetch<Array<{ id: string; status: string; format?: string; createdAt: string; validationErrors?: string[]; validationWarnings?: string[] }>>('/jobs', { token }),
  getJob: (token: string, id: string) =>
    apiFetch<{ id: string; status: string; format?: string; exportKeyCsv?: string; exportKeyXlsx?: string; exportKeyQbo?: string; validationErrors?: string[]; validationWarnings?: string[] }>(`/jobs/${id}`, { token }),
  getExportUrl: (token: string, jobId: string, format: 'csv' | 'xlsx' | 'qbo') =>
    apiFetch<{ url: string }>(`/exports/${jobId}/${format}`, { token }),
  topUp: (token: string, body: { packageId: string; successUrl?: string; cancelUrl?: string }) =>
    apiFetch<{ url: string; sessionId: string }>('/users/topup', { method: 'POST', body: JSON.stringify(body), token }),
  proCheckout: (token: string, body?: { successUrl?: string; cancelUrl?: string }) =>
    apiFetch<{ url: string; sessionId: string }>('/users/subscription/checkout', { method: 'POST', body: JSON.stringify(body || {}), token }),
};
