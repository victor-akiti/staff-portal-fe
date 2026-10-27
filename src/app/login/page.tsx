"use client";

import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signInWithMicrosoft } from "@/lib/microsoftAuth";
import { errorMessage } from "@/redux/baseQuery";
import { useVerifyStaffTokenMutation } from "@/redux/apis/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUserData } from "@/redux/reducers/user";
import { defaultFirebaseError, firebaseErrorMap } from "@/utilities/firebaseErrorMap";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Only same-site redirects (legacy ?redirect=<path> param)
const safeRedirect = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/home";

/**
 * STAFF LOGIN
 * 1) Microsoft sign-in via Firebase popup
 * 2) PUT /user/ver on staff-portal-be (creates/backfills users/{uid}, sets the session cookie)
 */
const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [verifyStaffToken] = useVerifyStaffTokenMutation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");
  const redirectTo = safeRedirect(searchParams.get("redirect"));

  useEffect(() => {
    if (isAuthenticated) router.replace(redirectTo);
  }, [isAuthenticated, redirectTo, router]);

  const login = async () => {
    setError("");
    setIsSigningIn(true);

    let signInResult;
    try {
      signInResult = await signInWithMicrosoft();
    } catch (signInError: any) {
      setError(firebaseErrorMap[signInError?.code] || defaultFirebaseError);
      setIsSigningIn(false);
      return;
    }

    try {
      const result = await verifyStaffToken(signInResult).unwrap();
      dispatch(setUserData({ user: result.data.user }));
      router.replace(redirectTo);
    } catch (verifyError) {
      await signOut(auth).catch(() => {});
      setError(
        errorMessage(verifyError, "We could not verify your staff account. Please contact IT."),
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow">
      <Image
        src="/images/amni-logo.png"
        alt="Amni logo"
        width={140}
        height={50}
        className="mx-auto"
        priority
      />
      <h1 className="mt-6 text-xl font-semibold">Amni Staff Portal</h1>
      <p className="mt-2 text-sm text-gray-600">
        Please log in with your Amni corporate email credentials.
      </p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={login}
        disabled={isSigningIn}
        className="mt-6 w-full rounded bg-brand px-4 py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isSigningIn ? "Signing in..." : "Login with Microsoft"}
      </button>
    </div>
  );
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Suspense>
        <LoginContent />
      </Suspense>
    </div>
  );
}
