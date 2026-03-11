import { cookies } from "next/headers";
import { isAuthDisabled, DEV_USER_COOKIE } from "./auth-config";
import {
  mockUser,
  mockDashboardData,
  type DashboardData,
} from "./mock-data";

export type CurrentUser = typeof mockUser | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  if (isAuthDisabled()) {
    return mockUser;
  }

  const store = await cookies();
  if (store.get(DEV_USER_COOKIE)?.value === "1") {
    return mockUser;
  }

  return null;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  if (isAuthDisabled()) {
    return mockDashboardData;
  }

  const store = await cookies();
  if (store.get(DEV_USER_COOKIE)?.value === "1") {
    return mockDashboardData;
  }

  return null;
}

