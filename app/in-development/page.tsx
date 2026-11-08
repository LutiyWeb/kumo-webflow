import type { Metadata } from "next";
import Link from "next/link";
import { PageMotion } from "@/components/motion/PageMotion";

export const metadata: Metadata = {
  title: "In Development — Kumo",
  description: "This page is currently under construction.",
};

export default function InDevelopmentPage() {
  return (
    <main className="status-page status-page--dev" id="top">
      <PageMotion />
      <div className="container">
        <h1 className="status-page__headline" data-reveal="split">
          Page is
          <br />
          under <span className="accent">construction</span>
        </h1>
        <Link href="/" className="status-page__back" data-reveal="up" data-reveal-delay="0.5">
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
