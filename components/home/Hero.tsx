"use client";

import { useEffect, useState } from "react";
import { heroSlides } from "@/data/home";

export function Hero() {
  const [index, setIndex] = useState(0);
  const total = heroSlides.length;
  const slide = heroSlides[index];

  useEffect(() => {
    const node = document.querySelector<HTMLElement>("[data-hero-globe]");
    if (!node) return;
    let cancelled = false;
    import("../../src/hero-globe").then((mod) => {
      if (!cancelled) mod.mountHeroGlobe(node);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("kumo:morph", { detail: index === 1 ? 1 : 0 }),
    );
  }, [index]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % total);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [index, total]);

  const go = (next: number) => {
    setIndex((next + total) % total);
  };

  return (
    <section className="hero">
      <div className="hero__globe" data-hero-globe />
      <div className="container hero__content" data-hero-slider>
        <div className="hero__copy">
          <h1 className="hero__title">
            {slide.title}{" "}
            {slide.accent ? <span className="accent">{slide.accent}</span> : null}
          </h1>
          <p className="hero__subtitle">
            {slide.kicker} <span className="accent">{slide.kickerAccent}</span>{" "}
            {slide.kickerRest}
          </p>
        </div>
        <div className="hero__controls">
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
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
