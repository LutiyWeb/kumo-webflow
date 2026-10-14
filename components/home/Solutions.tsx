import { solutions } from "@/data/home";

export function Solutions() {
  return (
    <section className="section section--dark">
      <div className="container">
        <h2 className="section-title solutions__title">
          {solutions.title}{" "}
          <span className="accent accent--block">{solutions.titleAccent}</span>
        </h2>
        <div className="solutions__row">
          <div className="solutions__media">
            <img src={solutions.image} alt={solutions.alt} />
            <span className="solutions__ring" aria-hidden="true" />
          </div>
          <div className="solutions__body">
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
