import LegacyModule from "@/components/legacyModule";

// Not yet migrated - see MIGRATION.md. Deep-links to the same path on the legacy portal.
export default function Page({ params }: { params: { slug?: string[] } }) {
  const path = ["/hr", ...(params.slug || [])].join("/");
  return <LegacyModule title="HR" path={path} />;
}
