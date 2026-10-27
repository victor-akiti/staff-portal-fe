import { QUICK_LINKS } from "@/content/quickLinks";
import Image from "next/image";
import Link from "next/link";

export default function QuickLinksPage() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/home">
          <Image src="/images/amni-logo.png" alt="Amni logo" width={120} height={44} />
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-brand">Quick Access Links</h1>
        <ul className="mt-6 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {QUICK_LINKS.map((item) => (
            <li key={item.link}>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-3 hover:bg-gray-50"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
