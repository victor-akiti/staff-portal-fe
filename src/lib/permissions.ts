import type { UserPermissions } from "@/types/auth.types";

export type AdminArea = "hr" | "operations" | "protocol" | "documents";

const AREA_FLAG: Record<AdminArea, keyof UserPermissions> = {
  hr: "hrAdmin",
  operations: "operationsAdmin",
  protocol: "protocolAdmin",
  documents: "documentsAdmin",
};

/** Same rule as the legacy *-admin.guard.ts files: area flag or platformAdmin. */
export const hasAdminAccess = (permissions: UserPermissions | undefined | null, area: AdminArea) =>
  Boolean(permissions && (permissions[AREA_FLAG[area]] || permissions.platformAdmin));
