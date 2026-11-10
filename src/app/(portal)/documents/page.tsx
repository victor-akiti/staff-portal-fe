"use client";

import PageHeader from "@/components/pageHeader";
import { LEGACY_PORTAL_URL } from "@/lib/config";
import {
  faArrowUpRightFromSquare,
  faBuilding,
  faFileArrowDown,
  faHashtag,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

interface Tile {
  title: string;
  description: string;
  icon: IconDefinition;
  href: string;
  legacy?: boolean;
}

const TILES: Tile[] = [
  {
    title: "Document templates",
    description:
      "Download letter, memo, document and drawing templates. Information Management uploads and updates them.",
    icon: faFileArrowDown,
    href: "/documents/templates",
  },
  {
    title: "Companies",
    description: "Request a new company code, and see approved companies.",
    icon: faBuilding,
    href: "/documents/companies",
    legacy: true,
  },
  {
    title: "Document numbers",
    description: "Generate and find document numbers.",
    icon: faHashtag,
    href: "/documents/find",
    legacy: true,
  },
  {
    title: "Manage codes",
    description: "Department, asset and document type codes.",
    icon: faListCheck,
    href: "/documents/manage-codes",
    legacy: true,
  },
];

export default function InformationManagementPage() {
  return (
    <div>
      <PageHeader
        title="Information Management"
        subtitle="Templates, company codes and document numbering."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {TILES.map((tile) => {
          const content = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                <FontAwesomeIcon icon={tile.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-2 font-semibold text-ink">
                  {tile.title}
                  {tile.legacy && (
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="h-3 w-3 text-gray-400"
                      title="Opens the current portal"
                    />
                  )}
                </span>
                <span className="mt-1 block text-sm text-gray-500">{tile.description}</span>
              </span>
            </>
          );
          const className =
            "flex gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand/40 hover:shadow-sm";

          return tile.legacy && LEGACY_PORTAL_URL ? (
            <a key={tile.title} href={`${LEGACY_PORTAL_URL}${tile.href}`} className={className}>
              {content}
            </a>
          ) : (
            <Link key={tile.title} href={tile.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
