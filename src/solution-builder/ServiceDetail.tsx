import { useState, useEffect } from "react";

type Props = {
  title: string;
  id: string;
  added: boolean;
  onToggle: () => void;
};

// Prod loads this module from the pinned jsDelivr commit (.../dist/solution-builder.js).
// JSON stays in public/ (Vite does not copy public/ into dist). Dev (kumo-dev=1 or the
// local sandbox) serves public/ from the Vite origin.
function serviceDetailUrl(id: string): string {
  const moduleUrl = import.meta.url;
  const file = `${encodeURIComponent(id)}.json`;
  if (moduleUrl.includes("/dist/")) {
    return new URL(`../public/service-details/${file}`, moduleUrl).href;
  }
  return new URL(`/service-details/${file}`, moduleUrl).href;
}

export default function ServiceDetail({ title, id, added, onToggle }: Props) {
  const [text, setText] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let ignore = false;
    setStatus("loading");

    fetch(serviceDetailUrl(id))
      .then((response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json();
      })
      .then((data: { text: string }) => {
        if (ignore) return;
        setText(data.text);
        setStatus("ready");
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="service-detail">
      <h3 className="service-detail__title">{title}</h3>
      {status === "loading" && <p>Loading</p>}
      {status === "ready" && <p>{text}</p>}
      {status === "error" && <p>Couldn't load</p>}

      <button
        type="button"
        className={
          added
            ? "service-detail__button service-detail__button--added"
            : "service-detail__button"
        }
        onClick={onToggle}
      >
        {added ? "Remove" : "Add to request"}
      </button>
    </div>
  );
}
