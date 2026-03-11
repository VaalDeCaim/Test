const NO_AUTH_FLAG = process.env.NO_AUTH;

export const DEV_USER_COOKIE = "statementflow_dev_user";

export function isAuthDisabled(): boolean {
  return NO_AUTH_FLAG === "true";
}

/** Call before navigating to dashboard when using "Continue in dev mode" so the server treats the user as logged in. */
export function setDevUserCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEV_USER_COOKIE}=1; path=/; max-age=${86400 * 7}`;
}

/** Call on logout to clear the dev user cookie. */
export function clearDevUserCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEV_USER_COOKIE}=; path=/; max-age=0`;
}

