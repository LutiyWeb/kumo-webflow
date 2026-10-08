import type { Choice, PriorityId } from "./types";

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

// Шаг 2: задачи для каждой отрасли (ключ = id отрасли из INDUSTRIES).
// products — какие продукты из PRODUCTS решают эту задачу.
export const TASKS_BY_INDUSTRY = {
  automotive: [
    {
      id: "fleet",
      title: "Track connected vehicles",
      description: "Location, health and usage data from every vehicle",
      products: ["iot", "integrated"],
    },
    {
      id: "factory",
      title: "Smart factory line",
      description: "Monitor assembly lines and prevent downtime",
      products: ["iot", "ai"],
    },
    {
      id: "quality",
      title: "Automated quality control",
      description: "Detect defects with machine vision",
      products: ["ai", "software"],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: ["consulting"],
    },
  ],
  healthcare: [
    {
      id: "patient-data",
      title: "Protect patient data",
      description: "Keep medical records secure and compliant",
      products: ["security", "servers"],
    },
    {
      id: "devices",
      title: "Monitor medical devices",
      description: "Real-time status of equipment across wards",
      products: ["iot", "integrated"],
    },
    {
      id: "records",
      title: "Unify hospital systems",
      description: "Connect labs, records and billing into one flow",
      products: ["integrated", "software"],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: ["consulting"],
    },
  ],
  industrial: [
    {
      id: "maintenance",
      title: "Predictive maintenance",
      description: "Spot machine failures before they happen",
      products: ["iot", "ai"],
    },
    {
      id: "line",
      title: "Real-time line control",
      description: "Live status and alerts from every production line",
      products: ["iot", "integrated"],
    },
    {
      id: "connect",
      title: "Connect all plants",
      description: "One system for every site and warehouse",
      products: ["integrated", "managed"],
    },
    {
      id: "data",
      title: "Store & analyze production data",
      description: "Keep data on-premise and turn it into reports",
      products: ["servers", "ai"],
    },
    {
      id: "legacy",
      title: "Modernize legacy IT",
      description: "Move old infrastructure to a modern stack",
      products: ["consulting", "servers"],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: ["consulting"],
    },
  ],
  infrastructure: [
    {
      id: "grid",
      title: "Monitor energy & utilities",
      description: "Sensors across grids, pipes and stations",
      products: ["iot", "integrated"],
    },
    {
      id: "city",
      title: "Smart city services",
      description: "Traffic, lighting and public services in one platform",
      products: ["iot", "software"],
    },
    {
      id: "protect",
      title: "Protect critical systems",
      description: "Defend infrastructure from cyber attacks",
      products: ["security", "managed"],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: ["consulting"],
    },
  ],
  mobile: [
    {
      id: "field",
      title: "Equip field teams",
      description: "Apps and devices for workers on the go",
      products: ["software", "iot"],
    },
    {
      id: "secure-devices",
      title: "Secure mobile devices",
      description: "Protect company data on every phone and tablet",
      products: ["security", "managed"],
    },
    {
      id: "sync",
      title: "Sync data in real time",
      description: "Field data reaches the office instantly",
      products: ["integrated", "servers"],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: ["consulting"],
    },
  ],
  retail: [
    {
      id: "inventory",
      title: "Smart inventory",
      description: "Track stock across stores and warehouses",
      products: ["iot", "integrated"],
    },
    {
      id: "customers",
      title: "Understand customers",
      description: "Analyze sales and behavior to grow revenue",
      products: ["ai", "servers"],
    },
    {
      id: "payments",
      title: "Secure payments & data",
      description: "Protect transactions and customer data",
      products: ["security", "managed"],
    },
    {
      id: "omni",
      title: "Connect online & offline",
      description: "One system for e-commerce and physical stores",
      products: ["software", "integrated"],
    },
    {
      id: "unsure",
      title: "Not sure yet",
      description: "We will suggest a starting point",
      products: ["consulting"],
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
