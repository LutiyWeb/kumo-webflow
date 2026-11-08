"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = "power3.out";
const START = "top 85%";
const MOTION_CLASS = "js-motion";

/*
 * Scroll reveals for any page, driven by data attributes:
 *   data-reveal="up | left | fade | zoom | split | stagger | curtain | line | pop"
 *   data-reveal-delay="0.2"   — extra delay in seconds
 *   data-count                — count the first number in the text up from 0
 *   data-parallax="8"         — scrubbed yPercent drift (desktop only)
 * Elements with data-reveal are hidden by CSS under html.js-motion until animated.
 */
const ADD_CLASS_SCRIPT = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('${MOTION_CLASS}')`;

export function PageMotion() {
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.classList.remove(MOTION_CLASS);
      return;
    }
    html.classList.add(MOTION_CLASS);

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const dist = mobile ? 24 : 40;
    const splits: SplitText[] = [];
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        document
          .querySelectorAll<HTMLElement>("main [data-reveal]")
          .forEach((el) => reveal(el));
        document
          .querySelectorAll<HTMLElement>("main [data-count]")
          .forEach((el) => counter(el));
        if (!mobile) {
          document
            .querySelectorAll<HTMLElement>("main [data-parallax]")
            .forEach((el) => parallax(el));
        }
      });
      ScrollTrigger.refresh();
    };

    const reveal = (el: HTMLElement) => {
      const type = el.dataset.reveal;
      const delay = Number(el.dataset.revealDelay ?? 0);
      const st = { trigger: el, start: START, once: true };

      switch (type) {
        case "split": {
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          splits.push(split);
          gsap.set(split.lines, { yPercent: 105 });
          gsap.set(el, { autoAlpha: 1 });
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            delay,
            scrollTrigger: st,
            onComplete: () => split.revert(),
          });
          break;
        }
        case "stagger": {
          const items = Array.from(el.children);
          gsap.set(el, { autoAlpha: 1 });
          gsap.set(items, { autoAlpha: 0, y: dist, transition: "none" });
          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: EASE,
            stagger: 0.1,
            delay,
            scrollTrigger: st,
            clearProps: "opacity,visibility,transform,transition",
          });
          break;
        }
        case "curtain": {
          const img = el.querySelector(":scope > img");
          gsap.set(el, { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)" });
          const tl = gsap.timeline({ delay, scrollTrigger: st });
          tl.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "expo.inOut",
          });
          if (img) {
            tl.fromTo(
              img,
              { scale: 1.3 },
              { scale: el.dataset.parallax && !mobile ? 1.15 : 1, duration: 1.6, ease: "expo.out" },
              0,
            );
          }
          tl.set(el, { clearProps: "clipPath" });
          break;
        }
        case "line": {
          gsap.set(el, { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" });
          gsap.to(el, {
            scaleX: 1,
            duration: 1.2,
            ease: "expo.inOut",
            delay,
            scrollTrigger: st,
            clearProps: "transform",
          });
          break;
        }
        case "pop": {
          gsap.fromTo(
            el,
            { autoAlpha: 0, scale: 0 },
            { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)", delay, scrollTrigger: st },
          );
          break;
        }
        case "fade": {
          gsap.fromTo(
            el,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1, ease: "power2.out", delay, scrollTrigger: st },
          );
          break;
        }
        case "zoom": {
          gsap.fromTo(
            el,
            { autoAlpha: 0, scale: 1.18 },
            {
              autoAlpha: 1,
              scale: el.dataset.parallax && !mobile ? 1.1 : 1,
              duration: 1.8,
              ease: "expo.out",
              delay,
              scrollTrigger: st,
            },
          );
          break;
        }
        case "left": {
          gsap.fromTo(
            el,
            { autoAlpha: 0, x: -dist * 1.5 },
            { autoAlpha: 1, x: 0, duration: 0.9, ease: EASE, delay, scrollTrigger: st, clearProps: "transform" },
          );
          break;
        }
        default: {
          gsap.set(el, { transition: "none" });
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: dist },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: EASE,
              delay,
              scrollTrigger: st,
              clearProps: "transform,transition",
            },
          );
        }
      }
    };

    const counter = (el: HTMLElement) => {
      const text = el.textContent ?? "";
      const match = text.match(/\d+/);
      if (!match || match.index === undefined) return;
      const before = text.slice(0, match.index);
      const after = text.slice(match.index + match[0].length);
      const width = match[0].length;
      const target = Number(match[0]);
      const state = { value: 0 };
      const write = () => {
        el.textContent = `${before}${String(Math.round(state.value)).padStart(width, "0")}${after}`;
      };
      gsap.to(state, {
        value: target,
        duration: 1.4,
        ease: "power2.out",
        onStart: write,
        onUpdate: write,
        scrollTrigger: { trigger: el, start: START, once: true },
      });
    };

    const parallax = (el: HTMLElement) => {
      const speed = Number(el.dataset.parallax) || 8;
      const target = el.dataset.reveal === "curtain" ? el.querySelector(":scope > img") : el;
      if (!target) return;
      gsap.fromTo(
        target,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    };

    document.fonts.ready.then(() => {
      try {
        run();
      } catch (error) {
        html.classList.remove(MOTION_CLASS);
        console.error(error);
      }
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((split) => split.revert());
      html.classList.remove(MOTION_CLASS);
    };
  }, []);

  return <script dangerouslySetInnerHTML={{ __html: ADD_CLASS_SCRIPT }} />;
}
