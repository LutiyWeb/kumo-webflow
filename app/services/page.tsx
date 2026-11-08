import { ProductsHero } from "@/components/products/ProductsHero";
import { ProductsServices } from "@/components/products/ProductsServices";
import { PageMotion } from "@/components/motion/PageMotion";

export default function ServicesPage() {
  return (
    <main id="top">
      <PageMotion />
      <ProductsHero />
      <ProductsServices />
    </main>
  );
}
