"use client";

import { useEffect, useRef, useState } from "react";
import { streams } from "@/data/home";
import "swiper/css";

const pad = (n: number) => String(n).padStart(2, "0");

type CaseSlide = (typeof streams.slides)[number];

export function Streams() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [photo, setPhoto] = useState(0);
  const total = streams.slides.length;
  const openCase = streams.slides.find((slide) => slide.id === openId) ?? null;

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
      if (cancelled) return;

      swiper = new Swiper(root, {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 700,
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
        },
      });
    })();

    return () => {
      cancelled = true;
      swiper?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!openId) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const open = (id: string) => {
    setPhoto(0);
    setOpenId(id);
  };

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
              <article
                key={slide.id}
                className="swiper-slide streams__slide"
                onClick={() => open(slide.id)}
              >
                <div className="streams__slide-head">
                  <h3>{slide.title}</h3>
                  <span className="streams__divider" />
                  <div className="streams__copy">
                    <ul className="streams__tags">
                      {slide.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <p>{slide.summary}</p>
                    <button type="button" className="streams__more">
                      More
                    </button>
                  </div>
                </div>
                <img src={slide.images[0]} alt={slide.title} />
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
      {openCase ? (
        <CasePopup
          item={openCase}
          photo={photo}
          onPhoto={setPhoto}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </section>
  );
}

function CasePopup({
  item,
  photo,
  onPhoto,
  onClose,
}: {
  item: CaseSlide;
  photo: number;
  onPhoto: (index: number) => void;
  onClose: () => void;
}) {
  const count = item.images.length;
  const step = (delta: number) => onPhoto((photo + delta + count) % count);

  return (
    <div className="case-popup" onClick={onClose}>
      <div
        className="case-popup__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-popup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="case-popup__top">
          <div>
            <h3 id="case-popup-title">{item.title}</h3>
            <ul className="streams__tags">
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <button type="button" className="case-popup__close" aria-label="Close" onClick={onClose}>
            <span aria-hidden="true" />
          </button>
        </div>
        <p className="case-popup__text">{item.text}</p>
        <div className="case-popup__stage">
          <img src={item.images[photo]} alt={`${item.title}, photo ${photo + 1}`} />
          {count > 1 ? (
            <div className="case-popup__nav">
              <button type="button" aria-label="Previous photo" onClick={() => step(-1)}>
                <Arrow direction="prev" />
              </button>
              <button type="button" aria-label="Next photo" onClick={() => step(1)}>
                <Arrow direction="next" />
              </button>
              <p>
                {pad(photo + 1)} / {pad(count)}
              </p>
            </div>
          ) : null}
        </div>
        {item.demo ? (
          <a className="case-popup__demo" href={item.demo} target="_blank" rel="noreferrer">
            Demo
          </a>
        ) : null}
      </div>
    </div>
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
