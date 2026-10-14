import { Hero } from "@/components/home/Hero";
import { Industries } from "@/components/home/Industries";
import { Looking } from "@/components/home/Looking";
import { Solutions } from "@/components/home/Solutions";
import { Streams } from "@/components/home/Streams";
import { Why } from "@/components/home/Why";

export default function HomePage() {
  return (
    <main id="top">
      <Hero />
      <Solutions />
      <Looking />
      <Streams />
      <Why />
      <Industries />
    </main>
  );
}
