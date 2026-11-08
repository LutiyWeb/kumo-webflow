import { Hero } from "@/components/home/Hero";
import { PageMotion } from "@/components/motion/PageMotion";
import { Industries } from "@/components/home/Industries";
import { Looking } from "@/components/home/Looking";
import { Ready } from "@/components/home/Ready";
import { Solutions } from "@/components/home/Solutions";
import { Streams } from "@/components/home/Streams";
import { Why } from "@/components/home/Why";

export default function HomePage() {
  return (
    <main id="top">
      <PageMotion />
      <Hero />
      <Solutions />
      <Looking />
      <Streams />
      <Why />
      <Industries />
      <Ready />
    </main>
  );
}
