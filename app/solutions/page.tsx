import type { Metadata } from "next";
import { ListingPage } from "@/components/listing/ListingPage";

export const metadata: Metadata = {
  title: "Solutions — Kumo",
  description:
    "Driving innovation through groundbreaking technology with KUMO Tech solutions.",
};

const cards = [
  {
    key: "ai",
    title: "Artificial Intelligence",
    text: "KUMO integrates various artificial intelligence technologies and development flows.",
    image: "/solutions/ai-hover.png",
  },
  {
    key: "big-data",
    title: "Big Data",
    text: "Data is of great value, which is why all companies are looking to switch to digital technologies.",
    image: "/solutions/big-data-hover.png",
  },
  {
    key: "vision",
    title: (
      <>
        Machine and
        <br />
        AI Vision
      </>
    ),
    text: (
      <>
        Leveraging
        <br className="listing-card__br" /> image analysis
        <br className="listing-card__br" /> to address challenges
      </>
    ),
    image: "/solutions/vision-hover.png",
  },
  {
    key: "iot",
    title: "Internet of Things",
    text: "Soon there will be trillions of devices/sensors deployed globally.",
    image: "/solutions/iot-hover.png",
    href: "/solutions/iot",
  },
  {
    key: "smart",
    title: "Smart Everything",
    text: "Global real-estate portfolios are valued over $200 trillion dollars.",
    image: "/solutions/smart-hover.png",
  },
  {
    key: "cyber",
    title: "Cyber Security",
    text: "Protect your business with security solutions from KUMO",
    image: "/solutions/cyber-hover.png",
  },
  {
    key: "5g",
    title: "5G",
    text: "KUMO helps prepare these 5G devices with solutions based on its high-performance and efficient architecture.",
    image: "/solutions/5g-hover.png",
    href: "/solutions/5g",
  },
];

export default function SolutionsPage() {
  return (
    <ListingPage
      mark="Solutions"
      pageTitle="Solutions"
      hero="/solutions/hero.png"
      headline={
        <>
          Our <span className="accent">key</span> expertise
        </>
      }
      lead="Driving Innovation Through Groundbreaking Technology"
      note="We have mastered the latest and greatest of web, mobile, and cross-platform techs to provide you with a powerful, made-to-measure stack for your project."
      cards={cards}
    />
  );
}
