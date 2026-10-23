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

  const go = (next: number) => {
    setIndex((next + total) % total);
  };

  return (
    <section className="hero">
      <div className="hero__globe" data-hero-globe />
      <div className="container hero__content" data-hero-slider>
        <div className="hero__copy">
          <p className="hero__eyebrow">{slide.eyebrow}</p>
          <h1 className="hero__title">
            {slide.title}{" "}
            {slide.accent ? (
              <span className="accent accent--block">{slide.accent}</span>
            ) : null}
          </h1>
          {slide.text ? <p className="hero__subtitle">{slide.text}</p> : null}
          <a className="button-outline hero__cta" href="#top">
            {slide.cta}
          </a>
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
