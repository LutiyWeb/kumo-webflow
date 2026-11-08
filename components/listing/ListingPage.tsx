import Link from "next/link";
import type { ReactNode } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

export type ListingCard = {
  key?: string;
  title: ReactNode;
  text: ReactNode;
  image?: string;
  href?: string;
};

export function ListingPage({
  mark,
  pageTitle,
  hero,
  headline,
  lead,
  note,
  cards,
}: {
  mark: string;
  pageTitle: string;
  hero?: string;
  headline: ReactNode;
  lead: string;
  note: string;
  cards: ListingCard[];
}) {
  return (
    <main id="top">
      <PageMotion />
      <section className={hero ? "listing-hero" : "listing-hero listing-hero--plain"}>
        {hero ? <img className="listing-hero__photo" src={hero} alt="" data-reveal="zoom" data-parallax="5" /> : null}
        <p className="listing-mark" data-reveal="fade" data-reveal-delay="0.6">{mark}</p>
        <div className="container listing-hero__copy">
          <h1 data-reveal="split" data-reveal-delay="0.15">
            <span>Kumo</span>
            <span>{pageTitle}</span>
          </h1>
        </div>
      </section>
      <section className="listing">
        <div className="container">
          <h2 className="listing__title" data-reveal="split">{headline}</h2>
          <div className="listing__split" data-reveal="stagger" data-reveal-delay="0.2">
            <p className="listing__lead">{lead}</p>
            <p className="listing__note">{note}</p>
          </div>
          <div className="listing__grid" data-reveal="stagger">
            {cards.map((card, index) => {
              const key =
                card.key ?? (typeof card.title === "string" ? card.title : String(index));
              const inner = (
                <>
                  {card.image ? <img src={card.image} alt="" /> : null}
                  <div className="listing-card__body">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    <span className="listing-card__arrow" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </span>
                  </div>
                </>
              );

              if (card.href) {
                return (
                  <Link key={key} href={card.href} className="listing-card">
                    {inner}
                  </Link>
                );
              }

              return (
                <article key={key} className="listing-card" tabIndex={0}>
                  {inner}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
