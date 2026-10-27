"use client";

import { useAuth, useLogout } from "@/hooks/useAuth";
import { NAV_ITEMS } from "@/lib/navigation";
import { faBars, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const linkClass = (href: string) =>
    `block px-3 py-2 text-sm font-medium uppercase tracking-wide ${
      pathname?.startsWith(href) ? "text-white" : "text-gray-300 hover:text-white"
    }`;

  return (
    <header className="bg-gray-900">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center px-4 py-2">
        <Link href="/home" className="mr-6">
          <Image src="/images/amni-logo.png" alt="Amni logo" width={110} height={40} priority />
        </Link>

        <button
          type="button"
          className="ml-auto text-gray-300 lg:hidden"
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

          <div className="relative lg:ml-auto">
            <button
              type="button"
              className="px-3 py-2 text-gray-300 hover:text-white"
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              <FontAwesomeIcon icon={faCircleUser} size="lg" />
            </button>
            {userMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-60 rounded-md bg-white py-2 shadow-lg"
              >
                <p className="px-4 py-2 text-xs text-gray-500">
                  Logged in as <b className="text-gray-800">{user?.name || user?.email}</b>
                </p>
                <hr className="my-1 border-gray-100" />
                <button
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={logout}
                >
                  Logout
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
