// Values match what the legacy form submitted (including the "Subsurfacce" spelling)
// so existing suggestion records and reports keep grouping the same way.
export const SUGGESTION_DEPARTMENTS: { label: string; value: string }[] = [
  "Communications",
  "Contracts and Procurement",
  "Drilling",
  "External Relations",
  "Finance",
  "Human Resources and Admin",
  "HSE",
  "Internal Control",
  "IT",
  "Legal",
  "Operations",
  "Security/Community",
  "Strategy and Planning",
  "Subsurface",
  "Other/General",
].map((label) => ({ label, value: label === "Subsurface" ? "Subsurfacce" : label }));
