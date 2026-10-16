"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoUrl, nav } from "@/data/home";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <header className="header">
      <div className="container header__bar">
        <Link href="/" className="header__logo" aria-label="Kumo">
          <img src={logoUrl} alt="" width={94} height={35} />
        </Link>
        <button
          type="button"
          className="header__burger"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={open ? "header__nav is-open" : "header__nav"}>
          {nav.map((item) => {
            const current =
              ready &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="header__link"
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <span className="header__underline" />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
