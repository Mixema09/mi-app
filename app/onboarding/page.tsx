"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CaretLeft,
  Check,
  ArrowRight,
  SpinnerGap,
  Wallet,
  Brain,
  Heart,
  Warning,
  Smiley,
  SmileySad,
  Fire,
  Clock,
  Star,
  LockSimple,
  ArrowsClockwise,
  HandHeart,
} from "@phosphor-icons/react";

// ─── Types ─────────────────────────────────────────────────

interface Answers {
  name: string;
  painPattern: string;
  frequency: string;
  familyOrigin: string;
  emotionalFeel: string;
  triedBefore: string;
  goal: string;
  timeCommitment: string;
}

// ─── Perfil Emocional™ engine ──────────────────────────────

type Herida =
  | "merecimiento"
  | "escasez"
  | "sabotaje"
  | "valor";

const HERIDAS: Record<
  Herida,
  { title: string; subtitle: string; color: string; icon: string }
> = {
  merecimiento: {
    title: "Herida del Merecimiento",
    subtitle: "Sientes que el dinero es para otros, no para ti. No porque no trabajes — sino porque en algún lugar de ti, una voz dice que no te lo mereces.",
    color: "var(--brand-primary)",
    icon: "❤️",
  },
  escasez: {
    title: "Herida de Escasez",
    subtitle: "El dinero llega, pero nunca queda. No es un problema de ingreso — es un patrón emocional que repite el mensaje de que 'nunca habrá suficiente'.",
    color: "var(--brand-gold)",
    icon: "💛",
  },
  sabotaje: {
    title: "Herida del Sabotaje",
    subtitle: "Cuando finalmente te va bien, algo lo destruye. La abundancia activa un miedo más profundo que la escasez: el miedo a lo que significa merecerla.",
    color: "var(--herida-sabotaje)",
    icon: "💜",
  },
  valor: {
    title: "Herida del Valor",
    subtitle: "Te cuesta cobrar lo que vales. Bajas tus precios, das de más, priorizas a otros. En el fondo, cobrar se siente como una declaración de que vales.",
    color: "var(--herida-valor)",
    icon: "💚",
  },
};

function computeHerida(answers: Partial<Answers>): Herida {
  const p = answers.painPattern ?? "";
  if (p.includes("merezco") || p.includes("merecedora") || p.includes("siento que no")) return "merecimiento";
  if (p.includes("se va") || p.includes("nunca alcanza") || p.includes("no alcanza")) return "escasez";
  if (p.includes("saboteo") || p.includes("cuando me va bien")) return "sabotaje";
  if (p.includes("cobrar") || p.includes("valor") || p.includes("cobro")) return "valor";
  // fallback: pick by family origin
  const f = answers.familyOrigin ?? "";
  if (f.includes("nunca") || f.includes("escasez")) return "escasez";
  if (f.includes("culpa") || f.includes("vergüenza")) return "merecimiento";
  return "merecimiento";
}

// ─── Quiz steps ─────────────────────────────────────────────

interface Step {
  id: string;
  type: "welcome" | "input" | "chips" | "recognition" | "loading" | "reveal";
  question?: string;
  microcopy?: string;
  key?: keyof Answers;
  options?: { label: string; value: string; icon?: React.ReactNode }[];
  multi?: boolean;
}

const STEPS: Step[] = [
  { id: "welcome", type: "welcome" },
  {
    id: "name",
    type: "input",
    question: "¿Cómo te llamamos?",
    microcopy: "Puedes usar un apodo — lo que te resulte más cómodo.",
    key: "name",
  },
  {
    id: "painPattern",
    type: "chips",
    question: "¿Cuál de estos patrones reconoces más en ti?",
    microcopy: "El que más duele de admitir.",
    key: "painPattern",
    options: [
      { label: "Trabajo mucho pero el dinero nunca alcanza", value: "no alcanza", icon: <Wallet weight="duotone" size={22} /> },
      { label: "Siento que no me merezco prosperar", value: "no merezco merecedora siento que no", icon: <Heart weight="duotone" size={22} /> },
      { label: "Cuando me va bien, algo lo saboteo", value: "cuando me va bien saboteo", icon: <ArrowsClockwise weight="duotone" size={22} /> },
      { label: "Me cuesta cobrar lo que valgo", value: "cobrar cobro valor", icon: <Star weight="duotone" size={22} /> },
    ],
  },
  {
    id: "frequency",
    type: "chips",
    question: "¿Con qué frecuencia sientes que el dinero 'se va solo'?",
    key: "frequency",
    options: [
      { label: "Todos los meses sin excepción", value: "siempre" },
      { label: "La mayoría de los meses", value: "casi siempre" },
      { label: "En épocas de estrés o cambios", value: "a veces" },
      { label: "Cuando empiezo a ganar más", value: "cuando me va bien" },
    ],
  },
  {
    id: "familyOrigin",
    type: "chips",
    question: "¿Cómo era el dinero en tu familia cuando crecías?",
    microcopy: "La raíz emocional suele empezar aquí.",
    key: "familyOrigin",
    options: [
      { label: "Nunca alcanzaba — había tensión constante", value: "nunca escasez" },
      { label: "Había dinero, pero el tema daba vergüenza o culpa", value: "culpa vergüenza" },
      { label: "No se hablaba del dinero, era tabú", value: "tabú silencio" },
      { label: "Era estable, pero nunca aprendí a manejarlo", value: "estable sin aprender" },
    ],
  },
  {
    id: "emotionalFeel",
    type: "chips",
    question: "Cuando piensas en dinero, ¿qué sientes primero?",
    key: "emotionalFeel",
    options: [
      { label: "Ansiedad o miedo", value: "ansiedad miedo", icon: <Warning weight="duotone" size={22} /> },
      { label: "Vergüenza o culpa", value: "vergüenza culpa", icon: <SmileySad weight="duotone" size={22} /> },
      { label: "Frustración o enojo", value: "frustración enojo", icon: <Fire weight="duotone" size={22} /> },
      { label: "Esperanza mezclada con duda", value: "esperanza duda", icon: <Smiley weight="duotone" size={22} /> },
    ],
  },
  {
    id: "triedBefore",
    type: "chips",
    question: "¿Ya intentaste cambiar tu relación con el dinero antes?",
    key: "triedBefore",
    options: [
      { label: "Sí — cursos o libros, sin resultado duradero", value: "cursos libros sin resultado" },
      { label: "Sí — terapia, pero no tocamos el tema del dinero", value: "terapia sin dinero" },
      { label: "Sí — estrategias financieras, pero no con lo emocional", value: "finanzas sin emocional" },
      { label: "No — es la primera vez que lo intento", value: "primera vez" },
    ],
  },
  {
    id: "goal",
    type: "chips",
    question: "¿Qué quieres sentir en 90 días?",
    microcopy: "Tu meta emocional, no financiera.",
    key: "goal",
    options: [
      { label: "Que el dinero que gano sea suficiente", value: "suficiencia" },
      { label: "Sentirme merecedora de prosperar sin culpa", value: "merecimiento" },
      { label: "Dejar de sabotear lo que construyo", value: "no sabotaje" },
      { label: "Cobrarme lo que valgo sin vergüenza", value: "valor propio" },
    ],
  },
  {
    id: "timeCommitment",
    type: "chips",
    question: "¿Cuántos minutos al día puedes dedicarle?",
    microcopy: "Sin presión — la constancia importa más que la duración.",
    key: "timeCommitment",
    options: [
      { label: "5 minutos — lo que pueda", value: "5 min", icon: <Clock weight="duotone" size={22} /> },
      { label: "10 minutos", value: "10 min", icon: <Clock weight="duotone" size={22} /> },
      { label: "15-20 minutos", value: "15 min", icon: <Clock weight="duotone" size={22} /> },
      { label: "Cuando pueda, sin rutina fija", value: "sin rutina", icon: <Brain weight="duotone" size={22} /> },
    ],
  },
  { id: "recognition", type: "recognition" },
  { id: "loading", type: "loading" },
  { id: "reveal", type: "reveal" },
];

const QUIZ_STEPS = STEPS.filter((s) => s.type === "chips" || s.type === "input");
const QUIZ_COUNT = QUIZ_STEPS.length;

function stepProgress(step: number): number {
  const s = STEPS[step];
  if (s?.type === "welcome") return 0;
  if (s?.type === "recognition" || s?.type === "loading" || s?.type === "reveal") return 100;
  const idx = QUIZ_STEPS.findIndex((q) => q.id === s?.id);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / QUIZ_COUNT) * 100);
}

// ─── Sub-components ─────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
      Reconecta<span style={{ color: "var(--brand-primary)" }}>AI</span>
    </Link>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div
      className="h-0.5 w-full overflow-hidden rounded-full"
      style={{ background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--brand-primary)" }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function Chip({
  label,
  icon,
  selected,
  onSelect,
}: {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-4 text-left text-sm font-medium"
      style={{
        background: selected
          ? "color-mix(in oklab, var(--brand-primary) 10%, transparent)"
          : "var(--surface-elevated)",
        border: selected ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        transition: "background 150ms, border-color 150ms",
        minHeight: "56px",
      }}
    >
      {icon && (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: selected
              ? "color-mix(in oklab, var(--brand-primary) 14%, transparent)"
              : "var(--soft3d-bg)",
            boxShadow: selected ? "none" : "var(--soft3d-shadow)",
            color: selected ? "var(--brand-primary)" : "var(--text-secondary)",
            transition: "background 150ms, color 150ms",
          }}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 leading-snug">{label}</span>
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex size-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--brand-primary)" }}
          >
            <Check size={12} weight="bold" color="white" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Main component ─────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [inputValue, setInputValue] = useState("");
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [loadingPct, setLoadingPct] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = STEPS[step];
  const pct = stepProgress(step);

  // Persist to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("raiz_answers", JSON.stringify(answers));
    }
  }, [answers]);

  // Auto-focus input
  useEffect(() => {
    if (currentStep?.type === "input") {
      setTimeout(() => inputRef.current?.focus(), 350);
      setInputValue(answers[currentStep.key as keyof Answers] ?? "");
    }
    setSelectedChip(
      currentStep?.key ? (answers[currentStep.key as keyof Answers] ?? null) : null
    );
  }, [step]);

  // Loading animation
  useEffect(() => {
    if (currentStep?.type !== "loading") return;
    let pct = 0;
    const intervals = [
      { target: 30, delay: 0, duration: 600 },
      { target: 60, delay: 700, duration: 800 },
      { target: 85, delay: 1600, duration: 600 },
      { target: 100, delay: 2400, duration: 400 },
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    intervals.forEach(({ target, delay, duration }) => {
      timers.push(
        setTimeout(() => {
          const start = pct;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(start + (target - start) * progress);
            setLoadingPct(current);
            pct = current;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, delay)
      );
    });
    timers.push(
      setTimeout(() => {
        localStorage.setItem("raiz_herida", computeHerida(answers));
        goNext();
      }, 3100)
    );
    return () => timers.forEach(clearTimeout);
  }, [step]);

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleChipSelect(value: string) {
    if (!currentStep?.key) return;
    setSelectedChip(value);
    setAnswers((prev) => ({ ...prev, [currentStep.key!]: value }));
    setTimeout(goNext, 600);
  }

  function handleInputContinue() {
    if (!inputValue.trim() || !currentStep?.key) return;
    setAnswers((prev) => ({ ...prev, [currentStep.key!]: inputValue.trim() }));
    goNext();
  }

  function handleRevealCTA() {
    router.push("/paywall");
  }

  const variants = {
    enter: (dir: number) => ({
      x: prefersReduced ? 0 : dir * 40,
    }),
    center: { x: 0 },
    exit: (dir: number) => ({
      x: prefersReduced ? 0 : dir * -40,
      opacity: 0,
    }),
  };

  const transition = {
    duration: prefersReduced ? 0 : 0.32,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  const herida = computeHerida(answers);
  const heridaData = HERIDAS[herida];
  const firstName = answers.name?.split(" ")[0] ?? "";

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: "var(--surface-base)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 px-4 pt-safe-top" style={{ background: "var(--surface-base)" }}>
        <div className="mx-auto flex max-w-sm flex-col gap-3 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step > 0 && currentStep?.type !== "loading" && currentStep?.type !== "reveal" && (
                <button
                  onClick={goBack}
                  className="flex size-11 items-center justify-center rounded-full"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label="Volver"
                >
                  <CaretLeft size={20} weight="bold" />
                </button>
              )}
              <Logo />
            </div>
            {currentStep?.type !== "welcome" && currentStep?.type !== "reveal" && (
              <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                {pct < 100 ? `${pct}%` : "Listo"}
              </span>
            )}
          </div>
          {currentStep?.type !== "welcome" && currentStep?.type !== "reveal" && (
            <ProgressBar pct={pct === 0 ? 6 : pct} />
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="flex flex-1 flex-col"
          >
            {/* ── Welcome ── */}
            {currentStep?.type === "welcome" && (
              <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
                <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8 flex size-20 items-center justify-center rounded-[var(--radius-lg)]"
                  style={{
                    background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)",
                    boxShadow: "0 8px 32px rgba(224,123,64,0.18)",
                  }}
                >
                  <Brain size={40} weight="duotone" style={{ color: "var(--brand-primary)" }} />
                </motion.div>

                <motion.h1
                  initial={{ y: 16 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-3xl font-bold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tu diagnóstico<br />emocional del dinero
                </motion.h1>

                <motion.p
                  initial={{ y: 16 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  8 preguntas. 4 minutos. Vamos a identificar la herida emocional que está detrás de tu patrón con el dinero.
                </motion.p>

                <motion.div
                  initial={{ y: 16 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 flex flex-col gap-3 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {["Gratis — sin tarjeta", "Solo para ti, privado", "Basado en el Método RAÍZ™"].map(
                    (item, i) => (
                      <div key={i} className="flex items-center justify-center gap-2">
                        <Check size={14} weight="bold" style={{ color: "var(--brand-primary)" }} />
                        <span>{item}</span>
                      </div>
                    )
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 16 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.42, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-10 w-full max-w-xs"
                >
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    onClick={goNext}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
                    style={{
                      background: "var(--brand-primary)",
                      color: "white",
                      boxShadow: "0 4px 18px rgba(224,123,64,0.35)",
                    }}
                  >
                    Empezar mi diagnóstico
                    <ArrowRight size={18} weight="bold" />
                  </motion.button>
                </motion.div>
              </div>
            )}

            {/* ── Input ── */}
            {currentStep?.type === "input" && (
              <div className="flex flex-1 flex-col px-4 pt-6">
                <div className="mx-auto w-full max-w-sm flex-1">
                  <h2
                    className="font-display text-3xl font-bold leading-tight"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                  >
                    {currentStep.question}
                  </h2>
                  {currentStep.microcopy && (
                    <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                      {currentStep.microcopy}
                    </p>
                  )}

                  <div className="mt-8">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInputContinue()}
                      placeholder="Tu nombre o apodo"
                      className="w-full rounded-[var(--radius-md)] px-4 py-4 text-base outline-none"
                      style={{
                        background: "var(--surface-elevated)",
                        border: "1.5px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                        caretColor: "var(--brand-primary)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--brand-primary)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border-subtle)";
                      }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, name: "" }));
                      goNext();
                    }}
                    className="mt-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Prefiero no decirlo
                  </button>
                </div>

                {/* CTA fixed bottom */}
                <div
                  className="sticky bottom-0 px-0 pb-safe-bottom"
                  style={{ background: "var(--surface-base)" }}
                >
                  <div className="py-4">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 80, damping: 18 }}
                      onClick={handleInputContinue}
                      disabled={!inputValue.trim()}
                      className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
                      style={{
                        background: inputValue.trim() ? "var(--brand-primary)" : "var(--surface-sunken)",
                        color: inputValue.trim() ? "white" : "var(--text-muted)",
                        transition: "background 200ms, color 200ms",
                        boxShadow: inputValue.trim() ? "0 4px 18px rgba(224,123,64,0.28)" : "none",
                      }}
                    >
                      Continuar
                      <ArrowRight size={18} weight="bold" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Chips ── */}
            {currentStep?.type === "chips" && (
              <div className="flex flex-1 flex-col px-4 pt-6">
                <div className="mx-auto w-full max-w-sm">
                  <h2
                    className="font-display text-2xl font-bold leading-tight"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                  >
                    {currentStep.question}
                  </h2>
                  {currentStep.microcopy && (
                    <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                      {currentStep.microcopy}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col gap-3">
                    {currentStep.options?.map((opt) => (
                      <Chip
                        key={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                        selected={selectedChip === opt.value}
                        onSelect={() => handleChipSelect(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Recognition ── */}
            {currentStep?.type === "recognition" && (
              <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
                <div className="mx-auto max-w-sm">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[var(--radius-lg)]"
                    style={{ background: "color-mix(in oklab, var(--brand-primary) 10%, transparent)" }}
                  >
                    <HandHeart size={40} weight="duotone" style={{ color: "var(--brand-primary)" }} />
                  </motion.div>

                  <motion.h2
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-2xl font-bold leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Lo que describes tiene nombre.
                  </motion.h2>

                  <motion.p
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 text-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {firstName ? `${firstName}, lo` : "Lo"} que sientes no es falta de disciplina ni de mérito. Es una herida emocional que aprendiste a cargar. Y como toda herida, tiene origen, tiene patrón — y tiene sanación.
                  </motion.p>

                  <motion.p
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 text-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Con tus respuestas, vamos a construir tu <strong style={{ color: "var(--text-primary)" }}>Perfil Emocional del Dinero™</strong> — un diagnóstico personalizado de tu herida y una ruta para sanarla.
                  </motion.p>

                  <motion.button
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileTap={{ scale: 0.97 }}
                    onClick={goNext}
                    className="mt-10 flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
                    style={{
                      background: "var(--brand-primary)",
                      color: "white",
                      boxShadow: "0 4px 18px rgba(224,123,64,0.35)",
                    }}
                  >
                    Ver mi Perfil Emocional
                    <ArrowRight size={18} weight="bold" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* ── Loading ── */}
            {currentStep?.type === "loading" && (
              <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
                <div className="mx-auto w-full max-w-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full"
                    style={{
                      background: "color-mix(in oklab, var(--brand-primary) 10%, transparent)",
                    }}
                  >
                    <SpinnerGap size={32} weight="bold" style={{ color: "var(--brand-primary)" }} />
                  </motion.div>

                  <h2
                    className="font-display text-2xl font-bold leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Construyendo tu Perfil Emocional del Dinero™
                  </h2>

                  {/* Progress bar */}
                  <div className="mt-8">
                    <div
                      className="h-2 w-full overflow-hidden rounded-full"
                      style={{ background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--brand-primary)" }}
                        animate={{ width: `${loadingPct}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    <p className="mt-2 text-right text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {loadingPct}%
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 text-left">
                    {[
                      { label: "Analizando tu patrón principal", done: loadingPct >= 30 },
                      { label: "Identificando el origen emocional", done: loadingPct >= 60 },
                      { label: "Calculando tu herida del dinero", done: loadingPct >= 85 },
                      { label: "Preparando tu ruta personalizada", done: loadingPct >= 100 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <AnimatePresence mode="wait">
                          {item.done ? (
                            <motion.span
                              key="check"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex size-5 shrink-0 items-center justify-center rounded-full"
                              style={{ background: "var(--brand-primary)" }}
                            >
                              <Check size={11} weight="bold" color="white" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="dot"
                              className="size-5 shrink-0 rounded-full"
                              style={{
                                background: "color-mix(in oklab, var(--brand-primary) 15%, transparent)",
                              }}
                            />
                          )}
                        </AnimatePresence>
                        <span
                          className="text-sm"
                          style={{
                            color: item.done ? "var(--text-primary)" : "var(--text-muted)",
                            transition: "color 300ms",
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Reveal ── */}
            {currentStep?.type === "reveal" && (
              <div className="flex flex-1 flex-col px-4 py-8">
                <div className="mx-auto w-full max-w-sm">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                      Tu Perfil Emocional del Dinero™
                    </p>
                    <h2
                      className="mt-3 font-display text-3xl font-bold leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {heridaData.title}
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 rounded-[var(--radius-md)] p-5"
                    style={{
                      background: "color-mix(in oklab, var(--brand-primary) 6%, transparent)",
                      border: "1px solid color-mix(in oklab, var(--brand-primary) 18%, transparent)",
                    }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {heridaData.subtitle}
                    </p>
                  </motion.div>

                  {/* Locked content teaser */}
                  <motion.div
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 overflow-hidden rounded-[var(--radius-md)]"
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div className="px-5 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        Tu ruta de sanación incluye
                      </p>
                    </div>
                    <div className="relative">
                      {["Origen emocional de tu herida", "7 hitos personalizados de sanación", "Ejercicio de raíz para tu patrón específico", "Ruta de 90 días adaptada a ti"].map(
                        (item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 px-5 py-3"
                            style={{
                              borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)",
                              opacity: i < 1 ? 1 : 0.35,
                            }}
                          >
                            {i < 1 ? (
                              <Check size={16} weight="bold" style={{ color: "var(--brand-primary)" }} />
                            ) : (
                              <LockSimple size={16} weight="bold" style={{ color: "var(--text-muted)" }} />
                            )}
                            <span className="text-sm" style={{ color: i < 1 ? "var(--text-primary)" : "var(--text-muted)" }}>
                              {item}
                            </span>
                          </div>
                        )
                      )}
                      {/* Blur overlay */}
                      <div
                        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
                        style={{
                          background: "linear-gradient(to bottom, transparent, var(--surface-elevated))",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 pb-4 pt-2">
                      <LockSimple size={14} weight="bold" style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Desbloquea el perfil completo
                      </span>
                    </div>
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6"
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 80, damping: 18 }}
                      onClick={handleRevealCTA}
                      className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
                      style={{
                        background: "var(--brand-primary)",
                        color: "white",
                        boxShadow: "0 4px 18px rgba(224,123,64,0.35)",
                      }}
                    >
                      Ver mi perfil completo
                      <ArrowRight size={18} weight="bold" />
                    </motion.button>
                    <p className="mt-2 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                      7 días gratis · Sin tarjeta hasta el día 7
                    </p>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
