import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "In Development — Kumo",
  description: "This page is currently under construction.",
};

export default function InDevelopmentPage() {
  return (
    <main className="status-page status-page--dev" id="top">
      <div className="container">
        <h1 className="status-page__headline">
          Page is
          <br />
          under <span className="accent">construction</span>
        </h1>
        <Link href="/" className="status-page__back">
          <img
            className="status-page__arrow"
            src="/team/arrow-gold.svg"
            alt=""
          />
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}
