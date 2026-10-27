import { SERVICES } from "@/lib/config";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/** Same order and destinations as the legacy shell header. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Operations", href: "/operations" },
  { label: "HR & Admin", href: SERVICES.amniHR.url, external: true },
  { label: "Finance", href: "/finance" },
  { label: "Info Mgt", href: "/documents" },
  { label: "Journey Mgt", href: "/journey" },
  { label: "ICT", href: "/ict" },
];
