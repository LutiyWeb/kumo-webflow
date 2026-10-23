import { looking } from "@/data/home";

export function Looking() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title looking__title">
          {looking.title} <span className="accent">{looking.titleAccent}</span>
        </h2>
        <p className="lead looking__lead">{looking.lead}</p>
        <div className="looking__cards">
          {looking.cards.map((card) => (
            <article
              key={card.title}
              className={card.open ? "card card--open" : "card"}
              tabIndex={0}
            >
              {card.badge ? <span className="card__badge">{card.badge}</span> : null}
              <h3 className="card__title">{card.title}</h3>
              <p className="card__price">{card.price}</p>
              <div className="card__details">
                <div className="card__details-inner">
                  <p className="card__meta">{card.meta}</p>
                  <ul className="card__features">
                    {card.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <a className="card__cta" href="#top">
                    {card.cta}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
