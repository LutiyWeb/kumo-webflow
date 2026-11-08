import type { Metadata } from "next";
import Link from "next/link";
import { PageMotion } from "@/components/motion/PageMotion";

export const metadata: Metadata = {
  title: "Frontend Developer — Careers — Kumo",
  description: "Frontend developer position at KUMO Tech.",
};

const sections = [
  {
    title: "What you'll do",
    items: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
    ],
  },
  {
    title: "Requirements",
    items: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
    ],
  },
  {
    title: "Bonus Points for",
    items: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
    ],
  },
  {
    title: "Our offer",
    items: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m",
    ],
  },
];

export default function FrontendDeveloperPage() {
  return (
    <main className="vacancy" id="top">
      <PageMotion />
      <div className="container">
        <p className="vacancy__crumb" data-reveal="up">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/about">About Us</Link>
          {"  >  "}
          <Link href="/careers">Careers</Link>
          {"  >  Frontend Developer"}
        </p>
        <h1 className="vacancy__title" data-reveal="split" data-reveal-delay="0.1">Frontend developer</h1>

        <p className="vacancy__intro" data-reveal="up" data-reveal-delay="0.3">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus. Donec quam
          felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
          consequat massa quis enim. Donec pede justo, fringilla vel, aliquet
          nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a
        </p>

        <div className="vacancy__sections" data-reveal="stagger">
          {sections.map((section) => (
            <section key={section.title} className="vacancy__section">
              <h2 className="vacancy__section-title">{section.title}</h2>
              <ul className="vacancy__list">
                {section.items.map((item, idx) => (
                  <li key={idx} className="vacancy__item">
                    <span className="vacancy__dot" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <Link
          href="/careers/frontend-developer/respond"
          className="vacancy__respond"
        >
          Respond
        </Link>
      </div>
    </main>
  );
}
