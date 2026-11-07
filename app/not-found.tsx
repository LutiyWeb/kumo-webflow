import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="status-page status-page--404" id="top">
      <div className="container">
        <div className="status-page__box">
          <p className="status-page__code" aria-hidden="true">
            404
          </p>
          <h1 className="status-page__title">
            Oops... <span className="accent">Page not found</span>
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
      </div>
    </main>
  );
}
