import Link from "next/link";
import { PageMotion } from "@/components/motion/PageMotion";

export default function NotFoundPage() {
  return (
    <main className="status-page status-page--404" id="top">
      <PageMotion />
      <div className="container">
        <div className="status-page__box">
          <p className="status-page__code" data-reveal="up" data-reveal-delay="0" aria-hidden="true">
            404
          </p>
          <h1 className="status-page__title" data-reveal="split" data-reveal-delay="0.2">
            Oops... <span className="accent">Page not found</span>
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
      </div>
    </main>
  );
}
