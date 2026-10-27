"use client";

import { auth } from "@/lib/firebase";
import { hasAdminAccess, type AdminArea } from "@/lib/permissions";
import { authApi, useLogoutMutation } from "@/redux/apis/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUserData, setUserData } from "@/redux/reducers/user";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Restores the session on page load: when Firebase has a signed-in user,
 * load the users/{uid} record from staff-portal-be (GET /user/me).
 * Mount once (in the Redux provider).
 */
export const useAuthListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(clearUserData());
        return;
      }

      const request = dispatch(
        authApi.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }),
      );
      try {
        const result = await request.unwrap();
        dispatch(setUserData({ user: result.data.user }));
      } catch (error: any) {
        console.error("Could not restore session:", error);
        // 401/403: the account is not valid for this portal - end the Firebase session too
        if (error?.status === 401 || error?.status === 403) await signOut(auth).catch(() => {});
        dispatch(clearUserData());
      } finally {
        request.unsubscribe();
      }
    });
  }, [dispatch]);
};

export const useAuth = () => {
  const { user, initialising } = useAppSelector((state) => state.user);
  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: initialising,
    permissions: user?.permissions,
  };
};

/** Replaces the legacy AuthenticationGuard: redirect to /login?redirect=<path> when signed out. */
export const useRequireAuth = () => {
  const state = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/home")}`);
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router]);

  return state;
};

/** Replaces the legacy hr/operations/protocol/documents admin guards. */
export const useHasAdminAccess = (area: AdminArea) => {
  const { permissions } = useAuth();
  return hasAdminAccess(permissions, area);
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout request failed:", error);
    }
    await signOut(auth).catch(() => {});
    dispatch(clearUserData());
    router.replace("/login");
  };

  return { logout, isLoading };
};
