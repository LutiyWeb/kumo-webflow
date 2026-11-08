"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

export default function RespondPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="vacancy vacancy--respond" id="top">
      <PageMotion />
      <div className="container">
        <p className="vacancy__crumb" data-reveal="up">
          <Link href="/">Home</Link>
          {"  >  "}
          <Link href="/about">About Us</Link>
          {"  >  "}
          <Link href="/careers">Careers</Link>
          {"  >  "}
          <Link href="/careers/frontend-developer">Frontend Developer</Link>
          <span className="vacancy__crumb-respond">{"  >  Respond"}</span>
        </p>
        <h1 className="vacancy__title" data-reveal="split" data-reveal-delay="0.1">Frontend developer</h1>

        <form className="respond-form" data-reveal="stagger" data-reveal-delay="0.3" onSubmit={handleSubmit}>
          <label className="respond-form__field respond-form__field--active">
            <span className="respond-form__floating">First Name</span>
            <input type="text" name="firstName" defaultValue="" required />
          </label>
          <label className="respond-form__field">
            <input type="text" name="lastName" placeholder="Last name" required />
          </label>
          <label className="respond-form__field">
            <input type="email" name="email" placeholder="E-mail" required />
          </label>
          <label className="respond-form__field">
            <input type="tel" name="phone" placeholder="Phone number" />
          </label>
          <label className="respond-form__field respond-form__field--area">
            <textarea
              name="about"
              placeholder="Tell us about yourself"
              rows={6}
            />
          </label>
          <label className="respond-form__field">
            <input type="url" name="resume" placeholder="Link to resume" />
          </label>
          <p className="respond-form__attach">
            Or{" "}
            <label className="respond-form__attach-link">
              Attach file
              <input type="file" name="resumeFile" hidden />
            </label>{" "}
            (up to 15 mb)
          </p>
          <label className="respond-form__field">
            <input type="url" name="social" placeholder="Link to social" />
          </label>
          <p className="respond-form__consent">
            Sending us a message means you’re okay with our{" "}
            <Link href="/in-development">Terms of Use</Link> and{" "}
            <Link href="/in-development">Privacy Policy</Link>
          </p>
          <button type="submit" className="respond-form__submit">
            {sent ? "Sent" : "Send"}
          </button>
        </form>
      </div>
    </main>
  );
}
