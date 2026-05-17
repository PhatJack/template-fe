const ACCESS_TOKEN_KEY = "accessToken";
export const AUTH_TOKEN_CHANGED_EVENT = "auth-token-changed";

function canUseStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getAccessToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(accessToken: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
}

export function clearAccessToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
}
