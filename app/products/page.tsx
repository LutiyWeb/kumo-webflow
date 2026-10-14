import { ProductsHero } from "@/components/products/ProductsHero";
import { ProductsServices } from "@/components/products/ProductsServices";

export default function ProductsPage() {
  return (
    <main id="top">
      <ProductsHero />
      <ProductsServices />
    </main>
  );
}
