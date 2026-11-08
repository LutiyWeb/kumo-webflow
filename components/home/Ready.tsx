"use client";

import { useState } from "react";
import { ready } from "@/data/home";

export function Ready() {
  const [sent, setSent] = useState(false);

  return (
    <section className="section ready" id="contact">
      <div className="container">
        <h2 className="section-title ready__title" data-reveal="split">
          {ready.title}{" "}
          <span className="accent accent--block">{ready.titleAccent}</span>
        </h2>
        <p className="lead ready__lead" data-reveal="up" data-reveal-delay="0.2">
          <img
            className="ready__arrow"
            data-reveal="left"
            data-reveal-delay="0.4"
            src="/team/arrow-gold.svg"
            alt=""
            width={70}
            height={21}
          />
          <span>{ready.lead}</span>
        </p>
        <form
          className="ready__grid"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <div className="ready__fields" data-reveal="stagger">
            <label className="ready__control">
              <input name="name" type="text" placeholder=" " required autoComplete="name" />
              <span>{ready.name}</span>
            </label>
            <label className="ready__control">
              <input name="email" type="email" placeholder=" " required autoComplete="email" />
              <span>{ready.email}</span>
            </label>
            <label className="ready__control">
              <input name="topic" type="text" placeholder=" " required />
              <span>{ready.topic}</span>
            </label>
            <p className="ready__note">
              {ready.noteBefore}
              <a href="#top">{ready.terms}</a>
              {ready.noteMid}
              <a href="#top">{ready.privacy}</a>
            </p>
          </div>
          <div className="ready__aside" data-reveal="stagger" data-reveal-delay="0.2">
            <label className="ready__control ready__control--area">
              <textarea name="message" placeholder=" " required />
              <span>{ready.message}</span>
            </label>
            <button className="ready__send" type="submit" disabled={sent}>
              {sent ? ready.sent : ready.send}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
