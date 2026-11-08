import type { Metadata } from "next";
import Link from "next/link";
import { PageMotion } from "@/components/motion/PageMotion";

export const metadata: Metadata = {
  title: "Servers — Kumo",
  description:
    "KUMO servers designed to ease digital transformation of business operations.",
};

export default function ServersPage() {
  return (
    <main className="servers" id="top">
      <PageMotion />
      <div className="container">
        <p className="servers__crumb" data-reveal="up">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/products">Products</Link>
          {"  >  Servers"}
        </p>
        <h1 className="servers__title" data-reveal="split" data-reveal-delay="0.1">Servers</h1>
        <hr className="servers__rule" data-reveal="line" data-reveal-delay="0.3" />

        <section className="servers__intro">
          <h2 className="servers__heading" data-reveal="split" data-reveal-delay="0.3">
            KUMO servers designed{" "}
            <span className="accent accent--block">
              to ease digital transformation
            </span>
            of business operations
          </h2>
          <div className="servers__intro-right">
            <div className="servers__hero-media" data-reveal="up" data-reveal-delay="0.3">
              <span className="servers__glow" data-reveal="fade" data-reveal-delay="0.4" aria-hidden="true" />
              <img src="/products/servers/hero.png" alt="KUMO server racks" />
            </div>
            <hr className="servers__subrule" data-reveal="line" />
            <p className="servers__lead" data-reveal="up">
              <img
                className="servers__lead-arrow" data-reveal="left" data-reveal-delay="0.3"
                src="/team/arrow-white.svg"
                alt=""
              />
              An integrated approach to investing in&nbsp;the&nbsp;development of
              holistic IT infrastructure creates a&nbsp;&ldquo;quantum leap&rdquo;
              in technology development across the country.
            </p>
            <p className="servers__text">
              This approach is more efficient and cost-effective than one-time
              investments in separate technologies. By investing in advanced
              technologies, we preserve and increase the profitability of
              investors. Maintaining old technologies is an irreplaceable loss of
              capital.
            </p>
            <p className="servers__text">
              By creating new technologies and investing in modern solutions, we
              get a total reduction in the cost of ownership of these
              technologies, while obtaining an increase in return on investment
              (ROI).
            </p>
          </div>
        </section>

        <section className="servers__challenges">
          <h2 className="servers__challenges-title" data-reveal="split">
            Meet the challenges of
            <span className="accent accent--block">the digital age</span>
          </h2>
          <div className="servers__challenges-grid">
            <div className="servers__challenges-copy" data-reveal="stagger">
              <p className="servers__challenges-lead">
                KUMO servers provide exceptional workload-optimized performance
                and&nbsp;hardware security features
              </p>
              <div className="servers__racks-mobile">
                <img
                  src="/products/servers/racks.png"
                  alt="Engineers working in a server room"
                />
              </div>
              <p className="servers__text servers__text--narrow">
                KUMO servers are the most powerful and flexible solutions
                for&nbsp;data center organization in companies of any size
                regardless of industry and workload type.
              </p>
              <p className="servers__text">
                These systems include expandable floor-standing servers
                for&nbsp;remote and branch offices, universal rack servers,
                compact and scalable blade systems, and horizontal scalable
                servers supporting high density components.
              </p>
            </div>
            <div className="servers__racks" data-reveal="curtain" data-reveal-delay="0.2">
              <img
                src="/products/servers/racks.png"
                alt="Engineers working in a server room"
              />
            </div>
          </div>
        </section>

        <section className="servers__outro" data-reveal="stagger">
          <p className="servers__quote">
            <img
              className="servers__quote-arrow" data-reveal="left" data-reveal-delay="0.3"
              src="/team/arrow-gold.svg"
              alt=""
            />
            Whatever your computing challenges, you can solve them with KUMO
            solutions
          </p>
          <p className="servers__outro-text">
            The high quality of these systems is proven in practice,
            and&nbsp;the&nbsp;wide range of innovations applied and the highest
            efficiency allow to reduce operating costs and complexity
            of&nbsp;infrastructure, which expands the possibilities
            of&nbsp;everyday business operations and accelerates the process of
            obtaining a&nbsp;competitive advantage from the implementation
            of&nbsp;IT&nbsp;solutions.
          </p>
        </section>
      </div>
    </main>
  );
}
