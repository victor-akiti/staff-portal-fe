"use client";

import Header from "@/components/header";
import Loading from "@/components/loading";
import { useRequireAuth } from "@/hooks/useAuth";

/**
 * Authenticated shell - replaces the legacy Shell.childRoutes + AuthenticationGuard.
 */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading || !isAuthenticated) return <Loading message="Checking your session..." />;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Amni International Petroleum Development Company
      </footer>
    </div>
  );
}
