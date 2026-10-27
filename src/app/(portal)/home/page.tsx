import { SERVICES } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

const MODULE_LINKS = [
  { label: "Operations", href: "/operations" },
  { label: "Information Management", href: "/documents" },
  { label: "HR & Admin", href: SERVICES.amniHR.url, external: true },
  { label: "Finance", href: "/finance" },
  { label: "Journey Mgt", href: "/journey" },
  { label: "ICT", href: "/ict" },
  { label: "Quick Links", href: "/quick-links" },
  { label: "Suggestion Box", href: "/suggestion-box" },
];

const SERVICE_TILES = [
  {
    href: SERVICES.amniContractors.url,
    src: "/images/contractor-portal-logo.png",
    alt: "Contractor Portal logo",
  },
  { href: SERVICES.amniHR.url, src: "/images/hr-portal-logo.png", alt: "HR Portal logo" },
  { href: SERVICES.amniIntranet.url, src: "/images/intranet-logo.png", alt: "Amni Intranet logo" },
  {
    href: SERVICES.operationsFolder.url,
    src: "/images/ops-folder-logo.png",
    alt: "Ops folder logo",
  },
  { href: SERVICES.docuware.url, src: "/images/docuware-logo.jpeg", alt: "Docuware logo" },
  { href: SERVICES.maximo.url, src: "/images/maximo-logo.png", alt: "Maximo logo" },
  { href: SERVICES.sage.url, src: "/images/sage-logo.jpg", alt: "Sage X3 logo" },
  { href: SERVICES.office.url, src: "/images/office-logo.jpg", alt: "Office logo" },
];

export default function HomePage() {
  return (
    <div>
      <div className="mb-10 flex justify-center">
        <Image
          src="/images/staff-portal-logo.png"
          alt="Amni Staff Portal"
          width={280}
          height={90}
          priority
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {MODULE_LINKS.map((item) => (
            <li key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} className="block px-4 py-3 hover:bg-gray-50">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SERVICE_TILES.map((tile) => (
            <a
              key={tile.alt}
              href={tile.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white p-3 hover:shadow"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                width={120}
                height={60}
                className="max-h-16 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
