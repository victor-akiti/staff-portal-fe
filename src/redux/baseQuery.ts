import { BACKEND_BASE_URL } from "@/lib/config";
import { auth } from "@/lib/firebase";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getIdToken } from "firebase/auth";

/**
 * Same approach as contractor-portal-FE/src/redux/baseQuery.ts:
 * - cookie session set by PUT /user/ver (credentials: "include")
 * - Firebase ID token as a Bearer fallback (the cookie is HTTP-only and cross-site,
 *   so the browser may not send it; staff-portal-be accepts either)
 * - on 401, refresh the token, re-verify, retry once, then send the user to /login
 */

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_BASE_URL,
  credentials: "include",
  prepareHeaders: async (headers) => {
    const user = auth.currentUser;
    if (user && !headers.has("token")) {
      const token = await getIdToken(user);
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

const performTokenRefresh = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const freshToken = await getIdToken(user, true);
    const response = await fetch(`${BACKEND_BASE_URL}/user/ver`, {
      method: "PUT",
      headers: { token: freshToken },
      credentials: "include",
    });
    if (!response.ok) return false;

    const result = await response.json();
    return result.status === "OK";
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

const handleTokenRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const redirectToLogin = () => {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/login")) return;
  const redirect = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `/login?redirect=${redirect}`;
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Login and session checks handle their own 401s
  const url = typeof args === "string" ? args : args.url;
  const isAuthCall = url.startsWith("user/");

  if (!isAuthCall && result.error && result.error.status === 401) {
    if (await handleTokenRefresh()) {
      result = await baseQuery(args, api, extraOptions);
      if (result.error && result.error.status === 401) redirectToLogin();
    } else {
      redirectToLogin();
    }
  }

  return result;
};

/** Pulls the backend's { error: { message } } out of an RTK Query error. */
export const errorMessage = (error: any, fallback = "Something went wrong. Please try again.") =>
  error?.data?.error?.message || error?.error?.message || error?.message || fallback;
