import { looking } from "@/data/home";

export function Looking() {
  return (
    <section className="section section--dark">
      <div className="container">
        <h2 className="section-title looking__title">
          {looking.title} <span className="accent">{looking.titleAccent}</span>
        </h2>
        <p className="lead looking__lead">{looking.lead}</p>
        <div className="looking__cards">
          {looking.cards.map((card) => (
            <article key={card.title} className="card">
              <h3 className="card__title">{card.title}</h3>
              <p className="card__text">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
