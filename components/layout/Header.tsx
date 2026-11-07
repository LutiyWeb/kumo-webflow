"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoUrl, nav, type NavItem } from "@/data/home";

function isItemActive(item: NavItem, pathname: string): boolean {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
    return true;
  }
  if (
    item.href === "/about" &&
    (pathname.startsWith("/careers") || pathname.startsWith("/team"))
  ) {
    return true;
  }
  if (item.children) {
    return item.children.some(
      (child) =>
        child.href !== "/in-development" &&
        child.href !== item.href &&
        (pathname === child.href || pathname.startsWith(`${child.href}/`)),
    );
  }
  return false;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeDesktop, setActiveDesktop] = useState<string | null>(null);
  const [mobileCategory, setMobileCategory] = useState<NavItem | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveDesktop(null);
    setMobileCategory(null);
  }, [pathname]);

  const closeAll = () => {
    setOpen(false);
    setActiveDesktop(null);
    setMobileCategory(null);
  };

  return (
    <header
      className={
        activeDesktop || open ? "header header--MenuOpen" : "header"
      }
      onMouseLeave={() => setActiveDesktop(null)}
    >
      <div className="container header__bar">
        <Link
          href="/"
          className="header__logo"
          aria-label="Kumo"
          onClick={closeAll}
        >
          <img src={logoUrl} alt="" width={94} height={35} />
        </Link>
        <button
          type="button"
          className={open ? "header__burger is-open" : "header__burger"}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => {
            setOpen((value) => {
              if (value) {
                setMobileCategory(null);
              }
              return !value;
            });
          }}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Desktop navigation with Figma dropdowns */}
        <nav className="header__nav" aria-label="Main navigation">
          {nav.map((item) => {
            const current = ready && isItemActive(item, pathname);
            const isDropdownOpen = activeDesktop === item.label;
            return (
              <div
                key={item.label}
                className={
                  isDropdownOpen
                    ? "header__item is-dropdown-open"
                    : "header__item"
                }
                onMouseEnter={() =>
                  setActiveDesktop(item.children ? item.label : null)
                }
              >
                <Link
                  href={item.href}
                  className="header__link"
                  aria-current={current ? "page" : undefined}
                  aria-haspopup={item.children ? "true" : undefined}
                  aria-expanded={item.children ? isDropdownOpen : undefined}
                  onFocus={() =>
                    setActiveDesktop(item.children ? item.label : null)
                  }
                  onClick={closeAll}
                >
                  {item.label}
                  <span className="header__underline" />
                </Link>

                {item.children && (
                  <div className="header__dropdown" role="menu">
                    <ul className="header__sublist">
                      {item.children.map((child) => {
                        const childActive =
                          ready &&
                          child.href !== "/in-development" &&
                          child.href !== item.href &&
                          (pathname === child.href ||
                            pathname.startsWith(`${child.href}/`));
                        return (
                          <li key={child.label} role="none">
                            <Link
                              href={child.href}
                              role="menuitem"
                              className="header__sublink"
                              aria-current={childActive ? "page" : undefined}
                              onClick={closeAll}
                            >
                              <span>{child.label}</span>
                              <svg
                                className="header__subarrow"
                                width="41"
                                height="12"
                                viewBox="0 0 41 12"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M0 6H39.5M39.5 6L34 1M39.5 6L34 11"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile 2-level menu overlay from Figma (3956:1554 / 3956:1848 / 3966:5 / 3966:43 / 3966:81) */}
        <div
          className={
            open ? "header__mobile is-open" : "header__mobile"
          }
          aria-hidden={!open}
        >
          {!mobileCategory ? (
            <ul className="header__mobile-list">
              {nav.map((item) => {
                const isUpper = Boolean(item.children);
                return (
                  <li key={item.label} className="header__mobile-row">
                    {item.children ? (
                      <button
                        type="button"
                        className="header__mobile-parent"
                        onClick={() => setMobileCategory(item)}
                      >
                        <span
                          className={
                            isUpper ? "header__mobile-label--upper" : ""
                          }
                        >
                          {item.label}
                        </span>
                        <svg
                          width="7"
                          height="13"
                          viewBox="0 0 7 13"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 1L6 6.5L1 12"
                            stroke="#DCE0E0"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="header__mobile-parent"
                        onClick={closeAll}
                      >
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="header__mobile-sub">
              <div className="header__mobile-subhead">
                <button
                  type="button"
                  className="header__mobile-back"
                  aria-label="Back to main menu"
                  onClick={() => setMobileCategory(null)}
                >
                  <svg
                    width="7"
                    height="13"
                    viewBox="0 0 7 13"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 1L1 6.5L6 12"
                      stroke="#DCE0E0"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                <Link
                  href={mobileCategory.href}
                  className="header__mobile-subtitle"
                  onClick={closeAll}
                >
                  {mobileCategory.label}
                </Link>
              </div>
              <ul className="header__mobile-sublist">
                {mobileCategory.children?.map((child) => (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      className="header__mobile-sublink"
                      onClick={closeAll}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
