"use client";

import Link from "next/link";
import { useState } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

const items = [
  { num: "01", title: "Digital strategy consulting (for CEO)" },
  { num: "02", title: "IT strategy consulting (for CIO)" },
  { num: "03", title: "Solution consulting for IT" },
  { num: "04", title: "Digital Transformation" },
  { num: "05", title: "Technology consulting" },
];

const description =
  "We create strategies that bring together a diversified IT landscape and make it work towards supporting existing business processes and driving new business initiatives.";

export default function ItConsultingPage() {
  const [openNum, setOpenNum] = useState<string | null>("02");

  return (
    <main className="consulting" id="top">
      <PageMotion />
      <div className="container">
        <p className="consulting__crumb" data-reveal="up">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/services">Services</Link>
          {"  >  IT Consulting"}
        </p>
        <h1 className="consulting__title" data-reveal="split" data-reveal-delay="0.1">IT Consulting</h1>
        <hr className="consulting__rule" data-reveal="line" data-reveal-delay="0.3" />

        <section className="consulting__hero">
          <div className="consulting__media">
            <span className="consulting__glow" data-reveal="fade" data-reveal-delay="0.4" aria-hidden="true" />
            <div className="consulting__photo" data-reveal="curtain" data-reveal-delay="0.3">
              <img
                src="/products-hover/consulting.jpg"
                alt="IT consulting specialists"
              />
            </div>
          </div>
          <h2 className="consulting__heading" data-reveal="split" data-reveal-delay="0.4">
            IT consulting <span className="accent">services</span> we offer
          </h2>
        </section>

        <section className="consulting__services">
          <p className="consulting__kicker" data-reveal="up">KUMO Services</p>
          <div className="consulting__accordion" data-reveal="stagger">
            {items.map((item) => {
              const open = openNum === item.num;
              return (
                <div
                  key={item.num}
                  className={
                    open
                      ? "consulting__item consulting__item--open"
                      : "consulting__item"
                  }
                >
                  <button
                    type="button"
                    className="consulting__trigger"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenNum((prev) => (prev === item.num ? null : item.num))
                    }
                  >
                    <span className="consulting__num">{item.num}</span>
                    <span className="consulting__item-title">{item.title}</span>
                    <span className="consulting__icon" aria-hidden="true" />
                  </button>
                  {open ? (
                    <p className="consulting__body">{description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
