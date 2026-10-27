import LegacyModule from "@/components/legacyModule";

// Public link sent in job completion emails - keep working until the module is migrated.
export default function Page({ params }: { params: { jcfID: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <LegacyModule
        title="Job Completion Certificate"
        path={`/jcc/${encodeURIComponent(params.jcfID)}`}
      />
    </div>
  );
}
