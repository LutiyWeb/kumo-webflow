"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { heroSlides } from "@/data/home";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Hero() {
  const [index, setIndex] = useState(0);
  const copyRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);
  const leaving = useRef(false);
  const total = heroSlides.length;
  const slide = heroSlides[index];

  useEffect(() => {
    const node = document.querySelector<HTMLElement>("[data-hero-globe]");
    if (!node) return;
    let alive = true;
    const modPromise = import("../../src/hero-globe");
    modPromise.then((mod) => {
      if (!alive) return;
      mod.mountHeroGlobe(node);
    });
    return () => {
      alive = false;
      modPromise.then((mod) => mod.unmountHeroGlobe());
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("kumo:morph", { detail: index === 1 ? 1 : 0 }),
    );
  }, [index]);

  // Entrance of the current slide copy (and the controls on first load)
  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy || reducedMotion()) return;
    const first = firstRun.current;
    firstRun.current = false;

    const ctx = gsap.context(() => {
      const eyebrow = copy.querySelector<HTMLElement>(".hero__eyebrow");
      const lines = copy.querySelectorAll(".hero__line");
      const rest = copy.querySelectorAll(".hero__subtitle, .hero__cta");
      const chars = eyebrow?.textContent?.length ?? 20;

      gsap.set(copy.children, { autoAlpha: 1 });
      const tl = gsap.timeline({ delay: first ? 0.25 : 0.05 });

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: Math.min(chars * 0.025, 1.1),
            ease: `steps(${chars})`,
            clearProps: "clipPath",
          },
          0,
        );
      }
      tl.fromTo(
        lines,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.14 },
        0.2,
      );
      tl.fromTo(
        rest,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 },
        0.55,
      );
    }, copy);

    return () => ctx.revert();
  }, [index]);

  // Controls appear once, after the first slide copy
  useLayoutEffect(() => {
    const controls = controlsRef.current;
    if (!controls || reducedMotion()) return;
    const tween = gsap.fromTo(
      controls,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.1, clearProps: "transform" },
    );
    return () => {
      tween.kill();
      gsap.set(controls, { autoAlpha: 1 });
    };
  }, []);

  const go = (next: number) => {
    const target = (next + total) % total;
    if (target === index || leaving.current) return;
    const copy = copyRef.current;
    if (!copy || reducedMotion()) {
      setIndex(target);
      return;
    }
    leaving.current = true;
    gsap.to(copy.children, {
      autoAlpha: 0,
      y: -20,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.04,
      onComplete: () => {
        leaving.current = false;
        setIndex(target);
      },
    });
  };

  return (
    <section className="hero">
      <div className="hero__globe" data-hero-globe />
      <div className="container hero__content" data-hero-slider>
        <div className="hero__copy" key={slide.id} ref={copyRef}>
          <p className="hero__eyebrow">{slide.eyebrow}</p>
          <h1 className="hero__title">
            <span className="hero__mask">
              <span className="hero__line">{slide.title}</span>
            </span>
            {slide.accent ? (
              <span className="hero__mask">
                <span className="hero__line accent accent--block">
                  {slide.accent}
                  <span className="hero__caret" aria-hidden="true">
                    _
                  </span>
                </span>
              </span>
            ) : null}
          </h1>
          {slide.text ? <p className="hero__subtitle">{slide.text}</p> : null}
          <a className="button-outline hero__cta" href="#top">
            {slide.cta}
          </a>
        </div>
        <div className="hero__controls" ref={controlsRef}>
          <button
            type="button"
            className="hero__arrow"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          />
          <button
            type="button"
            className="hero__arrow hero__arrow--next"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          />
          <div className="hero__dots">
            {heroSlides.map((item, dot) => (
              <button
                key={item.id}
                type="button"
                className={
                  dot === index ? "hero__dot w-slider-dot w-active" : "hero__dot w-slider-dot"
                }
                aria-label={`Slide ${dot + 1}`}
                aria-current={dot === index ? "true" : undefined}
                onClick={() => go(dot)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
