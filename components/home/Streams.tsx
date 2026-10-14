"use client";

import { useEffect, useRef, useState } from "react";
import { streams } from "@/data/home";

const pad = (n: number) => String(n).padStart(2, "0");

export function Streams() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const total = streams.slides.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let swiper: { destroy: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Swiper }, { Navigation }] = await Promise.all([
        import("swiper"),
        import("swiper/modules"),
      ]);
      await import("swiper/css");
      if (cancelled) return;

      const tail = () =>
        root.clientWidth -
        (root.querySelector<HTMLElement>(".swiper-slide")?.offsetWidth ?? 0);

      swiper = new Swiper(root, {
        modules: [Navigation],
        slidesPerView: "auto",
        spaceBetween: 20,
        breakpoints: { 768: { spaceBetween: 65 } },
        speed: 700,
        slidesOffsetAfter: tail(),
        navigation: {
          prevEl: "[data-streams-prev]",
          nextEl: "[data-streams-next]",
        },
        on: {
          init(instance) {
            setCurrent(instance.activeIndex + 1);
          },
          slideChange(instance) {
            setCurrent(instance.activeIndex + 1);
          },
          resize(instance) {
            instance.params.slidesOffsetAfter = tail();
            instance.update();
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      swiper?.destroy();
    };
  }, []);

  return (
    <section className="section section--light" id="streams">
      <div className="container">
        <div className="streams__head">
          <h2 className="section-title streams__title">{streams.title}</h2>
          <div className="streams__nav">
            <button
              type="button"
              className="streams__arrow"
              data-streams-prev
              aria-label="Previous slide"
            >
              <Arrow direction="prev" />
            </button>
            <button
              type="button"
              className="streams__arrow"
              data-streams-next
              aria-label="Next slide"
            >
              <Arrow direction="next" />
            </button>
          </div>
        </div>
        <div className="streams__line" />
        <div className="swiper streams__swiper" ref={rootRef}>
          <div className="swiper-wrapper">
            {streams.slides.map((slide) => (
              <article key={slide.title} className="swiper-slide streams__slide">
                <div className="streams__slide-head">
                  <h3>{slide.title}</h3>
                  <span className="streams__divider" />
                  <p>{slide.text}</p>
                </div>
                <img src={slide.image} alt={slide.alt} />
              </article>
            ))}
          </div>
        </div>
        <div className="streams__footer">
          <div className="streams__progress">
            <span style={{ transform: `scaleX(${current / total})` }} />
          </div>
          <p className="streams__counter">
            {pad(current)} / {pad(total)}
          </p>
        </div>
      </div>
    </section>
  );
}

function Arrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" />
      {direction === "prev" ? (
        <path d="M22 12l-8 8 8 8M14 20h16" stroke="currentColor" strokeWidth="2" />
      ) : (
        <path d="M18 12l8 8-8 8M12 20h16" stroke="currentColor" strokeWidth="2" />
      )}
    </svg>
  );
}
