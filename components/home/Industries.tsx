"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { industries } from "@/data/home";

export function Industries() {
  const menuRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(2);
  const [shift, setShift] = useState(0);
  const item = industries.items[active];

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const image = imageRef.current;
    if (!menu || !image) return;

    const measure = () => {
      if (!window.matchMedia("(min-width: 768px)").matches) {
        setShift(0);
        return;
      }
      const ghost = menu.cloneNode(true) as HTMLElement;
      ghost.style.cssText =
        "position:absolute;visibility:hidden;pointer-events:none;transform:none;transition:none";
      Array.from(ghost.children).forEach((child, index) => {
        const el = child as HTMLElement;
        el.style.transition = "none";
        el.classList.toggle("is-active", index === active);
      });
      menu.parentElement?.appendChild(ghost);
      const current = ghost.children[active] as HTMLElement;
      const center = current.offsetTop + current.offsetHeight / 2;
      ghost.remove();
      const target = image.offsetTop + image.offsetHeight / 2;
      setShift(target - center);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <section className="section section--light">
      <div className="container">
        <h2 className="section-title industries__title">
          {industries.title[0]}
          <br />
          {industries.title[1]}
        </h2>
        <div className="industries">
          <div
            className="industries__menu"
            ref={menuRef}
            style={{ transform: shift ? `translateY(${shift}px)` : undefined }}
          >
            {industries.items.map((entry, index) => (
              <button
                key={entry.label}
                type="button"
                className={
                  index === active
                    ? "industries__tab is-active"
                    : "industries__tab"
                }
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <div className="industries__image" ref={imageRef}>
            <img src={item.image} alt={item.alt} />
          </div>
        </div>
      </div>
    </section>
  );
}
