"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page" id="top">
      <section className="contact-hero">
        <div
          className="contact-hero__bg"
          style={{ backgroundImage: 'url("/about/hero.png")' }}
        />
        <div className="contact-hero__overlay" />
        <div className="contact-hero__mark" aria-hidden="true">
          <span className="contact-hero__mark-text">About us</span>
          <span className="contact-hero__mark-line" />
        </div>
        <div className="container contact-hero__inner">
          <p className="contact-hero__crumb">
            <Link href="/">Home</Link>
            {"  >  "}
            <Link href="/about">About Us</Link>
            {"  >  Contact Us"}
          </p>
          <h1 className="contact-hero__title">
            Contact <span className="accent">US</span>
          </h1>
        </div>
      </section>

      <section className="contact-body">
        <div className="container">
          <h2 className="contact-body__heading">
            Have a <span className="accent">question?</span>
          </h2>
          <p className="contact-body__lead">
            <img
              className="contact-body__lead-arrow"
              src="/team/arrow-gold.svg"
              alt=""
            />
            We are always in touch and ready to provide you with advice,
            assistance and support
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__left">
              <div className="contact-form__field contact-form__field--notched">
                <label className="contact-form__legend" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className="contact-form__input"
                />
              </div>

              <div className="contact-form__field">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="E-mail"
                  aria-label="E-mail"
                  className="contact-form__input"
                />
              </div>

              <div className="contact-form__field">
                <input
                  id="contact-topic"
                  name="topic"
                  type="text"
                  placeholder="Topic"
                  aria-label="Topic"
                  className="contact-form__input"
                />
              </div>

              <p className="contact-form__consent contact-form__consent--desktop">
                Sending us a message means you’re okay with our{" "}
                <a href="#top" className="contact-form__policy">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="#top" className="contact-form__policy">
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className="contact-form__right">
              <div className="contact-form__field contact-form__field--textarea">
                <textarea
                  id="contact-message"
                  name="message"
                  rows={7}
                  placeholder="Text your message here"
                  aria-label="Text your message here"
                  className="contact-form__textarea"
                />
              </div>

              <p className="contact-form__consent contact-form__consent--mobile">
                Sending us a message means you’re okay with our{" "}
                <a href="#top" className="contact-form__policy">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="#top" className="contact-form__policy">
                  Privacy Policy
                </a>
              </p>

              <button type="submit" className="contact-form__submit">
                {submitted ? "Sent" : "Send"}
              </button>
            </div>
          </form>

          <hr className="contact-body__rule" />

          <h2 className="contact-body__company">
            Kumo Tech, <span className="accent">LLC</span>
          </h2>

          <div className="contact-info">
            <div className="contact-info__item">
              <svg
                className="contact-info__icon"
                width="31"
                height="40"
                viewBox="0 0 31 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15.38 1C7.44 1 1 7.44 1 15.38C1 25.92 15.38 38.5 15.38 38.5C15.38 38.5 29.77 25.92 29.77 15.38C29.77 7.44 23.33 1 15.38 1ZM15.38 20.5C12.55 20.5 10.26 18.21 10.26 15.38C10.26 12.55 12.55 10.26 15.38 10.26C18.21 10.26 20.5 12.55 20.5 15.38C20.5 18.21 18.21 20.5 15.38 20.5Z"
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
              </svg>
              <p className="contact-info__text contact-info__text--address">
                9296 SUMMER LAKE BLVD
                <br />
                Manassas, VIRGINIA 20110
              </p>
            </div>

            <div className="contact-info__item">
              <svg
                className="contact-info__icon"
                width="40"
                height="31"
                viewBox="0 0 40 31"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="38"
                  height="28.67"
                  rx="2"
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
                <path
                  d="M2 2L20 17L38 2"
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
              </svg>
              <a
                href="mailto:support@kumotech.io"
                className="contact-info__text"
              >
                support@kumotech.io
              </a>
            </div>

            <div className="contact-info__item">
              <svg
                className="contact-info__icon"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M36.5 28.8V34.2C36.5 35.7 35.2 37 33.7 36.9C15.9 35.6 2.4 22.1 1.1 4.3C1 2.8 2.3 1.5 3.8 1.5H9.2C10.5 1.5 11.7 2.5 11.9 3.8C12.2 5.7 12.7 7.5 13.4 9.2C13.8 10.2 13.5 11.4 12.7 12.2L9.9 15C12.8 20.2 17.1 24.5 22.3 27.4L25.1 24.6C25.9 23.8 27.1 23.5 28.1 23.9C29.8 24.6 31.6 25.1 33.5 25.4C34.8 25.6 36.5 27.5 36.5 28.8Z"
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
              </svg>
              <a href="tel:+15713484601" className="contact-info__text">
                +1-571-348-4601
              </a>
            </div>
          </div>

          <div className="contact-map" aria-label="Kumo Tech location map">
            <div className="contact-map__canvas">
              <span className="contact-map__grid" aria-hidden="true" />
              <span className="contact-map__label">Manassas, VA</span>
              <svg
                className="contact-map__pin"
                width="20"
                height="32"
                viewBox="0 0 20 32"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 0C4.48 0 0 4.48 0 10C0 17.5 10 32 10 32C10 32 20 17.5 20 10C20 4.48 15.52 0 10 0ZM10 13.5C8.07 13.5 6.5 11.93 6.5 10C6.5 8.07 8.07 6.5 10 6.5C11.93 6.5 13.5 8.07 13.5 10C13.5 11.93 11.93 13.5 10 13.5Z"
                  fill="var(--accent)"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
