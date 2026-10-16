"use client";

import { useState, type ReactNode } from "react";

const arrow = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

function biography(): ReactNode {
  return (
    <>
      <div className="team-person__main">
        <img
          className="team-person__photo"
          src="/team/sheikh.png"
          alt="Sheikh Jamaluddin S.S."
        />
        <div className="team-person__social">
          <button type="button" className="team-social" aria-label="Twitter">
            <img src="/team/twitter.svg" alt="" width={40} height={40} />
          </button>
          <button type="button" className="team-social" aria-label="LinkedIn">
            <img src="/team/linkedin.svg" alt="" width={40} height={40} />
          </button>
        </div>
      </div>
      <div className="team-person__copy">
        <p>
          <span className="team-em">Experienced GR director</span>, involved in
          local and state government affairs. Maintains and nurtures
          relationships with government, associated authorities and committees
          for the sake of improvement and development of Malaysia. All the
          efforts of Sheikh Jamaluddin S.S. towards implementation of advanced
          IT technologies in Malaysia are based on his infinite loyalty and
          love to his country.
        </p>
        <p>
          <span className="team-em">VC and founder</span> with track record of
          helping founders build shareholder value as a Board Member and
          operating roles such as CFO, Sheikh Jamaluddin S.S. leverages his
          financial and entrepreneurial experience to help entrepreneurs in
          Asian market expand and grow, benefiting community and state. He can
          be referred to as an innovator and technology leader, providing the
          essential infrastructure for organizations to build their digital
          future, transform IT and protect their most important information.
        </p>
        <p>
          His ambitious goals, focus on execution and analytical abilities
          enable him to create reliable and value-added relation with
          entrepreneurs.
        </p>
        <p>
          Has <span className="team-em">successful experience</span> in General
          Management, Commercial P&amp;L Management, Customer Insight &amp;
          Customer Experience, Partnership Management, Deal Negotiation &amp;
          Business Development, Product Distribution Strategy, Brand Strategy,
          Tender Management, Data management, Data monetization, Insurance
          Assessment (High-Risk Insurance Strategy).
        </p>
        <div className="team-roles">
          <p>
            <strong>Founder/General Management</strong> at “Nationwide Travel
            and Tours”
          </p>
          <p>
            <strong>CEO and Shareholder</strong> at “iBrandMkrs”
          </p>
        </div>
      </div>
    </>
  );
}

const people: {
  name: string;
  caps?: boolean;
  summary: string;
  body: ReactNode;
}[] = [
  {
    name: "Sheikh Jamaluddin S.S.",
    caps: true,
    summary:
      "15+ years in business leadership, GR director, founder, entrepreneur, shareholder, investor, advisor",
    body: biography(),
  },
  {
    name: "Dmitry Dain",
    summary:
      "20+ years successfully delivering ground-breaking products and technologies",
    body: biography(),
  },
  {
    name: "Michael W. Wellman",
    summary:
      "30+ years successfully delivering new technologies and market-defining products",
    body: biography(),
  },
  {
    name: "Michail Alexandrov",
    summary: "35+ years successfully delivering new technologies",
    body: biography(),
  },
];

export function Management() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="team-people">
      {people.map((person) => {
        const expanded = open === person.name;
        return (
          <article
            key={person.name}
            className={expanded ? "team-person is-open" : "team-person"}
          >
            <button
              type="button"
              className="team-person__bar"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : person.name)}
            >
              <h3 className={person.caps ? "is-caps" : undefined}>{person.name}</h3>
              <p>{person.summary}</p>
              <span className="team-person__arrow">{arrow}</span>
            </button>
            {expanded && person.body ? (
              <div className="team-person__body">{person.body}</div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
