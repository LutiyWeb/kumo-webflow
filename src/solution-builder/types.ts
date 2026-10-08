export type IndustryId =
  | "automotive"
  | "healthcare"
  | "industrial"
  | "infrastructure"
  | "mobile"
  | "retail";
export type TaskId =
  | "monitor"
  | "data"
  | "security"
  | "automate"
  | "modernize"
  | "unsure";
export type ProductId =
  | "iot"
  | "servers"
  | "integrated"
  | "managed"
  | "consulting"
  | "software";

export type Card = {
  id: string;
  title: string;
  description: string;
};

// Один вариант ответа (карточка)
export type Choice<Id extends string> = {
  id: Id;
  title: string;
  description: string;
};

export type PriorityId = "speed" | "security" | "cost";

export type Product = {
  id: ProductId;
  name: string; // "IoT-empowered devices"
  url: string; // ссылка на страницу продукта (пока "#")
};

// Все ответы пользователя. null = ещё не выбрано
export type Answers = {
  industry: IndustryId | null;
  task: TaskId | null;
  sites: number; // масштаб, по умолчанию 5
  priority: PriorityId | null;
};

// Что возвращает recommend()
export type Recommendation = {
  items: { product: Product; reason: string }[];
  weeks: [number, number]; // срок внедрения, вилка: [8, 12]
};
