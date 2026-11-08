"use client";

import Link from "next/link";
import { useState } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

const points = [
  "We utilize advances technologies and approaches, while professionally applying and constantly developing our competencies in IoT, big data, machine learning, AI, image analysis, AR, DevOps/Continuous Delivery (CD).",
  "We know how to deal with complex enterprise IT landscapes that have evolved for decades. We’ve been accumulating the experience from multiple projects and learned the tricks to tame the systems of various nature and architectural patterns.",
  "We are flexible in terms of cooperation, being ready to cooperate with third-party vendors and deliver business value to the customers. If the customer’s needs and priorities change, we can adjust the responsibility scope on the go and adapt service timelines to the new context.",
  "We focus on TCO of the solutions we deliver and manage. We analyze how to optimize operational, maintenance, and other costs during a solution’s life cycle.",
];

const offerings = [
  { id: "development", label: "development", image: "/products-hover/software.jpg" },
  { id: "management", label: "management", image: "/products-hover/managed.jpg" },
  { id: "modernization", label: "Modernization", image: "/products-hover/application.jpg" },
  { id: "integration", label: "Integration", image: "/about/integration.png" },
  { id: "security", label: "Security Servicies", image: "/about/security.png" },
  { id: "testing", label: "Testing", image: "/products-hover/qa.jpg" },
];

export default function ApplicationServicesPage() {
  const [activeId, setActiveId] = useState("modernization");
  const activeItem =
    offerings.find((item) => item.id === activeId) ?? offerings[2];

  return (
    <main className="app-services" id="top">
      <PageMotion />
      <div className="container">
        <p className="app-services__crumb" data-reveal="up">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/services">Services</Link>
          {"  >  Application Services"}
        </p>

        <h1 className="app-services__title" data-reveal="split" data-reveal-delay="0.1">
          <span className="accent accent--block">Application</span>
          <span className="app-services__title-second">Services</span>
        </h1>

        <hr className="app-services__rule" data-reveal="line" data-reveal-delay="0.3" />

        <p className="app-services__lead" data-reveal="up" data-reveal-delay="0.4">
          <img
            className="app-services__lead-arrow" data-reveal="left" data-reveal-delay="0.3"
            src="/team/arrow-gold.svg"
            alt=""
          />
          Our concept of application services is outlined in the following
          points:
        </p>

        <section className="app-services__concept">
          <div className="app-services__media" data-reveal="up">
            <span className="app-services__glow" data-reveal="fade" data-reveal-delay="0.4" aria-hidden="true" />
            <img
              src="/products-hover/application.jpg"
              alt="Application services team"
            />
          </div>

          <ul className="app-services__points" data-reveal="stagger">
            {points.map((point) => (
              <li key={point} className="app-services__point">
                <svg
                  className="app-services__point-icon"
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
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="app-services__offer">
          <h2 className="app-services__offer-title" data-reveal="split">
            Application <span className="accent">services</span>
            <br />
            we offer
          </h2>

          <div className="app-services__showcase">
            <ul className="app-services__showcase-list" data-reveal="stagger">
              {offerings.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={
                        isActive
                          ? "app-services__showcase-btn is-active"
                          : "app-services__showcase-btn"
                      }
                      onMouseEnter={() => setActiveId(item.id)}
                      onClick={() => setActiveId(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="app-services__showcase-card" data-reveal="curtain" data-reveal-delay="0.2">
              <img src={activeItem.image} alt={activeItem.label} />
              <span className="app-services__showcase-overlay" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
