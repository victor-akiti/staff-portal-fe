"use client";

import { useAuth, useLogout } from "@/hooks/useAuth";
import { NAV_ITEMS } from "@/lib/navigation";
import { faBars, faChevronDown, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const initialsOf = (name?: string | null) =>
  (name || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const linkClass = (href: string) => {
    const active = pathname?.startsWith(href);
    return `block border-b-2 px-3 py-4 text-sm font-medium transition-colors lg:py-5 ${
      active
        ? "border-brand text-brand"
        : "border-transparent text-gray-600 hover:border-gray-200 hover:text-ink"
    }`;
  };

  const displayName = user?.name || user?.email || "";

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="h-1 bg-brand" />
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center px-4">
        <Link href="/home" className="mr-8 flex items-center gap-3 py-2">
          <Image src="/images/amni-logo.png" alt="Amni" width={40} height={40} priority />
          <span className="hidden text-sm font-semibold leading-tight text-ink sm:block">
            Staff Portal
          </span>
        </Link>

        <button
          type="button"
          className="ml-auto rounded p-2 text-gray-600 lg:hidden"
          aria-controls="navbar-menu"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        <div
          id="navbar-menu"
          className={`${menuOpen ? "block" : "hidden"} w-full lg:flex lg:w-auto lg:flex-1 lg:items-center`}
        >
          <div className="lg:flex">
            {NAV_ITEMS.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass(item.href)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={linkClass(item.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="relative py-2 lg:ml-auto" ref={userMenuRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-gray-700 hover:bg-gray-100"
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                {initialsOf(displayName)}
              </span>
              <span className="max-w-[10rem] truncate">
                {user?.name?.split(" ")[0] || "Account"}
              </span>
              <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 text-gray-400" />
            </button>
            {userMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-ink">{user?.name}</p>
                  <p className="truncate text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  role="menuitem"
                  className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-3 text-left text-sm text-gray-700 hover:bg-brand-50"
                  onClick={logout}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4 text-gray-400" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
