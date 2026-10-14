"use client";

import { useState } from "react";
import { footerColumns, footerCopy, logoUrl } from "@/data/home";

export function Footer() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <a href="#top" className="footer__logo" aria-label="Kumo">
            <img src={logoUrl} alt="Kumo Technology" />
          </a>
          {footerColumns.map((column) => {
            const isOpen = open === column.title;
            return (
              <div
                key={column.title}
                className={isOpen ? "footer__col is-open" : "footer__col"}
              >
                <button
                  type="button"
                  className="footer__title"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpen((current) =>
                      current === column.title ? null : column.title,
                    )
                  }
                >
                  {column.title}
                </button>
                <ul className="footer__list">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#top" className="footer__link">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="footer__copy">{footerCopy}</p>
      </div>
    </footer>
  );
}
