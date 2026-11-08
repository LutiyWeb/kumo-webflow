import { solutions } from "@/data/home";

export function Solutions() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title solutions__title" data-reveal="split">
          {solutions.title}{" "}
          <span className="accent accent--block">{solutions.titleAccent}</span>
        </h2>
        <div className="solutions__row">
          <div className="solutions__media" data-reveal="curtain" data-parallax="6">
            <img src={solutions.image} alt={solutions.alt} />
            <span className="solutions__ring" aria-hidden="true" data-reveal="pop" data-reveal-delay="0.6" />
          </div>
          <div className="solutions__body" data-reveal="stagger" data-reveal-delay="0.3">
            <p className="lead lead--bold">{solutions.lead}</p>
            <p className="lead solutions__note">{solutions.note}</p>
            <a className="button-outline" href="#streams">
              {solutions.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
