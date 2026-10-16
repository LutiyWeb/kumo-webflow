import type { Metadata } from "next";
import { Management } from "@/components/team/Management";

export const metadata: Metadata = {
  title: "Our Team — Kumo",
  description:
    "Meet the KUMO Tech managers who oversee our commitments to our clients.",
};

const arrow = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const projects = [
  {
    name: "NS8",
    logo: "/team/ns8.svg",
    width: 147,
    height: 60,
    text: "End-to-end protection platform, that combines advanced data analytics with real-time scoring to outsmart threats and approve more orders",
  },
  {
    name: "Shevirah",
    logo: "/team/shevirah.png",
    width: 138,
    height: 60,
    text: "The technology that can measure the whole security posture of an enterprise’s mobility program: the users, the device, the applications, and the infrastructure",
  },
  {
    name: "Central Bank Data Center",
    note: "(Russia)",
    logo: "/team/cbr.svg",
    width: 170,
    height: 49,
    text: "Data Center for Central Bank of Russia",
  },
  {
    name: "Information Security Systems",
    logo: "/team/fifa.png",
    width: 130,
    height: 82,
    text: "Information Security Systems for FIFA World Cup 2018 Russia",
  },
  {
    name: "Runsafesecurity",
    logo: "/team/runsafesecurity.svg",
    width: 170,
    height: 54,
    text: "Cyber defence tool that protects full range of in-house, open source, and third-party code",
  },
];

export default function OurTeamPage() {
  return (
    <main className="team">
      <div className="container">
        <p className="team-kicker">Our Team</p>
        <p className="team-lead team-lead--marked">
          <img className="team-lead__arrow" src="/team/arrow-white.svg" alt="" />
          The <span className="accent">KUMO Tech</span>{" "}
          <span className="accent">team</span> is able to provide the whole world
          with technologies that allow enterprises to{" "}
          <span className="team-em">work more efficiently</span>.
        </p>
        <p className="team-lead">
          Our team brings unique knowledge in the field, operational information,
          customer contacts and work experience. We use our collective networks
          and expertise to help our founders with an optimal strategy for market
          entry, products and recruitment.
        </p>

        <div className="team-head">
          <h2 className="team-title">
            Management <span>team</span>
          </h2>
          <p className="team-aside">
            <img src="/team/arrow-gold.svg" alt="" />
            Meet the company&apos;s managers who oversee our commitments to our
            clients.
          </p>
        </div>

        <Management />

        <h2 className="team-title team-title--projects">
          Team <span>projects</span>
        </h2>
        <div className="team-projects">
          {projects.map((project) => (
            <article key={project.name} className="team-project">
              <img
                className="team-project__logo"
                src={project.logo}
                alt=""
                width={project.width}
                height={project.height}
              />
              <div>
                <h3>
                  {project.name} {project.note ? <span>{project.note}</span> : null}
                </h3>
                <p>{project.text}</p>
              </div>
              <button type="button" className="team-project__visit">
                Visit website
                <span className="team-project__arrow">{arrow}</span>
              </button>
            </article>
          ))}
        </div>
        <button type="button" className="team-more">
          Load More projects
        </button>
      </div>
    </main>
  );
}
