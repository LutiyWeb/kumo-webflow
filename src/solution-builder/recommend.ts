import type { Answers, Recommendation } from "./types";
import { PRODUCTS, TASKS_BY_INDUSTRY } from "./config";

export default function recommend(a: Answers): Recommendation {
  const list = TASKS_BY_INDUSTRY[a.industry!];
  const task = list.find((t) => t.id === a.task);

  const items =
    task?.products.map((res) => ({
      product: PRODUCTS[res.product],
      reason: res.reason,
    })) ?? [];

  if (a.sites >= 10) {
    items.push({
      product: PRODUCTS.managed,
      reason: `Our team runs all ${a.sites} sites 24/7`,
    });
  }

  const top = items.slice(0, 3);
  let weeks: [number, number] =
    a.sites < 10 ? [4, 8] : a.sites < 30 ? [8, 12] : [12, 20];

  if (a.priority === "speed") weeks = [Math.max(2, weeks[0] - 2), weeks[1] - 2];
  if (a.priority === "security") weeks = [weeks[0] + 2, weeks[1] + 2];

  return { items: top, weeks: weeks };
}
