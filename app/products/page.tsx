import { ListingPage } from "@/components/listing/ListingPage";

const cards = [
  {
    title: "Servers",
    text: "KUMO servers designed to ease digital transformation of business operations",
    image: "/products/servers-hover.png",
  },
  {
    title: "Integrated systems",
    text: "Building data center infrastructure is increasingly complex, time-consuming, and error-proof.",
    image: "/products/integrated-hover.png",
  },
  {
    title: "IoT Empowered devices",
    text: "Smart technology helps to conserve energy, offers unprecedented level of security and saves money",
    image: "/products/iot-hover.png",
  },
];

export default function ProductsPage() {
  return (
    <ListingPage
      mark="Products"
      pageTitle="Products"
      hero="/products/hero.jpg"
      headline={
        <>
          Upgrade your IT infrastructure{" "}
          <span className="accent accent--block">
            to create new, high-performance
          </span>
          business opportunities
        </>
      }
      lead="Create the Foundation for the fastest digital innovations using advanced technologies and the best equipment."
      note="Infrastructure needs to be transformed into modern platforms that can provide more valuable services that accelerate the process of innovation."
      cards={cards}
    />
  );
}
