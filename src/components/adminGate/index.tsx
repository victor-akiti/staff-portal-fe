"use client";

import { useHasAdminAccess } from "@/hooks/useAuth";
import type { AdminArea } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Wrap admin-only sections. Mirrors the legacy *-admin guards, which blocked
 * navigation (here we send the user back to the module home instead).
 */
const AdminGate = ({
  area,
  fallbackHref,
  children,
}: {
  area: AdminArea;
  fallbackHref: string;
  children: React.ReactNode;
}) => {
  const allowed = useHasAdminAccess(area);
  const router = useRouter();

  useEffect(() => {
    if (!allowed) router.replace(fallbackHref);
  }, [allowed, fallbackHref, router]);

  return allowed ? <>{children}</> : null;
};

export default AdminGate;
