"use client";

import { useEffect, useRef } from "react";

export function ProductsHero() {
  const netRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = netRef.current;
    if (!node) return;
    let cancelled = false;
    import("../../src/network").then((mod) => {
      if (!cancelled) mod.mountNetwork(node);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="products-hero">
      <div className="products-hero__net" data-network ref={netRef} />
      <div className="container products-hero__copy">
        <h1>
          <span>Kumo</span>
          <span>Services</span>
        </h1>
      </div>
    </section>
  );
}
