"use client";

import { useActionState, useState } from "react";
import {
  DIMENSIONS,
  QUESTIONS,
  LIKERT_OPTIONS,
  OPEN_GOAL_QUESTION,
} from "@/lib/diagnosis";
import {
  saveOnboardingAction,
  type OnboardingState,
} from "@/lib/actions/onboarding";

const TOTAL_STEPS = DIMENSIONS.length + 1; // dimensiones + pregunta abierta

export function OnboardingForm() {
  const [state, action, pending] = useActionState<OnboardingState, FormData>(
    saveOnboardingAction,
    null,
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const isGoalStep = step === DIMENSIONS.length;
  const currentDimension = DIMENSIONS[step];
  const currentQuestions = currentDimension
    ? QUESTIONS.filter((q) => q.dimension === currentDimension.id)
    : [];
  const currentAnswered = currentQuestions.every(
    (q) => answers[q.id] !== undefined,
  );

  return (
    <form action={action} className="mx-auto w-full max-w-xl">
      {/* Progreso */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            Paso {step + 1} de {TOTAL_STEPS}
          </span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-neutral-900 transition-all dark:bg-white"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Todos los inputs se mantienen montados; solo mostramos el paso activo */}
      {DIMENSIONS.map((dim, i) => {
        const qs = QUESTIONS.filter((q) => q.dimension === dim.id);
        return (
          <div key={dim.id} className={i === step ? "block" : "hidden"}>
            <h2 className="text-lg font-semibold">{dim.label}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {dim.description}
            </p>
            <div className="mt-6 space-y-6">
              {qs.map((q) => (
                <fieldset key={q.id}>
                  <legend className="mb-2 text-sm font-medium">{q.text}</legend>
                  <div className="flex flex-wrap gap-2">
                    {LIKERT_OPTIONS.map((opt) => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition ${
                            selected
                              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                              : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.value}
                            className="sr-only"
                            checked={selected}
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.id]: opt.value,
                              }))
                            }
                          />
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        );
      })}

      {/* Paso final: meta personal (abierta, opcional) */}
      <div className={isGoalStep ? "block" : "hidden"}>
        <h2 className="text-lg font-semibold">Tu meta</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Esto nos ayuda a personalizar tu ruta (opcional).
        </p>
        <textarea
          name={OPEN_GOAL_QUESTION.id}
          rows={3}
          placeholder={OPEN_GOAL_QUESTION.text}
          className="mt-4 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        />
      </div>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}

      {/* Navegación */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-gray-500 underline disabled:opacity-0 dark:text-gray-400"
        >
          Atrás
        </button>

        {isGoalStep ? (
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {pending ? "Calculando…" : "Ver mi diagnóstico"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!currentAnswered}
            className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Siguiente
          </button>
        )}
      </div>
    </form>
  );
}
