import { productCards, productsCopy } from "@/data/products";

export function ProductsServices() {
  return (
    <section className="products-services">
      <div className="container">
        <h2 className="products-services__title">
          {productsCopy.headlineLead}{" "}
          <span className="accent">{productsCopy.headlineAccent}</span>{" "}
          {productsCopy.headlineRest}
        </h2>
        <div className="products-services__cols">
          <p className="products-services__lead">{productsCopy.lead}</p>
          <div className="products-services__copy">
            {productsCopy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="products-services__grid">
          {productCards.map((card) => (
            <a key={card.title} className="product-card" href="#top">
              <span
                className="product-card__bg"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span className="product-card__arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
