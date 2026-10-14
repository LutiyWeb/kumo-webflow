/**
 * Homepage motion for Kumo demo.
 * Hero entrance on load + scroll reveals for sections below.
 * Loaded only on Home via HtmlEmbed.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power3.out";
const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealSection(section: Element) {
  const title = section.querySelector(
    ".section-title, .streams__head, .solutions__title, .looking__title, .why__title, .streams__title",
  );
  const lead = section.querySelectorAll(
    ".text-lead, .solutions__row, .looking__text, .streams__line",
  );
  const cards = section.querySelectorAll(".card, .why__item");
  const extras = section.querySelectorAll(
    ".solutions__button, .industries__tabs, .streams__footer, .button-outline",
  );

  const batch: Element[] = [];
  if (title) batch.push(title);
  lead.forEach((el) => batch.push(el));
  cards.forEach((el) => batch.push(el));
  extras.forEach((el) => batch.push(el));

  if (!batch.length) return;

  gsap.set(batch, { autoAlpha: 0, y: 36 });

  ScrollTrigger.create({
    trigger: section,
    start: "top 82%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: EASE } });

      if (title) {
        tl.to(title, { autoAlpha: 1, y: 0, duration: 0.75 }, 0);
      }

      if (lead.length) {
        tl.to(
          lead,
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
          title ? 0.12 : 0,
        );
      }

      if (cards.length) {
        tl.to(
          cards,
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.09 },
          "-=0.35",
        );
      }

      if (extras.length) {
        tl.to(
          extras,
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.3",
        );
      }

      // Accent: streams line draws in
      const line = section.querySelector(".streams__line") as HTMLElement | null;
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.9, ease: EASE, delay: 0.15 },
        );
      }
    },
  });
}

function heroEntrance() {
  const root = document.querySelector(".section--hero .hero__content");
  if (!root) return;

  const activeSlide =
    root.querySelector(".w-slide:not([aria-hidden='true'])") ||
    root.querySelector(".w-slide") ||
    root;

  const title = activeSlide.querySelector(".hero__title");
  const subtitle = activeSlide.querySelector(".hero__subtitle");
  const nav = document.querySelector(".header, .navbar, [class*='header']");

  const pieces = [title, subtitle].filter(Boolean) as Element[];
  if (!pieces.length) return;

  gsap.set(pieces, { autoAlpha: 0, y: 28 });
  if (nav) gsap.set(nav, { autoAlpha: 0, y: -12 });

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.05);
  tl.to(title, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.15);
  if (subtitle) tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.32);

  // Soft fade-in of globe layer (already running WebGL)
  const globe = document.querySelector(".hero__animation");
  if (globe) {
    gsap.fromTo(
      globe,
      { autoAlpha: 0.35 },
      { autoAlpha: 1, duration: 1.2, ease: "power2.out", delay: 0.1 },
    );
  }
}

function softHovers() {
  document.querySelectorAll(".section--looking .card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, { y: -6, duration: 0.35, ease: EASE, overwrite: "auto" });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { y: 0, duration: 0.4, ease: EASE, overwrite: "auto" });
    });
  });
}

function init() {
  if (REDUCED) return;

  // Only run on homepage
  const isHome =
    location.pathname === "/" ||
    location.pathname === "/index.html" ||
    document.querySelector(".section--hero[class*='section']");
  if (!document.querySelector(".section--hero")) return;
  void isHome;

  heroEntrance();

  document
    .querySelectorAll(
      ".section--solutions, .section--looking, .section--streams, .section--why, .section--industries",
    )
    .forEach((section) => revealSection(section));

  softHovers();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
