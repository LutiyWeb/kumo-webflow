import type { ReactNode } from "react";
import Link from "next/link";

const arrow = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const work = [
  {
    num: "01",
    title: (
      <>
        Harness the power of emerging technologies.{" "}
        <span className="about-em">And unleash it.</span>
      </>
    ),
    text: "AI, IoT, 5G and Edge let you innovate with data in ways that have created a sea change of opportunity across every type of business; from autonomous vehicles to tele-medicine.",
    image: "/about/emerging.png",
    alt: "A person standing in a blue-lit corridor",
    cta: "Explore Emerging Technologies",
  },
  {
    num: "02",
    title: (
      <>
        Professional integration solutions{" "}
        <span className="about-em">for applications and systems</span>
      </>
    ),
    text: "Now more than ever, organizations need to be digital, data-based, working in a multicloud world.",
    image: "/about/integration.png",
    alt: "A person working at a desk with several monitors",
    wide: true,
    cta: "Explore IT Integration",
  },
  {
    num: "03",
    title: (
      <>
        Survival of <span className="about-em">the fastest</span>
      </>
    ),
    text: "Modernize IT infrastructure to enable new, high-value business capabilities.",
    image: "/about/fastest.png",
    alt: "An automated warehouse with tall storage racks",
    flip: true,
    blend: true,
    cta: "Explore IT Transformation",
  },
  {
    num: "04",
    title: (
      <>
        Security <span className="about-em">accelerates innovation</span>
      </>
    ),
    text: "Start viewing security as an extension of your business so you can focus on innovation.",
    image: "/about/security.png",
    alt: "Program code on a screen",
    wide: true,
    flip: true,
    cta: "Explore Security Transformation",
  },
];

const links: { title: string; text: string }[] = [
  {
    title: "Our Team",
    text: "Meet the company's managers who oversee our commitments to our clients.",
  },
  {
    title: "KUMO Group",
    text: "The Digital Future is where human progress is transformed by technology.",
  },
  {
    title: "Social Impact",
    text: "We advance sustainability, cultivate inclusion and transform lives with technology.",
  },
  {
    title: "Newsroom",
    text: "See KUMO TECH latest news.",
  },
  {
    title: "Careers",
    text: "Here at KUMO Tech, there are endless challenges and rewards",
  },
  {
    title: "Contact us",
    text: "We are always in touch and ready to provide you with advice, assistance and support.",
  },
];

function WorkRow({
  num,
  title,
  text,
  image,
  alt,
  wide,
  flip,
  blend,
  cta,
}: {
  num: string;
  title: ReactNode;
  text: string;
  image: string;
  alt: string;
  wide?: boolean;
  flip?: boolean;
  blend?: boolean;
  cta: string;
}) {
  const media = (
    <div className={blend ? "about-row__media about-row__media--blend" : "about-row__media"}>
      <img src={image} alt={alt} />
      <span className="about-row__cta">{cta}</span>
    </div>
  );

  return (
    <article
      className={
        "about-row" + (wide ? " about-row--wide" : "") + (flip ? " about-row--flip" : "")
      }
      tabIndex={0}
    >
      {flip ? media : null}
      <p className="about-row__num">{num}</p>
      <div className="about-row__copy">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      {flip ? null : media}
    </article>
  );
}

export default function AboutPage() {
  return (
    <main id="top">
      <section className="about-hero">
        <img className="about-hero__photo" src="/about/hero.png" alt="" />
        <p className="listing-mark">About us</p>
        <div className="container">
          <p className="about-crumb">
            <Link href="/">Home</Link>
            {" > "}
            About Us
          </p>
          <h1>About US</h1>
        </div>
      </section>
      <section className="about-body">
        <div className="container">
          <h2 className="about-strategy">
            Listening, learning,
            <br />
            <span className="accent">creating is our strategy</span>
          </h2>
          <div className="about-split">
            <p className="about-lead">
              KUMO TECH helps to create new opportunities for innovation and
              growth in enterprises and government projects as well as to
              succeed in competition.
            </p>
            <div>
              <p className="about-note">
                We strive to help each customer become a better business. KUMO
                TECH is at the heart of the modern technological revolution.
                That&apos;s why our global reach enables organizations to
                achieve meaningful business results in order to realize their
                goals and generate additional profits through innovation.
              </p>
              <p className="about-note">
                Through our extensive international relationships, we connect
                people and information to find solutions to current global
                challenges. Together we can transform industries, develop
                economies, lift society and support the environment.
              </p>
            </div>
          </div>
          <h2 className="about-do">
            What <span className="accent">we do</span>
          </h2>
          <div className="about-rows">
            {work.map((item) => (
              <WorkRow key={item.num} {...item} />
            ))}
          </div>
          <h2 className="about-more">
            Want to know <span className="accent">more</span>?
          </h2>
          <div className="about-links">
            {links.map((item) => (
              <article key={item.title} className="about-link" tabIndex={0}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="about-link__arrow">{arrow}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
