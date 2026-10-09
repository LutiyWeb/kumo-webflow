import { createRoot } from "react-dom/client";
import { useState } from "react";
import {
  TITLES,
  PRIORITIES,
  INDUSTRIES,
  TASKS_BY_INDUSTRY,
} from "./solution-builder/config";
import Step from "./solution-builder/Step";
import { Progress } from "./solution-builder/Progress";
import type {
  Answers,
  IndustryId,
  PriorityId,
  TaskId,
} from "./solution-builder/types";
import { Result } from "./solution-builder/result";
import recommend from "./solution-builder/recommend";
import css from "./solution-builder/solution-builder.css?inline";

// В режиме библиотеки Vite не подключает CSS сам — кладём стили в <head>
const style = document.createElement("style");
style.textContent = css;
document.head.append(style);

const TOTAL = 4;

function SolutionBuilder() {
  const EMPTY: Answers = {
    industry: null,
    task: null,
    sites: 5,
    priority: null,
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canNext =
    (currentStep === 1 && answers.industry) ||
    (currentStep === 2 && answers.task) ||
    currentStep === 3 ||
    (currentStep === 4 && answers.priority);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step
            items={INDUSTRIES}
            selectedId={answers.industry}
            onSelect={(id) => {
              set("industry", id as IndustryId); // Наполнение общего объекта
              set("task", null);
            }}
          />
        );

      case 2:
        return (
          <Step
            items={answers.industry ? TASKS_BY_INDUSTRY[answers.industry] : []}
            selectedId={answers.task}
            onSelect={(id) => {
              set("task", id as TaskId);
            }}
          />
        );

      case 3:
        return (
          <div className="sb-step">
            <h3 className="sb-step__question">How many sites or locations?</h3>
            <div className="sb-scale">
              <input
                type="range"
                min={1}
                max={50}
                value={answers.sites}
                onChange={(e) => {
                  set("sites", Number(e.target.value));
                }}
              />
              <b className="sb-scale__value">{answers.sites}</b>
            </div>
          </div>
        );
      case 4:
        return (
          <Step
            items={PRIORITIES}
            selectedId={answers.priority}
            onSelect={(id) => {
              set("priority", id as PriorityId);
            }}
          />
        );
    }
  };

  if (currentStep > TOTAL) {
    const result = recommend(answers);

    const tags = [
      INDUSTRIES.find((i) => i.id === answers.industry)?.title ?? "",
      (answers.industry
        ? TASKS_BY_INDUSTRY[answers.industry].find((t) => t.id === answers.task)
        : undefined
      )?.title ?? "",
      `${answers.sites} sites`,
      `Priority: ${PRIORITIES.find((p) => p.id === answers.priority)?.title ?? ""}`,
    ];

    return (
      <section className="sb">
        <h2 className="sb-step__title">Your solution</h2>
        <Result
          result={result}
          tags={tags}
          onRestart={() => {
            setAnswers(EMPTY);
            setCurrentStep(1);
          }}
        />
      </section>
    );
  }

  return (
    <section className="sb">
      <Progress step={currentStep} total={TOTAL} />
      <h2 className="sb-step__title">{TITLES[currentStep - 1]}</h2>

      <div className="solution-builder">{renderStep()}</div>

      <div className="sb-nav">
        <button
          type="button"
          className="sb-btn sb-btn-ghost"
          disabled={currentStep === 1}
          onClick={() => {
            setCurrentStep(currentStep - 1);
          }}
        >
          ← Back
        </button>
        <button
          type="button"
          className="sb-btn"
          disabled={!canNext}
          onClick={() => {
            setCurrentStep(currentStep + 1);
          }}
        >
          {currentStep === TOTAL ? "See solutions" : "Next →"}
        </button>
      </div>
    </section>
  );
}

const root = document.querySelector<HTMLElement>("[data-solution-builder]");
if (root) createRoot(root).render(<SolutionBuilder />);
