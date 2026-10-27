// NOTE: every Vercel deployment (production and preview) is built with
// NODE_ENV=production, so it reads NEXT_PUBLIC_BACKEND_URL. Set that on each
// Vercel environment to ITS backend (Production -> AmniPortal02, Preview -> AmniPortal02dev).
// NEXT_PUBLIC_* values are baked in at build time - redeploy after changing.
// Same pattern as contractor-portal-FE/src/lib/config.ts.

const trimSlash = (url: string) => url.replace(/\/+$/, "");

const BACKEND_URLS: Record<string, string> = {
  development: process.env.NEXT_PUBLIC_DEV_BACKEND_URL || "http://localhost:8086",
  production: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_DEV_BACKEND_URL || "",
};

export const BACKEND_BASE_URL = trimSlash(
  BACKEND_URLS[process.env.NODE_ENV] ?? BACKEND_URLS.production,
);

if (!BACKEND_BASE_URL && typeof window !== "undefined") {
  console.error(
    "[config] No backend URL: set NEXT_PUBLIC_BACKEND_URL on this deployment and redeploy.",
  );
}

export const MS_TENANT_ID =
  process.env.NEXT_PUBLIC_MS_TENANT_ID || "ce77023f-6530-4864-94d0-026b6671b462";

/**
 * Legacy Angular portal, kept reachable while modules are migrated.
 * Deliberately no default: once this app serves portal.amni.com, defaulting to it would loop.
 */
export const LEGACY_PORTAL_URL = trimSlash(process.env.NEXT_PUBLIC_LEGACY_PORTAL_URL || "");

/** External services on the home page (environment.services in the legacy app). */
export const SERVICES = {
  maximo: { url: "https://arcotgreen.bpdzenith.com/maximo/" },
  sage: { url: "http://192.168.100.29:8124/" },
  office: { url: "https://www.office.com/" },
  docuware: { url: "https://amni.docuware.cloud/docuware" },
  amniHR: { url: "https://amnihr.com" },
  amniContractors: { url: "https://contractors.amni.com/" },
  amniIntranet: { url: "https://amnipetroleum.sharepoint.com/sites/AMNIIntraNET" },
  operationsFolder: {
    url: "https://teams.microsoft.com/_#/files/General?threadId=19%3Ae2832015878d4705a16eb7951903b9c6%40thread.tacv2&ctx=channel&context=General&rootfolder=%252Fsites%252FBaseOperations%252FShared%2520Documents%252FGeneral",
  },
} as const;
