import LegacyModule from "@/components/legacyModule";

// Public legacy route - not yet migrated.
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <LegacyModule title="Bunker Requests" path="/bunker" />
    </div>
  );
}
