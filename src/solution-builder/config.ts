import type { Choice, PriorityId, Product, ProductId, ProductRule } from "./types";

export const INDUSTRIES = [
  {
    id: "automotive",
    title: "Automotive",
    description: "Connected vehicles and smart factories",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Hospitals, clinics and medical devices",
  },
  {
    id: "industrial",
    title: "Industrial",
    description: "Plants, machines and supply chains",
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    description: "Energy, transport and smart cities",
  },
  {
    id: "mobile",
    title: "Mobile Computing",
    description: "Field teams and mobile devices",
  },
  {
    id: "retail",
    title: "Retail",
    description: "Stores, warehouses and customers",
  },
];

export const TITLES = [
  "What is your industry?",
  "What do you need to solve?",
  "How many sites?",
  "What matters most?",
];

/** Объект продуктов: id → name/url. recommend берёт отсюда название. */
export const PRODUCTS: Record<ProductId, Product> = {
  iot: { id: "iot", name: "IoT-empowered devices", url: "#" },
  servers: { id: "servers", name: "Servers", url: "#" },
  integrated: { id: "integrated", name: "Integrated systems", url: "#" },
  managed: { id: "managed", name: "Managed IT Services", url: "#" },
  consulting: { id: "consulting", name: "IT consulting", url: "#" },
  software: { id: "software", name: "Software development", url: "#" },
  ai: { id: "ai", name: "AI solutions", url: "#" },
  security: { id: "security", name: "Security solutions", url: "#" },
};

// Шаг 2: задачи для каждой отрасли.
// products — список { product, reason } для recommend / Result.
export const TASKS_BY_INDUSTRY: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    products: ProductRule[];
  }[]
> = {
  automotive: [
    {
      id: "fleet",
      title: "Track connected vehicles",
      description: "Location, health and usage data from every vehicle",
      products: [
        {
          product: "iot",
          reason: "Sensors on vehicles stream location and health in real time",
        },
        {
          product: "integrated",
          reason: "One dashboard for the whole fleet across sites",
        },
      ],
    },
    {
      id: "factory",
      title: "Smart factory line",
      description: "Monitor assembly lines and prevent downtime",
      products: [
        {
          product: "iot",
          reason: "Line sensors catch issues before they stop production",
        },
        {
          product: "ai",
          reason: "Models predict downtime from live machine data",
        },
      ],
    },
    {
      id: "quality",
      title: "Automated quality control",
      description: "Detect defects with machine vision",
      products: [
        {
          product: "ai",
          reason: "Vision models spot defects faster than manual checks",
        },
        {
          product: "software",
          reason: "Custom QC workflows fit your line and standards",
        },
      ],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: [
        {
          product: "consulting",
          reason: "We start with a free assessment of your goals",
        },
      ],
    },
  ],
  healthcare: [
    {
      id: "patient-data",
      title: "Protect patient data",
      description: "Keep medical records secure and compliant",
      products: [
        {
          product: "security",
          reason: "Controls and policies keep records compliant",
        },
        {
          product: "servers",
          reason: "Sensitive data stays on-premise under your control",
        },
      ],
    },
    {
      id: "devices",
      title: "Monitor medical devices",
      description: "Real-time status of equipment across wards",
      products: [
        {
          product: "iot",
          reason: "Devices report status across every ward in real time",
        },
        {
          product: "integrated",
          reason: "One view of equipment for clinical and IT teams",
        },
      ],
    },
    {
      id: "records",
      title: "Unify hospital systems",
      description: "Connect labs, records and billing into one flow",
      products: [
        {
          product: "integrated",
          reason: "Labs, records and billing connect into one flow",
        },
        {
          product: "software",
          reason: "Custom integrations close gaps between systems",
        },
      ],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: [
        {
          product: "consulting",
          reason: "We start with a free assessment of your goals",
        },
      ],
    },
  ],
  industrial: [
    {
      id: "maintenance",
      title: "Predictive maintenance",
      description: "Spot machine failures before they happen",
      products: [
        {
          product: "iot",
          reason: "Sensors catch early signs of machine wear",
        },
        {
          product: "ai",
          reason: "Models forecast failures before they stop the line",
        },
      ],
    },
    {
      id: "line",
      title: "Real-time line control",
      description: "Live status and alerts from every production line",
      products: [
        {
          product: "iot",
          reason: "Live status and alerts from every production line",
        },
        {
          product: "integrated",
          reason: "One control view across lines and shifts",
        },
      ],
    },
    {
      id: "connect",
      title: "Connect all plants",
      description: "One system for every site and warehouse",
      products: [
        {
          product: "integrated",
          reason: "One system for every plant and warehouse",
        },
        {
          product: "managed",
          reason: "Our team keeps multi-site ops running 24/7",
        },
      ],
    },
    {
      id: "data",
      title: "Store & analyze production data",
      description: "Keep data on-premise and turn it into reports",
      products: [
        {
          product: "servers",
          reason: "Store and process production data on your hardware",
        },
        {
          product: "ai",
          reason: "Turn raw production data into actionable reports",
        },
      ],
    },
    {
      id: "legacy",
      title: "Modernize legacy IT",
      description: "Move old infrastructure to a modern stack",
      products: [
        {
          product: "consulting",
          reason: "Plan the migration step by step with clear risks",
        },
        {
          product: "servers",
          reason: "Modern infrastructure ready for the move",
        },
      ],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: [
        {
          product: "consulting",
          reason: "We start with a free assessment of your goals",
        },
      ],
    },
  ],
  infrastructure: [
    {
      id: "grid",
      title: "Monitor energy & utilities",
      description: "Sensors across grids, pipes and stations",
      products: [
        {
          product: "iot",
          reason: "Sensors across grids, pipes and stations stream status",
        },
        {
          product: "integrated",
          reason: "One platform for utilities across the network",
        },
      ],
    },
    {
      id: "city",
      title: "Smart city services",
      description: "Traffic, lighting and public services in one platform",
      products: [
        {
          product: "iot",
          reason: "Sensors feed traffic, lighting and public services",
        },
        {
          product: "software",
          reason: "Custom apps for city operators and citizens",
        },
      ],
    },
    {
      id: "protect",
      title: "Protect critical systems",
      description: "Defend infrastructure from cyber attacks",
      products: [
        {
          product: "security",
          reason: "Defend critical systems from cyber attacks",
        },
        {
          product: "managed",
          reason: "Round-the-clock monitoring of infrastructure risk",
        },
      ],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: [
        {
          product: "consulting",
          reason: "We start with a free assessment of your goals",
        },
      ],
    },
  ],
  mobile: [
    {
      id: "field",
      title: "Equip field teams",
      description: "Apps and devices for workers on the go",
      products: [
        {
          product: "software",
          reason: "Apps built for workers on the go",
        },
        {
          product: "iot",
          reason: "Devices and sensors stay connected in the field",
        },
      ],
    },
    {
      id: "secure-devices",
      title: "Secure mobile devices",
      description: "Protect company data on every phone and tablet",
      products: [
        {
          product: "security",
          reason: "Protect company data on every phone and tablet",
        },
        {
          product: "managed",
          reason: "Fleet of devices stays updated and under policy",
        },
      ],
    },
    {
      id: "sync",
      title: "Sync data in real time",
      description: "Field data reaches the office instantly",
      products: [
        {
          product: "integrated",
          reason: "Field data reaches office systems instantly",
        },
        {
          product: "servers",
          reason: "Reliable storage and sync for field workloads",
        },
      ],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: [
        {
          product: "consulting",
          reason: "We start with a free assessment of your goals",
        },
      ],
    },
  ],
  retail: [
    {
      id: "inventory",
      title: "Smart inventory",
      description: "Track stock across stores and warehouses",
      products: [
        {
          product: "iot",
          reason: "Track stock across stores and warehouses in real time",
        },
        {
          product: "integrated",
          reason: "One inventory view for stores and warehouses",
        },
      ],
    },
    {
      id: "customers",
      title: "Understand customers",
      description: "Analyze sales and behavior to grow revenue",
      products: [
        {
          product: "ai",
          reason: "Analyze sales and behavior to grow revenue",
        },
        {
          product: "servers",
          reason: "Store customer and sales data for analysis",
        },
      ],
    },
    {
      id: "payments",
      title: "Secure payments & data",
      description: "Protect transactions and customer data",
      products: [
        {
          product: "security",
          reason: "Protect transactions and customer data",
        },
        {
          product: "managed",
          reason: "Ongoing monitoring of payment and data risk",
        },
      ],
    },
    {
      id: "omni",
      title: "Connect online & offline",
      description: "One system for e-commerce and physical stores",
      products: [
        {
          product: "software",
          reason: "Custom tools for e-commerce and store ops",
        },
        {
          product: "integrated",
          reason: "One system for online and physical stores",
        },
      ],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: [
        {
          product: "consulting",
          reason: "We start with a free assessment of your goals",
        },
      ],
    },
  ],
};

export const PRIORITIES: Choice<PriorityId>[] = [
  {
    id: "speed",
    title: "Fast launch",
    description: "Go live as soon as possible",
  },
  {
    id: "security",
    title: "Security",
    description: "Data stays protected and under control",
  },
  {
    id: "cost",
    title: "Cost of ownership",
    description: "Lowest cost over the years",
  },
];
