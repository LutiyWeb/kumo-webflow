import type { Metadata } from "next";
import Link from "next/link";
import { PageMotion } from "@/components/motion/PageMotion";

export const metadata: Metadata = {
  title: "5G Technology — Kumo",
  description:
    "5G is a transformational technology that provides increased speed, reduced latency and improved connectivity.",
};

const areas = [
  { num: "01", title: "Augmented Reality" },
  { num: "02", title: "Smart Phones" },
  { num: "03", title: "Laptops" },
  { num: "04", title: "Warables" },
  { num: "05", title: "Industrial IoT" },
  { num: "06", title: "Autonomous Vehicles" },
];

export default function FiveGSolutionPage() {
  return (
    <main className="fiveg-page" id="top">
      <PageMotion />
      <div className="container">
        <p className="fiveg-page__crumb" data-reveal="up">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/solutions">Solutions</Link>
          {"  >  5G"}
        </p>

        <h1 className="fiveg-page__title" data-reveal="split" data-reveal-delay="0.1">
          <span className="accent">5G</span> technology
        </h1>

        <hr className="fiveg-page__rule" data-reveal="line" data-reveal-delay="0.3" />

        <section className="fiveg-page__intro" data-reveal="stagger" data-reveal-delay="0.3">
          <p className="fiveg-page__lead">
            <img
              className="fiveg-page__lead-arrow"
              src="/team/arrow-white.svg"
              alt=""
            />
            5G is a transformational technology that provides increased speed,
            reduced latency and improved connectivity for smartphones
            everywhere.
          </p>

          <div className="fiveg-page__hero-media">
            <span className="fiveg-page__glow" aria-hidden="true" />
            <img src="/solutions/5g-hover.png" alt="5G technology" />
          </div>

          <p className="fiveg-page__copy">
            Current smartphone usage can take advantage of the increased speed,
            while brand new intensive computing games, XR and AI can be
            &ldquo;on the go&rdquo; based on experience. This makes it necessary
            to improve the performance of smartphones. KUMO helps prepare these
            5G devices with solutions based on its high-performance and
            efficient architecture.
          </p>
        </section>

        <section className="fiveg-page__innovations">
          <div className="fiveg-page__innovations-top">
            <h2 className="fiveg-page__innovations-title" data-reveal="split">
              Innovations <span className="accent">for new business</span>{" "}
              opportunities
            </h2>
            <div className="fiveg-page__innovations-media" data-reveal="curtain" data-reveal-delay="0.2">
              <img
                src="/solutions/smart-hover.png"
                alt="5G business opportunities"
              />
            </div>
          </div>

          <div className="fiveg-page__areas">
            <p className="fiveg-page__areas-tag" data-reveal="up">
              When the speed of light is not enough
            </p>
            <div className="fiveg-page__areas-right">
              <p className="fiveg-page__areas-lead" data-reveal="up">
                5G technology is widely used in the following areas:
              </p>
              <ul className="fiveg-page__areas-list" data-reveal="stagger">
                {areas.map((area) => (
                  <li key={area.num} className="fiveg-page__areas-item">
                    <span className="fiveg-page__areas-num">{area.num}</span>
                    <span className="fiveg-page__areas-name">{area.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="fiveg-page__approach">
          <h2 className="fiveg-page__approach-title" data-reveal="split">
            KUMO <span className="accent">approach</span>
          </h2>
          <hr className="fiveg-page__approach-rule" data-reveal="line" />

          <div className="fiveg-page__approach-grid">
            <div className="fiveg-page__approach-left" data-reveal="stagger">
              <p className="fiveg-page__approach-lead">
                Our societies and cities are faced with the challenges of
                improving security, energy efficiency, effectiveness of
                transportation and quality of living.
              </p>
              <p className="fiveg-page__approach-text">
                There is a growing need for a new generation service
                infrastructure that provides a digital ecosystem in smart cities
                and enables the development of smart city infrastructure and
                services, thereby opening novel service and business
                opportunities for companies and new micro-operators.
              </p>
            </div>

            <div className="fiveg-page__approach-right">
              <div className="fiveg-page__approach-media" data-reveal="curtain">
                <img
                  src="/solutions/big-data-hover.png"
                  alt="Smart city 5G network"
                />
              </div>
              <hr className="fiveg-page__approach-subrule" data-reveal="line" />
              <p className="fiveg-page__approach-text">
                Current mobile networks will soon be insufficient to serve the
                increasing number of users of bandwidth-intensive digital
                services. This bottleneck threatens the realization of important
                smart city digital services, which will require an effective and
                reliable telecommunications network for connection and
                distribution.
              </p>
            </div>
          </div>

          <div className="fiveg-page__bottom">
            <div className="fiveg-page__bottom-media" data-reveal="curtain">
              <img
                src="/solutions/vision-hover.png"
                alt="5G proof-of-concept prototypes"
              />
            </div>
            <div className="fiveg-page__bottom-copy" data-reveal="stagger" data-reveal-delay="0.2">
              <p className="fiveg-page__bottom-lead">
                <svg
                  className="fiveg-page__bottom-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10.5L8 15.5L17 5.5"
                    stroke="var(--accent)"
                    strokeWidth="2"
                  />
                </svg>
                <span>
                  KUMO has been investigating the technological opportunities
                  and economic feasibility of the digital ecosystem, by
                  developing proof-of-concept prototypes and demonstrating
                  concrete technical solutions for 5G infrastructure.
                </span>
              </p>
              <p className="fiveg-page__bottom-text">
                The project will make big data capacity available and provide an
                open access platform for new digital services – both for
                technology and business.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
