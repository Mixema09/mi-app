"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ArrowRight,
  LockSimple,
  Brain,
  Heart,
  Star,
  Sparkle,
  ArrowsClockwise,
  Wallet,
  SealCheck,
} from "@phosphor-icons/react";

// ─── Types ──────────────────────────────────────────────────

type Herida = "merecimiento" | "escasez" | "sabotaje" | "valor";

const HERIDAS: Record<Herida, { title: string; color: string; icon: React.ReactNode; routeItems: string[] }> = {
  merecimiento: {
    title: "Herida del Merecimiento",
    color: "var(--herida-merecimiento)",
    icon: <Heart weight="duotone" size={28} />,
    routeItems: [
      "Ejercicio: la voz que dice 'no mereces'",
      "Carta a tu niña interior y el dinero",
      "Reprogramación del guión de merecimiento",
      "Hito 1 — Sentir que está bien recibir",
    ],
  },
  escasez: {
    title: "Herida de Escasez",
    color: "var(--herida-escasez)",
    icon: <Wallet weight="duotone" size={28} />,
    routeItems: [
      "Ejercicio: mapa del flujo emocional del dinero",
      "El origen familiar de la escasez",
      "Reprogramación del ciclo de vaciamiento",
      "Hito 1 — Soltar la urgencia de gastarlo",
    ],
  },
  sabotaje: {
    title: "Herida del Sabotaje",
    color: "var(--herida-sabotaje)",
    icon: <ArrowsClockwise weight="duotone" size={28} />,
    routeItems: [
      "Ejercicio: el ciclo exacto de tu sabotaje",
      "El miedo que se activa cuando prosperas",
      "Reprogramación del techo de la abundancia",
      "Hito 1 — Tolerar que te vaya bien",
    ],
  },
  valor: {
    title: "Herida del Valor",
    color: "var(--herida-valor)",
    icon: <Star weight="duotone" size={28} />,
    routeItems: [
      "Ejercicio: el precio que evitas poner",
      "El origen de cobrar como 'pedir'",
      "Reprogramación del autovalor económico",
      "Hito 1 — Cobrar sin pedir disculpas",
    ],
  },
};

// ─── Main component ─────────────────────────────────────────

export default function PaywallPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const [herida, setHerida] = useState<Herida>("merecimiento");
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("raiz_herida") as Herida | null;
    if (stored && HERIDAS[stored]) setHerida(stored);
    const answers = localStorage.getItem("raiz_answers");
    if (answers) {
      try {
        const parsed = JSON.parse(answers);
        if (parsed.name) setName(parsed.name.split(" ")[0]);
      } catch {}
    }
  }, []);

  const heridaData = HERIDAS[herida];
  const price = billing === "annual" ? "$4.99" : "$7.49";
  const yearTotal = "$59.99";
  const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
  });

  function handleCTA() {
    setIsPending(true);
    router.push("/login");
  }

  const FEATURES = [
    { icon: <Brain weight="duotone" size={20} />, label: "Chat IA con memoria — te recuerda entre sesiones" },
    { icon: <Sparkle weight="duotone" size={20} />, label: "Ruta personalizada de 90 días para tu herida" },
    { icon: <Star weight="duotone" size={20} />, label: "Ejercicios diarios de 5 minutos del Método RAÍZ™" },
  ];

  return (
    <div
      className="min-h-dvh"
      style={{ background: "var(--surface-base)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 px-4 pt-safe-top" style={{ background: "var(--surface-base)" }}>
        <div className="mx-auto flex max-w-sm items-center justify-between py-4">
          <Link href="/" className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Reconecta<span style={{ color: "var(--brand-primary)" }}>AI</span>
          </Link>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            7 días gratis
          </span>
        </div>
      </header>

      <main className="px-4 pb-16">
        <div className="mx-auto max-w-sm">

          {/* Hero — resultado personalizado */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6 text-center"
          >
            <div
              className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[var(--radius-lg)]"
              style={{
                background: `color-mix(in oklab, ${heridaData.color} 12%, transparent)`,
                color: heridaData.color,
              }}
            >
              {heridaData.icon}
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Tu diagnóstico está listo
            </p>
            <h1
              className="mt-2 font-display text-2xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {name ? `${name}, identificamos tu` : "Identificamos tu"}{" "}
              <span style={{ color: heridaData.color }}>{heridaData.title}</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Tu ruta de 90 días está lista. Desbloquéala con 7 días gratis — sin tarjeta hoy.
            </p>
          </motion.div>

          {/* Ruta personalizada (preview) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-[var(--radius-md)] overflow-hidden"
            style={{
              background: "var(--surface-elevated)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="px-4 py-3"
              style={{
                background: `color-mix(in oklab, ${heridaData.color} 8%, transparent)`,
                borderBottom: `1px solid color-mix(in oklab, ${heridaData.color} 15%, transparent)`,
              }}
            >
              <p className="text-xs font-semibold" style={{ color: heridaData.color }}>
                Tu ruta personalizada — Semana 1
              </p>
            </div>
            <div className="flex flex-col">
              {heridaData.routeItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid var(--border-subtle)`,
                    opacity: i === 0 ? 1 : 0.4,
                  }}
                >
                  {i === 0 ? (
                    <Check size={16} weight="bold" style={{ color: heridaData.color }} />
                  ) : (
                    <LockSimple size={16} weight="bold" style={{ color: "var(--text-muted)" }} />
                  )}
                  <span className="text-sm" style={{ color: i === 0 ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex flex-col gap-3"
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "color-mix(in oklab, var(--brand-primary) 10%, transparent)",
                    color: "var(--brand-primary)",
                  }}
                >
                  {f.icon}
                </span>
                <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
                  {f.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Pricing toggle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.26, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            {/* Toggle */}
            <div
              className="flex rounded-[var(--radius-md)] p-1"
              style={{ background: "var(--surface-sunken)" }}
            >
              {(["annual", "monthly"] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setBilling(plan)}
                  className="relative flex-1 rounded-[12px] py-2.5 text-sm font-medium"
                  style={{
                    color: billing === plan ? "var(--text-primary)" : "var(--text-muted)",
                    transition: "color 200ms",
                  }}
                >
                  {billing === plan && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-[12px]"
                      style={{ background: "var(--surface-elevated)", boxShadow: "var(--shadow-sm)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative">
                    {plan === "annual" ? "Anual" : "Mensual"}
                  </span>
                  {plan === "annual" && (
                    <span
                      className="relative ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold"
                      style={{
                        background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)",
                        color: "var(--brand-primary)",
                      }}
                    >
                      −33%
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Price card */}
            <div
              className="mt-3 rounded-[var(--radius-md)] p-5"
              style={{
                background: "var(--surface-elevated)",
                border: "1.5px solid var(--brand-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex items-end gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={price}
                    initial={{ y: prefersReduced ? 0 : -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: prefersReduced ? 0 : 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-display text-4xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {price}
                  </motion.span>
                </AnimatePresence>
                <span className="mb-1 text-sm" style={{ color: "var(--text-muted)" }}>/ mes</span>
                {billing === "annual" && (
                  <span className="mb-1 ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                    {yearTotal}/año
                  </span>
                )}
              </div>
              {billing === "annual" && (
                <p className="mt-1 text-xs font-medium" style={{ color: "var(--brand-primary)" }}>
                  2 meses gratis vs. mensual
                </p>
              )}

              <div className="mt-4 flex flex-col gap-2">
                {[
                  "7 días de prueba completa, gratis",
                  billing === "annual" ? `Se cobra ${yearTotal} el ${trialEnd}` : `Se cobra $7.49 el ${trialEnd}`,
                  "Cancela cuando quieras, sin penalización",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={14} weight="bold" style={{ color: "var(--brand-primary)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              onClick={handleCTA}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
              style={{
                background: "var(--brand-primary)",
                color: "white",
                boxShadow: "0 4px 18px rgba(224,123,64,0.35)",
                opacity: isPending ? 0.85 : 1,
              }}
            >
              Empezar mis 7 días gratis
              <ArrowRight size={18} weight="bold" />
            </motion.button>

            {/* Guarantee */}
            <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-md)] p-4" style={{ background: "var(--surface-sunken)" }}>
              <SealCheck size={20} weight="duotone" style={{ color: "var(--brand-primary)", flexShrink: 0 }} />
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--text-primary)" }}>Garantía de 14 días.</strong>{" "}
                Si en los primeros 14 días sientes que no fue para ti, te regresamos el dinero sin preguntas. Confiamos en tu primera revelación.
              </p>
            </div>

            {/* Skip */}
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Ahora no — continuar sin plan
              </Link>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
