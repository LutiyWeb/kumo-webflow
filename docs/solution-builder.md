# Solution Builder — пошаговая дока

React-виджет для страницы **Products** на сайте Kumo (Webflow).
Посетитель отвечает на 4 вопроса, виджет собирает ему решение из продуктов и услуг Kumo и предлагает связаться с экспертом.

Документ написан так, чтобы по нему можно было продолжать работу самостоятельно. Каждый этап: **что делаем → зачем → код → как проверить**.

---

## 0. Как это устроено в целом

```
Webflow (страница Products)
 └─ <div data-solution-builder>        ← пустой контейнер, в него React рисует виджет
 └─ Embed-лоадер                       ← грузит dist/solution-builder.js с jsDelivr (как network.js)

Наш проект kumo (Vite)
 └─ src/solution-builder.tsx           ← точка входа: находит контейнер, монтирует <SolutionBuilder/>
 └─ src/solution-builder/              ← всё остальное: данные, логика, компоненты, стили
```

Почему так: Webflow не умеет React. Мы собираем виджет в один JS-файл (режим библиотеки Vite) и подключаем его на страницу, как уже сделано с глобусом, слайдером и Network. Это называется «остров»: обычная страница + один интерактивный блок на React.

**Путь пользователя:**

1. **Отрасль** — Automotive, Healthcare, Industrial, Infrastructure, Mobile Computing, Retail (те же, что в секции Industries на главной).
2. **Задача** — варианты зависят от отрасли (мониторинг оборудования, хранение и анализ данных, безопасность, автоматизация, модернизация IT, «не знаю»).
3. **Масштаб** — количество площадок (слайдер 1–50).
4. **Приоритет** — скорость запуска, безопасность, стоимость владения.
5. **Результат** — 2–3 продукта/услуги Kumo с объяснением «почему», срок внедрения, кнопка «Talk to an expert».

---

## 1. Подготовка проекта — СДЕЛАНО

- [x] `npm i react react-dom`
- [x] `npm i -D @vitejs/plugin-react @types/react @types/react-dom`
- [x] `vite.config.ts`: конфиг функцией `({ command }) => ({...})`, `plugins: [react()]`, `define` для `process.env.NODE_ENV` только при `command === "build"`
- [x] `tsconfig.json`: `"jsx": "react-jsx"`
- [x] `src/solution-builder.tsx` — точка входа с тестовым заголовком
- [ ] `solution-builder.html` — песочница в корне проекта (см. ниже)
- [ ] entry `"solution-builder": "src/solution-builder.tsx"` в `vite.config.ts` → `build.lib.entry`

**Зачем каждая вещь:**

| Что | Зачем |
|---|---|
| `react` | компоненты, хуки, состояние |
| `react-dom` | рисует компоненты в браузерный DOM (`createRoot`) |
| `@vitejs/plugin-react` | учит Vite понимать JSX + горячая перезагрузка компонентов |
| `@types/react*` | типы для TypeScript |
| `define` | в коде React есть `process.env.NODE_ENV`; в браузере `process` нет. При сборке Vite заменяет это выражение на строку `"production"` |
| `"jsx": "react-jsx"` | TypeScript понимает JSX без `import React` в каждом файле |

**Песочница** `solution-builder.html` (корень проекта, рядом с `network.html`):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kumo – solution builder sandbox</title>
    <style>
      body { margin: 0; padding: 40px; background: #16110d; color: #fff; font-family: "Open Sans", sans-serif; }
    </style>
  </head>
  <body>
    <div data-solution-builder></div>
    <script type="module" src="/src/solution-builder.tsx"></script>
  </body>
</html>
```

**Проверка:** `npm run dev` → `localhost:5173/solution-builder.html` → белый заголовок «Build your solution».

---

## 2. Структура файлов

Создаём папку `src/solution-builder/`:

```
src/solution-builder.tsx              точка входа (монтирование)
src/solution-builder/
  types.ts                            типы данных (что такое Industry, Task, Product, Answers…)
  config.ts                           ДАННЫЕ: все варианты, продукты, правила
  recommend.ts                        ЛОГИКА: ответы → решение (чистая функция, без React)
  SolutionBuilder.tsx                 главный компонент: хранит состояние, переключает шаги
  components/
    Progress.tsx                      «Step 2 / 4» + полоса
    Option.tsx                        одна карточка-вариант
    Step.tsx                          вопрос + сетка карточек
    ScaleStep.tsx                     шаг со слайдером (масштаб)
    Result.tsx                        экран результата
  solution-builder.css                стили
```

**Принцип:** данные отдельно (`config.ts`), логика отдельно (`recommend.ts`), отображение отдельно (компоненты). Чтобы поменять варианты или продукты, правишь только `config.ts`, компоненты не трогаешь.

---

## 3. Типы — `types.ts`

**Зачем:** описать форму данных один раз. TypeScript потом подскажет ошибки в `config.ts`, логике и компонентах.

```ts
export type IndustryId = "automotive" | "healthcare" | "industrial" | "infrastructure" | "mobile" | "retail";
export type TaskId = "monitor" | "data" | "security" | "automate" | "modernize" | "unsure";
export type PriorityId = "speed" | "security" | "cost";
export type ProductId = "iot" | "servers" | "integrated" | "managed" | "consulting" | "software";

// Один вариант ответа (карточка)
export type Choice<Id extends string> = {
  id: Id;
  title: string;
  description: string;
};

export type Product = {
  id: ProductId;
  name: string;      // "IoT-empowered devices"
  url: string;       // ссылка на страницу продукта (пока "#")
};

// Все ответы пользователя. null = ещё не выбрано
export type Answers = {
  industry: IndustryId | null;
  task: TaskId | null;
  sites: number;               // масштаб, по умолчанию 5
  priority: PriorityId | null;
};

// Что возвращает recommend()
export type Recommendation = {
  items: { product: Product; reason: string }[];
  weeks: [number, number];     // срок внедрения, вилка: [8, 12]
};
```

`Choice<Id>` — дженерик: один и тот же тип карточки для отраслей, задач и приоритетов, но `id` у каждого свой.

---

## 4. Данные — `config.ts`

**Зачем:** все тексты и правила в одном месте. Компоненты берут отсюда, что показывать на каждом шаге; `recommend.ts` — какие продукты советовать.

```ts
import type { Choice, IndustryId, TaskId, PriorityId, Product, ProductId } from "./types";

// Шаг 1 — используется в <Step> на шаге 1
export const INDUSTRIES: Choice<IndustryId>[] = [
  { id: "automotive", title: "Automotive", description: "Connected vehicles and smart factories" },
  { id: "healthcare", title: "Healthcare", description: "Hospitals, clinics and medical devices" },
  { id: "industrial", title: "Industrial", description: "Plants, machines and supply chains" },
  { id: "infrastructure", title: "Infrastructure", description: "Energy, transport and smart cities" },
  { id: "mobile", title: "Mobile Computing", description: "Field teams and mobile devices" },
  { id: "retail", title: "Retail", description: "Stores, warehouses and customers" },
];

// Шаг 2 — общий список задач
export const TASKS: Choice<TaskId>[] = [
  { id: "monitor", title: "Monitor equipment", description: "Real-time status and alerts from machines and sensors" },
  { id: "data", title: "Store & analyze data", description: "Collect data from sites and turn it into reports" },
  { id: "security", title: "Secure my systems", description: "Protect data and devices across locations" },
  { id: "automate", title: "Automate processes", description: "Connect systems and remove manual steps" },
  { id: "modernize", title: "Modernize legacy IT", description: "Move old infrastructure to a modern stack" },
  { id: "unsure", title: "Not sure yet", description: "We will suggest a starting point" },
];

// Шаг 2 зависит от шага 1: какие задачи показывать для отрасли.
// Здесь видно «ветвление»: варианты шага строятся из предыдущего ответа.
export const TASKS_BY_INDUSTRY: Record<IndustryId, TaskId[]> = {
  automotive:     ["monitor", "data", "automate", "unsure"],
  healthcare:     ["data", "security", "modernize", "unsure"],
  industrial:     ["monitor", "data", "automate", "security", "modernize", "unsure"],
  infrastructure: ["monitor", "security", "data", "unsure"],
  mobile:         ["security", "automate", "data", "unsure"],
  retail:         ["data", "automate", "security", "unsure"],
};

// Шаг 4
export const PRIORITIES: Choice<PriorityId>[] = [
  { id: "speed", title: "Fast launch", description: "Go live as soon as possible" },
  { id: "security", title: "Security", description: "Data stays protected and under control" },
  { id: "cost", title: "Cost of ownership", description: "Lowest cost over the years" },
];

// Каталог продуктов Kumo (названия из футера сайта)
export const PRODUCTS: Record<ProductId, Product> = {
  iot:        { id: "iot", name: "IoT-empowered devices", url: "#" },
  servers:    { id: "servers", name: "Servers", url: "#" },
  integrated: { id: "integrated", name: "Integrated systems", url: "#" },
  managed:    { id: "managed", name: "Managed IT Services", url: "#" },
  consulting: { id: "consulting", name: "IT consulting", url: "#" },
  software:   { id: "software", name: "Software development", url: "#" },
};

// Базовый набор продуктов для задачи + объяснение «почему». Используется в recommend.ts
export const TASK_RULES: Record<TaskId, { product: ProductId; reason: string }[]> = {
  monitor:   [{ product: "iot", reason: "Sensors on equipment stream status in real time" },
              { product: "integrated", reason: "One dashboard for all machines and sites" }],
  data:      [{ product: "iot", reason: "Collect data at the source" },
              { product: "servers", reason: "Store and process data on your own hardware" }],
  security:  [{ product: "servers", reason: "Sensitive data stays on-premise" },
              { product: "consulting", reason: "Security audit and roadmap" }],
  automate:  [{ product: "integrated", reason: "Connect existing systems into one flow" },
              { product: "software", reason: "Custom tools for your processes" }],
  modernize: [{ product: "consulting", reason: "Plan the migration step by step" },
              { product: "servers", reason: "Modern infrastructure to move to" }],
  unsure:    [{ product: "consulting", reason: "We start with a free assessment" }],
};
```

`Record<K, V>` — объект, у которого ключи типа `K`, значения типа `V`. TypeScript проверит, что ты не забыл ни одну отрасль или задачу.

---

## 5. Логика — `recommend.ts`

**Зачем:** превратить ответы в результат. Это **чистая функция**: на вход ответы, на выход решение, без React, без DOM. Её легко проверить отдельно и поменять правила, не трогая компоненты.

```ts
import { PRODUCTS, TASK_RULES } from "./config";
import type { Answers, Recommendation } from "./types";

export function recommend(a: Answers): Recommendation {
  // 1. базовый набор по задаче
  const items = (TASK_RULES[a.task ?? "unsure"]).map(r => ({
    product: PRODUCTS[r.product],
    reason: r.reason,
  }));

  // 2. много площадок → нужна поддержка 24/7
  if (a.sites >= 10) {
    items.push({ product: PRODUCTS.managed, reason: `Our team runs all ${a.sites} sites 24/7` });
  }

  // 3. срок: база по масштабу, приоритет сдвигает
  let weeks: [number, number] = a.sites < 10 ? [4, 8] : a.sites < 30 ? [8, 12] : [12, 20];
  if (a.priority === "speed") weeks = [Math.max(2, weeks[0] - 2), weeks[1] - 2];
  if (a.priority === "security") weeks = [weeks[0] + 2, weeks[1] + 2];

  return { items: items.slice(0, 3), weeks };
}
```

`a.task ?? "unsure"` — если задача не выбрана (`null`), берём `"unsure"`.

**Проверка без UI:** временно в `solution-builder.tsx`:
```ts
console.log(recommend({ industry: "industrial", task: "data", sites: 12, priority: "security" }));
```
В консоли должны быть 3 продукта и `weeks: [10, 14]`.

---

## 6. Компоненты (этап useState)

### 6.1 `Option.tsx` — одна карточка

**Зачем:** переиспользуемая карточка для шагов 1, 2 и 4. Знает только, что показать и выбрана ли. Что делать при клике, решает родитель (передаёт функцию `onSelect`).

```tsx
type Props = {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

export function Option({ title, description, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      className={"sb-option" + (selected ? " is-selected" : "")}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="sb-option__dot" />
      <b className="sb-option__title">{title}</b>
      <span className="sb-option__desc">{description}</span>
    </button>
  );
}
```

`{ title, description, … }: Props` — деструктуризация props (то же, что `({ command })` в vite.config).
`<button>` вместо `<div>` — работает с клавиатуры (Tab, Enter) без лишнего кода.

### 6.2 `Step.tsx` — вопрос + сетка карточек

**Зачем:** один компонент для любого шага с выбором. Получает список вариантов, текущий выбор и функцию выбора.

```tsx
import { Option } from "./Option";
import type { Choice } from "../types";

type Props<Id extends string> = {
  question: string;
  choices: Choice<Id>[];
  value: Id | null;
  onChange: (id: Id) => void;
};

export function Step<Id extends string>({ question, choices, value, onChange }: Props<Id>) {
  return (
    <div className="sb-step">
      <h3 className="sb-step__question">{question}</h3>
      <div className="sb-step__grid">
        {choices.map(c => (
          <Option
            key={c.id}
            title={c.title}
            description={c.description}
            selected={c.id === value}
            onSelect={() => onChange(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

`key={c.id}` — React требует уникальный `key` у элементов списка, чтобы понимать, какой элемент изменился.

### 6.3 `Progress.tsx`

```tsx
export function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="sb-progress">
      <span className="sb-progress__label">Step {step} / {total}</span>
      <div className="sb-progress__bar">
        <i style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}
```

`style={{ ... }}` — внешние скобки = «JS внутри JSX», внутренние = объект стилей.

### 6.4 `ScaleStep.tsx` — шаг 3, слайдер

```tsx
type Props = { value: number; onChange: (n: number) => void };

export function ScaleStep({ value, onChange }: Props) {
  return (
    <div className="sb-step">
      <h3 className="sb-step__question">How many sites or locations?</h3>
      <div className="sb-scale">
        <input
          type="range" min={1} max={50} value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        <b className="sb-scale__value">{value}</b>
      </div>
    </div>
  );
}
```

Это **контролируемый input**: значение берётся из состояния (`value`), а при движении слайдера мы обновляем состояние (`onChange`). Источник правды — состояние React, а не DOM.

### 6.5 `Result.tsx`

```tsx
import type { Recommendation } from "../types";

type Props = { result: Recommendation; tags: string[]; onRestart: () => void };

export function Result({ result, tags, onRestart }: Props) {
  return (
    <div className="sb-result">
      <div className="sb-result__tags">
        {tags.map(t => <span key={t} className="sb-tag">{t}</span>)}
      </div>
      <ol className="sb-result__list">
        {result.items.map((it, i) => (
          <li key={it.product.id} className="sb-result__item">
            <span className="sb-result__num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <b>{it.product.name}</b>
              <p>{it.reason}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="sb-result__stats">
        Launch <b>{result.weeks[0]}–{result.weeks[1]} wks</b>
      </div>
      <div className="sb-nav">
        <button type="button" className="sb-btn-ghost" onClick={onRestart}>↺ Start over</button>
        <a className="sb-btn" href="#contact">Talk to an expert</a>
      </div>
    </div>
  );
}
```

### 6.6 `SolutionBuilder.tsx` — главный компонент

**Зачем:** хранит **состояние** (на каком шаге, какие ответы) и решает, какой шаг показать. Дочерние компоненты состояния не хранят, только показывают и сообщают о действиях.

```tsx
import { useState } from "react";
import { INDUSTRIES, TASKS, TASKS_BY_INDUSTRY, PRIORITIES } from "./config";
import { recommend } from "./recommend";
import type { Answers } from "./types";
import { Progress } from "./components/Progress";
import { Step } from "./components/Step";
import { ScaleStep } from "./components/ScaleStep";
import { Result } from "./components/Result";

const EMPTY: Answers = { industry: null, task: null, sites: 5, priority: null };
const TOTAL = 4;

export function SolutionBuilder() {
  const [step, setStep] = useState(1);            // 1..4, 5 = результат
  const [answers, setAnswers] = useState<Answers>(EMPTY);

  // обновить одно поле ответов, остальные сохранить
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  // шаг 2 строится из ответа шага 1
  const tasks = answers.industry
    ? TASKS.filter(t => TASKS_BY_INDUSTRY[answers.industry!].includes(t.id))
    : TASKS;

  // можно ли нажать Next
  const canNext =
    (step === 1 && answers.industry) ||
    (step === 2 && answers.task) ||
    step === 3 ||
    (step === 4 && answers.priority);

  if (step > TOTAL) {
    const result = recommend(answers);
    const tags = [
      INDUSTRIES.find(i => i.id === answers.industry)?.title ?? "",
      TASKS.find(t => t.id === answers.task)?.title ?? "",
      `${answers.sites} sites`,
      `Priority: ${PRIORITIES.find(p => p.id === answers.priority)?.title ?? ""}`,
    ];
    return (
      <section className="sb">
        <h2 className="sb__title">Your <span>solution</span></h2>
        <Result result={result} tags={tags} onRestart={() => { setAnswers(EMPTY); setStep(1); }} />
      </section>
    );
  }

  return (
    <section className="sb">
      <h2 className="sb__title">Build your <span>solution</span></h2>
      <Progress step={step} total={TOTAL} />

      {step === 1 && <Step question="What is your industry?" choices={INDUSTRIES}
                           value={answers.industry}
                           onChange={id => { set("industry", id); set("task", null); }} />}
      {step === 2 && <Step question="What do you need to solve?" choices={tasks}
                           value={answers.task} onChange={id => set("task", id)} />}
      {step === 3 && <ScaleStep value={answers.sites} onChange={n => set("sites", n)} />}
      {step === 4 && <Step question="What matters most?" choices={PRIORITIES}
                           value={answers.priority} onChange={id => set("priority", id)} />}

      <div className="sb-nav">
        <button type="button" className="sb-btn-ghost" disabled={step === 1}
                onClick={() => setStep(s => s - 1)}>← Back</button>
        <button type="button" className="sb-btn" disabled={!canNext}
                onClick={() => setStep(s => s + 1)}>{step === TOTAL ? "See solution" : "Next →"}</button>
      </div>
    </section>
  );
}
```

Ключевые идеи:
- `useState(1)` возвращает `[значение, функция-изменения]`. Вызов функции → React перерисовывает компонент с новым значением.
- `setAnswers(prev => ({ ...prev, [key]: value }))` — новый объект на основе старого. Состояние в React **не мутируют** (`answers.task = x` не вызовет перерисовку).
- `{step === 1 && <Step …/>}` — условный рендер: если слева `false`, ничего не рисуется.
- При смене отрасли сбрасываем задачу: набор задач зависит от отрасли.
- `tasks` и `canNext` не хранятся в состоянии, а **вычисляются** из него при каждом рендере (производные данные).

### 6.7 Точка входа `src/solution-builder.tsx` (итоговая)

```tsx
import { createRoot } from "react-dom/client";
import { SolutionBuilder } from "./solution-builder/SolutionBuilder";
import css from "./solution-builder/solution-builder.css?inline";

// стили кладём в <head> сами: в режиме библиотеки Vite не подключает CSS автоматически
// (так же сделано в solutions-slider.ts)
const style = document.createElement("style");
style.textContent = css;
document.head.append(style);

const root = document.querySelector<HTMLElement>("[data-solution-builder]");
if (root) createRoot(root).render(<SolutionBuilder />);
```

**Проверка этапа 6:** в песочнице проходятся все 4 шага, Next неактивен без выбора, Back работает, на шаге 2 варианты зависят от отрасли, в конце результат, Start over сбрасывает.

---

## 7. Стили — `solution-builder.css`

**Зачем:** вид как на макете (тёмный фон, Roboto Mono в заголовках, жёлтый акцент). Все классы с префиксом `sb-`, чтобы не конфликтовать с классами Webflow. Шрифты на сайте уже подключены Webflow, в песочнице будут системные.

```css
.sb { --accent: #ffbe2e; --line: rgba(220,224,224,.2); --muted: #c4c4c4;
      max-width: 1170px; margin: 0 auto; padding: 40px; border: 1px solid var(--line);
      color: #fff; font-family: "Open Sans", sans-serif; }
.sb__title { font: 700 32px/1.2 "Roboto Mono", monospace; margin: 0 0 24px; }
.sb__title span { color: var(--accent); }

.sb-progress { margin-bottom: 36px; }
.sb-progress__label { font: 500 14px "Roboto Mono", monospace; color: #86817d; }
.sb-progress__bar { height: 2px; background: var(--line); margin-top: 12px; }
.sb-progress__bar i { display: block; height: 100%; background: var(--accent); transition: width .4s ease; }

.sb-step__question { font: 600 20px "Open Sans", sans-serif; margin: 0 0 20px; }
.sb-step__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

.sb-option { display: flex; flex-direction: column; gap: 10px; text-align: left; padding: 20px;
             background: transparent; color: #fff; border: 1px solid var(--line); cursor: pointer;
             transition: border-color .2s, background-color .2s; }
.sb-option:hover { border-color: var(--muted); }
.sb-option.is-selected { border-color: var(--accent); background: rgba(255,190,46,.06); }
.sb-option__dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--muted); }
.is-selected .sb-option__dot { border-color: var(--accent); background: radial-gradient(var(--accent) 40%, transparent 45%); }
.sb-option__title { font: 700 15px "Roboto Mono", monospace; }
.is-selected .sb-option__title { color: var(--accent); }
.sb-option__desc { font-size: 13px; line-height: 1.5; color: var(--muted); }

.sb-scale { display: flex; align-items: center; gap: 24px; }
.sb-scale input { flex: 1; accent-color: var(--accent); }
.sb-scale__value { font: 700 32px "Roboto Mono", monospace; min-width: 60px; }

.sb-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 36px; }
.sb-btn { background: var(--accent); color: #16110d; border: 0; padding: 14px 28px; font-weight: 700;
          text-transform: uppercase; font-size: 13px; letter-spacing: .05em; cursor: pointer; text-decoration: none; }
.sb-btn:disabled { opacity: .3; cursor: default; }
.sb-btn-ghost { background: none; border: 0; color: var(--muted); font-weight: 600; cursor: pointer; }
.sb-btn-ghost:disabled { visibility: hidden; }

.sb-result__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.sb-tag { font-size: 12px; color: var(--muted); border: 1px solid var(--line); padding: 6px 12px; }
.sb-result__list { list-style: none; padding: 0; margin: 0; }
.sb-result__item { display: flex; gap: 16px; padding: 16px 0; border-top: 1px solid var(--line); }
.sb-result__item b { font: 700 16px "Roboto Mono", monospace; }
.sb-result__item p { margin: 4px 0 0; font-size: 13px; color: var(--muted); }
.sb-result__num { font: 700 14px "Roboto Mono", monospace; color: var(--accent); }
.sb-result__stats { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--line); color: #86817d; }
.sb-result__stats b { color: #fff; font: 700 26px "Roboto Mono", monospace; margin-left: 12px; }

@media (max-width: 767px) {
  .sb { padding: 24px 18px; }
  .sb__title { font-size: 24px; }
  .sb-step__grid { grid-template-columns: 1fr; }
}
```

---

## 8. Переход на useReducer (рефакторинг)

**Зачем:** в `SolutionBuilder` много разных `set…` в разных местах. `useReducer` собирает все изменения состояния в одну функцию: явный список действий («выбрал отрасль», «назад», «сначала»). Логика переходов становится видна в одном месте и тестируется без UI.

```ts
type State = { step: number; answers: Answers };
type Action =
  | { type: "select"; key: keyof Answers; value: Answers[keyof Answers] }
  | { type: "next" } | { type: "back" } | { type: "restart" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select": {
      const answers = { ...state.answers, [action.key]: action.value };
      if (action.key === "industry") answers.task = null;   // зависимый шаг сбрасываем
      return { ...state, answers };
    }
    case "next":    return { ...state, step: state.step + 1 };
    case "back":    return { ...state, step: Math.max(1, state.step - 1) };
    case "restart": return { step: 1, answers: EMPTY };
  }
}

// в компоненте:
const [state, dispatch] = useReducer(reducer, { step: 1, answers: EMPTY });
// onChange={id => dispatch({ type: "select", key: "industry", value: id })}
// onClick={() => dispatch({ type: "next" })}
```

Reducer — чистая функция: `(старое состояние, действие) → новое состояние`. Удобно вынести в `reducer.ts`.

---

## 9. Анимация переходов между шагами

**Зачем:** шаг не «прыгает», а мягко появляется.

Самый простой способ без библиотек: дать обёртке шага `key={step}`. Когда `key` меняется, React удаляет старый элемент и создаёт новый, и CSS-анимация появления проигрывается заново.

```tsx
<div key={step} className="sb-anim">
  {step === 1 && <Step … />}
  …
</div>
```
```css
.sb-anim { animation: sb-in .35s ease both; }
@keyframes sb-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
```

Опционально позже: библиотека `framer-motion` (`AnimatePresence`) — для анимации и ухода старого шага.

---

## 10. Сборка и подключение к Webflow

1. `vite.config.ts` → `build.lib.entry` → `"solution-builder": "src/solution-builder.tsx"`.
2. `npm run build` → в `dist/` появится `solution-builder.js` (React внутри него).
3. `git add -A` → commit → `git push` → `git rev-parse HEAD` (хеш).
4. **Webflow, страница Products:** новая секция (Section → Container) → внутри Div Block с атрибутом `data-solution-builder` = `true` (Settings → Custom attributes).
5. Рядом Embed-лоадер (как у Network, только имена другие):

```html
<script type="module">
  const LOCAL = 'http://localhost:5173';
  const CDN = 'https://cdn.jsdelivr.net/gh/LutiyWeb/kumo-webflow@ХЕШ/dist';
  const loadCdn = () => import(CDN + '/solution-builder.js');
  if (localStorage.getItem('kumo-dev') === '1') {
    try { await import(LOCAL + '/src/solution-builder.tsx'); }
    catch (e) { console.warn('[kumo] dev server not reachable', e); loadCdn(); }
  } else { loadCdn(); }
</script>
```

⚠️ Dev-режим через localhost с `.tsx` может не заработать на опубликованном сайте (React Refresh ждёт свою преамбулу). Разрабатывать в песочнице `solution-builder.html`, на сайте проверять CDN-сборку.

6. Publish → проверить на `kumo-2a5506.webflow.io/products`.

---

## 11. Чек-лист готовности

- [ ] все 4 шага проходятся, Next выключен без выбора
- [ ] шаг 2 зависит от шага 1; смена отрасли сбрасывает задачу
- [ ] результат меняется от ответов (проверить 2–3 комбинации)
- [ ] Start over возвращает к шагу 1 с пустыми ответами
- [ ] работает с клавиатуры (Tab по карточкам, Enter/Space выбирает)
- [ ] мобильная версия: карточки в одну колонку
- [ ] на Webflow стили не ломаются от стилей сайта (префикс `sb-`)

## 12. Идеи на потом

- Кнопка «Talk to an expert» передаёт ответы в форму контакта (query-параметры или localStorage).
- Сохранение ответов в URL (`?industry=industrial&task=data`) — ссылкой можно поделиться.
- Тесты на `recommend.ts` и `reducer` через Vitest.
- Данные из Webflow CMS вместо `config.ts`.
