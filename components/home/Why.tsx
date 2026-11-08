import { why } from "@/data/home";

export function Why() {
  return (
    <section className="section section--muted">
      <div className="container">
        <h2 className="section-title why__title" data-reveal="split">{why.title}</h2>
        <div className="why__grid">
          <div className="why__media" data-reveal="curtain">
            <img src={why.image} alt={why.alt} />
            <p className="why__brand" data-reveal="up" data-reveal-delay="0.8">
              Kumo
              <br />
              tech
            </p>
          </div>
          <div className="why__list" data-reveal="stagger" data-reveal-delay="0.2">
            {why.items.map((item) => (
              <article key={item.num} className="why__item">
                <p className="why__num" data-count>{item.num}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p className="why__text">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
