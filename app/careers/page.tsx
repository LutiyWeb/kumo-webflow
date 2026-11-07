"use client";

import Link from "next/link";
import { useState } from "react";

const developerRoles = [
  {
    title: "Frontend developer",
    href: "/careers/frontend-developer",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Backend developer",
    href: "/careers/frontend-developer",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "iOS developer",
    href: "/careers/frontend-developer",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Android developer",
    href: "/careers/frontend-developer",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Python developer",
    href: "/careers/frontend-developer",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const departments = [
  { id: "finance", title: "Finance", roles: developerRoles.slice(0, 2) },
  { id: "developers", title: "Developers", roles: developerRoles },
  { id: "dept-3", title: "Lorem ipsum", roles: developerRoles.slice(0, 3) },
  { id: "dept-4", title: "Lorem ipsum", roles: developerRoles.slice(0, 2) },
  { id: "dept-5", title: "Lorem ipsum", roles: developerRoles.slice(0, 3) },
  { id: "dept-6", title: "Lorem ipsum", roles: developerRoles.slice(0, 2) },
];

export default function CareersPage() {
  const [openId, setOpenId] = useState<string | null>("developers");

  return (
    <main className="careers" id="top">
      <div className="container">
        <p className="careers__crumb">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/about">About Us</Link>
          {"  >  Careers"}
        </p>

        <p className="careers__eyebrow">Careers</p>

        <h1 className="careers__title">
          <img
            className="careers__title-arrow"
            src="/team/arrow-white.svg"
            alt=""
          />
          Here at KUMO Tech, there are endless{" "}
          <span className="accent">challenges and rewards</span>
        </h1>

        <div className="careers__hero-media">
          <span className="careers__glow" aria-hidden="true" />
          <img
            src="https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac3e6e8cde6b5609994d6ac_solutions-team.jpg"
            alt="KUMO Tech team collaborating"
          />
        </div>

        <h2 className="careers__statement">
          Opportunities across the globe. A team fueled by collaboration. A
          culture that{" "}
          <span className="accent">fosters innovation and values</span> a
          diverse and inclusive workplace.
        </h2>

        <p className="careers__quote">
          <img
            className="careers__quote-arrow"
            src="/team/arrow-gold.svg"
            alt=""
          />
          We’re made up of strong, smart people dedicated to doing their best
          work and driving success for our customers.
        </p>

        <div className="careers__accordion">
          {departments.map((dept) => {
            const isOpen = openId === dept.id;
            return (
              <div
                key={dept.id}
                className={
                  isOpen ? "careers__dept is-open" : "careers__dept"
                }
              >
                <button
                  type="button"
                  className="careers__dept-head"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenId((current) =>
                      current === dept.id ? null : dept.id,
                    )
                  }
                >
                  <span className="careers__dept-name">{dept.title}</span>
                  <span className="careers__dept-icon" aria-hidden="true" />
                </button>

                {isOpen && (
                  <div className="careers__dept-body">
                    <div className="careers__roles">
                      {dept.roles.map((role) => (
                        <Link
                          key={role.title}
                          href={role.href}
                          className="careers__role"
                        >
                          <h3 className="careers__role-title">{role.title}</h3>
                          <p className="careers__role-text">{role.text}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
