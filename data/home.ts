export const logoUrl =
  "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac3dde8c1083547e53b2812_logoKumo.png";

export interface NavChildItem {
  href: string;
  label: string;
}

export interface NavItem {
  href: string;
  label: string;
  children?: NavChildItem[];
}

export const nav: NavItem[] = [
  {
    href: "/products",
    label: "Products",
    children: [{ href: "/products/servers", label: "Servers" }],
  },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/application-services", label: "Application Services" },
      { href: "/services/it-consulting", label: "IT consulting" },
    ],
  },
  {
    href: "/solutions",
    label: "Solutions",
    children: [
      { href: "/solutions/iot", label: "Internet of Things" },
      { href: "/solutions/5g", label: "5G Technology" },
    ],
  },
  {
    href: "/about",
    label: "About Us",
    children: [
      { href: "/team", label: "Our Team" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    href: "/contact",
    label: "Contact Us",
  },
];

export const heroSlides = [
  {
    id: "development",
    eyebrow: "Website development + support after launch",
    title: "We build websites",
    accent: "and we don't leave",
    text: "Full-cycle development + technical support on subscription.",
    cta: "Discuss a project",
  },
  {
    id: "support",
    eyebrow: "Support & growth",
    title: "We fix what breaks",
    accent: "before you notice",
    text: "",
    cta: "Support plans",
  },
];

export const solutions = {
  title: "When something breaks on your site —",
  titleAccent: "we're already on it",
  lead: "Hotfix, 24/7 uptime monitoring and SLA response — frontend and backend in one plan.",
  note: "24/7 monitoring & support",
  cta: "Choose a plan",
  image:
    "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac3e6e8cde6b5609994d6ac_solutions-team.jpg",
  alt: "KUMO team working together at a table",
};

export const looking = {
  title: "Support",
  titleAccent: "plans",
  lead: "We support any website, even if we didn't build it — choose the hours you need.",
  cards: [
    {
      title: "Solo",
      price: "from $49/mo",
      meta: "up to 2 hrs/mo",
      features: ["Minor content edits", "Uptime monitoring", "Email support"],
      cta: "Choose Solo",
    },
    {
      title: "Base",
      price: "from $99/mo",
      meta: "up to 5 hrs/mo",
      features: ["Everything in Solo", "Layout & style edits", "Dependency updates"],
      cta: "Choose Base",
    },
    {
      title: "Pro",
      price: "from $249/mo",
      meta: "up to 15 hrs/mo",
      badge: "Popular",
      open: true,
      features: ["Everything in Base", "Priority task queue", "Monthly work report"],
      cta: "Choose Pro",
    },
    {
      title: "Enterprise",
      price: "On request",
      meta: "from 30 hrs/mo",
      features: ["Everything in Pro", "Dedicated manager", "24/7 call/chat"],
      cta: "Choose Enterprise",
    },
  ],
};

export const streams = {
  title: "Recent cases",
  slides: [
    {
      id: "honey",
      title: "Honey Store",
      tags: ["E-commerce", "Nuxt 3", "TypeScript", "Pinia", "Fastify", "PostgreSQL"],
      summary: "Electronics store with a catalog, cart, wishlist, and admin.",
      text: "Electronics and accessories online store: an SSR catalog of 8,000+ products with faceted filters (category, brand, price), a cart, a wishlist, and an admin panel for products and banners. Frontend on Nuxt 3, backend on Fastify + PostgreSQL with stock sync from the supplier.",
      images: [
        "https://www.luar.it.com/images/honey-store-home.webp",
        "https://www.luar.it.com/images/honey-store-products.webp",
        "https://www.luar.it.com/images/honey-store-catalog.webp",
        "https://www.luar.it.com/images/honey-store-product.jpg",
      ],
      demo: "https://honey-store-ua.vercel.app/",
    },
    {
      id: "bloom",
      title: "Bloom Their Day",
      tags: ["E-commerce", "Next.js", "React", "GraphQL", "Vercel"],
      summary: "Flower delivery with a catalog, reviews, and a cart.",
      text: "Same-day flower delivery service: bouquet catalog by occasion (birthday, anniversary, sympathy, congratulations), ZIP-code delivery availability check, product reviews and ratings, wishlist and cart. Frontend on Next.js (React, Turbopack) with a GraphQL API and built-in image optimization, hosted on Vercel.",
      images: [
        "https://www.luar.it.com/images/bloom-their-day-home.webp",
        "https://www.luar.it.com/images/bloom-their-day-categories.webp",
        "https://www.luar.it.com/images/bloom-their-day-catalog.webp",
        "https://www.luar.it.com/images/bloom-their-day-product.jpg",
      ],
      demo: "https://www.bloomtheirday.com/",
    },
    {
      id: "soon",
      title: "New case — coming soon",
      tags: ["UI/UX", "Vue", "Nuxt", "TypeScript"],
      summary: "A short summary will be added once the case is confirmed.",
      text: "Short task and result summary — will be added once confirmed.",
      images: ["https://picsum.photos/seed/luar-case-3/640/480"],
      demo: "",
    },
  ],
};

export const why = {
  title: "Why choose us?",
  image:
    "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac5238dbc9f4b31921bbe3f_why-kumo-tech.jpg",
  alt: "Kumo Tech team at work",
  items: [
    {
      num: "#01",
      title: "Painless maintenance and easy scale-up",
      text: "We use modular, inheritable scalable IoT architecture that provides for painless application maintenance, fast vertical and horizontal scale-up and allows adding new functional modules and expanding the existing functionality to new device models with reasonable effort.",
    },
    {
      num: "#02",
      title: "Short time to market",
      text: "We develop IoT applications relying on an iterative approach. This allows you to obtain a minimum viable product or a first application version with a learn set of high-priority features within 3-6 months and release new features every 2-4 weeks.",
    },
    {
      num: "#03",
      title: "Mature quality assurance",
      text: "We place a premium on applications’ quality from the very start of the project and focus on prevention and early detection of defects.",
    },
    {
      num: "#04",
      title: "High level security",
      text: "With 15 years in cyber security, we incorporate security as early as at the application design phase and conduct vulnerability assessment and penetration testing for all major releases.",
    },
  ],
};

export const industries = {
  title: ["Industries", "of Application"],
  items: [
    {
      label: "Automotive",
      image:
        "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac53fc17ba1a1765381430f_Group%201618.jpg",
      alt: "Automotive",
    },
    {
      label: "Healthcare",
      image:
        "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac53fc1e126db6db0e90993_Group%202596.jpg",
      alt: "Healthcare",
    },
    {
      label: "Industrial",
      image:
        "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac53fc16b923d472d412e7f_Group%202595.jpg",
      alt: "Industrial",
    },
    {
      label: "Infrastructure",
      image:
        "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac53fca40799387194bfc75_Group%202594.jpg",
      alt: "Infrastructure",
    },
    {
      label: "Mobile Computing",
      image:
        "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac53fc1514f963e54091e9b_Rectangle%20434.jpg",
      alt: "Mobile computing hardware",
    },
    {
      label: "Retail",
      image:
        "https://cdn.prod.website-files.com/6ac3b84ed4c53273782414fe/6ac542d31e496f2fc72b6a92_industries-retail.jpg",
      alt: "Retail store owner",
    },
  ],
};

export const ready = {
  title: "Ready to start",
  titleAccent: "a project?",
  lead: "Tell us about your task — we’ll reply within 1 business day.",
  name: "Name",
  email: "E-mail",
  topic: "Topic",
  message: "Text your message here",
  send: "Send",
  sent: "Sent",
  noteBefore: "Sending us a message means you’re okay with our ",
  terms: "Terms of Use",
  noteMid: " and ",
  privacy: "Privacy Policy",
};

export const footerColumns = [
  {
    title: "Products",
    href: "/products",
    links: [{ label: "Servers", href: "/products/servers" }],
  },
  {
    title: "Services",
    href: "/services",
    links: [
      { label: "Application Services", href: "/services/application-services" },
      { label: "IT consulting", href: "/services/it-consulting" },
    ],
  },
  {
    title: "Solutions",
    href: "/solutions",
    links: [
      { label: "Internet of Things", href: "/solutions/iot" },
      { label: "5G Technology", href: "/solutions/5g" },
    ],
  },
  {
    title: "About Us",
    href: "/about",
    links: [
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export const footerCopy =
  "© 2020 Kumo Technologies Sdn Bhd | Privacy Policy | Terms of Use | Legal";
