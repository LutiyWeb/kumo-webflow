import { createRoot } from "react-dom/client";
import "./solution-builder/solution-builder.css";
import { useState } from "react";
import {
  TITLES,
  PRIORITIES,
  INDUSTRIES,
  TASKS_BY_INDUSTRY,
} from "./solution-builder/config";
import Step from "./solution-builder/Step";
import type { Answers } from "./solution-builder/types";

function SolutionBuilder() {
  const EMPTY: Answers = {
    industry: null,
    task: null,
    sites: 5,
    priority: null,
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedSites, setSelectedSites] = useState<number>(5);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  function checkCurrentStep(currentStep: number) {
    switch (currentStep) {
      case 1:
        return INDUSTRIES;
      case 2:
        return selectedIndustry
          ? TASKS_BY_INDUSTRY[
              selectedIndustry as keyof typeof TASKS_BY_INDUSTRY
            ]
          : null;
      default:
        return null;
    }
  }

  const currentData = checkCurrentStep(currentStep);
  console.log(currentData);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step
            items={currentData}
            selectedId={selectedIndustry}
            onSelect={(id) => {
              setSelectedIndustry(id);
              setSelectedTask(null);
              set("industry", id as any); // Наполнение общего объекта
              set("task", null);
            }}
          />
        );

      case 2:
        return (
          <Step
            items={currentData}
            selectedId={selectedTask}
            onSelect={(id) => {
              setSelectedTask(id);
              set("task", id as any);
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
                value={selectedSites}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setSelectedSites(value);
                  set("sites", value);
                }}
              />
              <b className="sb-scale__value">{selectedSites}</b>
            </div>
          </div>
        );
      case 4:
        return (
          <Step
            items={PRIORITIES}
            selectedId={selectedPriority}
            onSelect={(id) => {
              setSelectedPriority(id);
              set("priority", id as any);
            }}
          />
        );
    }
  };

  console.log(answers, "answers");

  return (
    <section className="sb">
      {/* 1. Прогресс */}
      <div className="sb-progress">
        <span className="sb-progress__label">{currentStep} / 4</span>
        <div className="sb-progress__bar">
          <i style={{ width: `${(currentStep / 4) * 100}%` }} />
        </div>
      </div>
      {/* 2. Заголовок */}
      <h2 className="sb-step__title">{TITLES[currentStep]}</h2>
      <h2 className="sb-step__title"></h2>

      {/* 3. Сетка карточек */}
      <div className="solution-builder">{renderStep()}</div>

      {selectedIndustry}
      {/* 4. Навигация */}
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
          disabled={!selectedIndustry}
          onClick={() => {
            setCurrentStep(currentStep + 1);
          }}
        >
          Next →
        </button>
      </div>
    </section>
  );
}

const root = document.querySelector<HTMLElement>("[data-solution-builder]");
if (root) createRoot(root).render(<SolutionBuilder />);
