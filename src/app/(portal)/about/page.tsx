import PageHeader from "@/components/pageHeader";
const APP_VERSION = process.env.npm_package_version || "0.1.0";

export default function AboutPage() {
  return <PageHeader title="Amni Staff Portal" subtitle={`Version ${APP_VERSION}`} />;
}
