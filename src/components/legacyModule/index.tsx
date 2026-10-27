import PageHeader from "@/components/pageHeader";
import { LEGACY_PORTAL_URL } from "@/lib/config";

/**
 * Placeholder for modules still served by the legacy Angular portal.
 * Deep-links to the same path there so no workflow is lost during migration.
 */
const LegacyModule = ({ title, path }: { title: string; path: string }) => (
  <div>
    <PageHeader title={title} subtitle="This module is being moved to the new portal." />
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
      {LEGACY_PORTAL_URL ? (
        <>
          <p>Until the move is complete, please use {title} on the current portal.</p>
          <a
            href={`${LEGACY_PORTAL_URL}${path}`}
            className="mt-4 inline-block rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark"
          >
            Open {title}
          </a>
        </>
      ) : (
        <p>
          {title} is not available here yet. Please contact{" "}
          <a className="underline" href="mailto:appdev@amni.com">
            appdev@amni.com
          </a>{" "}
          for access in the meantime.
        </p>
      )}
    </div>
  </div>
);

export default LegacyModule;
