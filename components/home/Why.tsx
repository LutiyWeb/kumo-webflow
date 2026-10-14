import { why } from "@/data/home";

export function Why() {
  return (
    <section className="section section--muted">
      <div className="container">
        <h2 className="section-title why__title">{why.title}</h2>
        <div className="why__grid">
          <div className="why__media">
            <img src={why.image} alt={why.alt} />
            <p className="why__brand">
              Kumo
              <br />
              tech
            </p>
          </div>
          <div className="why__list">
            {why.items.map((item) => (
              <article key={item.num} className="why__item">
                <p className="why__num">{item.num}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
