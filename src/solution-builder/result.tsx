import type { Recommendation } from "./types";

type Props = {
  result: Recommendation;
  tags: string[];
  onRestart: () => void;
};

export function Result({ result, tags, onRestart }: Props) {
  return (
    <div className="sb-result">
      <div className="sb-result__tags">
        {tags.map((t) => (
          <span key={t} className="sb-tag">
            {t}
          </span>
        ))}
      </div>
      <ol className="sb-result__list">
        {result.items.map((item, i) => (
          <li key={item.product.id} className="sb-result__item">
            <span className="sb-result__num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <b>{item.product.name}</b>
              <p>{item.reason}</p>
            </div>
          </li>
        ))}
      </ol>
      {/* 3. срок */}
      <div className="sb-result__stats">
        Launch{" "}
        <b>
          {result.weeks[0]}–{result.weeks[1]} wks
        </b>
      </div>
      {/* 4. кнопки */}
      <div className="sb-nav">
        <button type="button" className="sb-btn-ghost" onClick={onRestart}>
          ↺ Start over
        </button>
        <a className="sb-btn" href="#contact">
          Talk to an expert
        </a>
      </div>
    </div>
  );
}
