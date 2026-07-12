"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, useTransform, animate } from "motion/react";
import Link from "next/link";
import {
  Heart,
  Wallet,
  Brain,
  CaretDown,
  SealCheck,
  CurrencyDollar,
  Star,
  ArrowRight,
} from "@phosphor-icons/react";

// ─── Animated number helpers ───────────────────────────────

// Cuenta de 0 → target cuando entra en viewport (§3 $9,600)
function AnimatedCounter({ target, prefix = "" }: { target: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const prefersReduced = useReducedMotion();
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) =>
    `${prefix}${Math.round(v).toLocaleString("es-419")}`
  );
  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) { mv.set(target); return; }
    const controls = animate(mv, target, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [isInView, prefersReduced]); // eslint-disable-line react-hooks/exhaustive-deps
  return <motion.span ref={ref}>{display}</motion.span>;
}

// Cuenta desde ~50 % del valor → target en mount (usado dentro de AnimatePresence §6)
function AnimatedNumber({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const prefersReduced = useReducedMotion();
  // FIX: empieza desde 0 (no 50%) para que el recorrido sea legible y persuasivo
  const mv = useMotionValue(prefersReduced ? value : 0);
  const display = useTransform(mv, (v) => v.toFixed(decimals));
  useEffect(() => {
    if (prefersReduced) { mv.set(value); return; }
    const controls = animate(mv, value, { duration: 0.8, ease: "easeOut" });
    return controls.stop;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <motion.span>{display}</motion.span>;
}

// ─── Schematic app mockups (§5 + hero) ────────────────────

function DiagnosticoScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "var(--surface-base)", overflow: "hidden" }}>
      <div style={{ padding: "8px 10px 6px", background: "var(--surface-elevated)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "9px", color: "var(--brand-primary)" }}>ReconectaAI</span>
        <div style={{ display: "flex", gap: "3px" }}>
          {[1, 2, 3, 4].map((j) => (
            <div key={j} style={{ width: j === 1 ? "14px" : "6px", height: "3px", borderRadius: "9999px", background: j === 1 ? "var(--brand-primary)" : "color-mix(in oklab, var(--text-muted) 30%, transparent)" }} />
          ))}
        </div>
      </div>
      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <div>
          <span style={{ fontSize: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>DIAGNÓSTICO · PASO 1 DE 4</span>
          <p style={{ marginTop: "4px", fontSize: "8px", fontWeight: 700, lineHeight: 1.35, color: "var(--text-primary)" }}>¿Cuándo sentiste por primera vez que el dinero era escaso?</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {[
            { label: "En la infancia", selected: true },
            { label: "En la adolescencia", selected: false },
            { label: "Al independizarme", selected: false },
          ].map((opt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", borderRadius: "8px", background: opt.selected ? "color-mix(in oklab, var(--brand-primary) 10%, transparent)" : "var(--surface-elevated)", border: `1px solid ${opt.selected ? "var(--brand-primary)" : "color-mix(in oklab, var(--text-muted) 25%, transparent)"}` }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "9999px", flexShrink: 0, border: `1.5px solid ${opt.selected ? "var(--brand-primary)" : "var(--text-muted)"}`, background: opt.selected ? "var(--brand-primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {opt.selected && <div style={{ width: "4px", height: "4px", borderRadius: "9999px", background: "var(--surface-elevated)" }} />}
              </div>
              <span style={{ fontSize: "7px", fontWeight: opt.selected ? 600 : 400, color: opt.selected ? "var(--brand-primary)" : "var(--text-secondary)" }}>{opt.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto" }}>
          <div style={{ padding: "7px", borderRadius: "9999px", textAlign: "center", background: "var(--brand-primary)", color: "var(--surface-elevated)", fontSize: "7px", fontWeight: 700 }}>
            Continuar →
          </div>
        </div>
      </div>
    </div>
  );
}

function PerfilScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setBarsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bars = [
    { label: "Miedo a la escasez", pct: 78, varColor: "var(--brand-primary)" },
    { label: "Culpa al gastar", pct: 65, varColor: "var(--brand-gold)" },
    { label: "Bloqueo al recibir", pct: 42, varColor: "var(--brand-primary-mid)" },
    { label: "Autoboicot financiero", pct: 55, varColor: "var(--text-secondary)" },
  ];
  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "var(--surface-base)", overflow: "hidden" }}>
      <div style={{ padding: "8px 10px 6px", background: "var(--surface-elevated)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "9px", color: "var(--brand-primary)" }}>ReconectaAI</span>
      </div>
      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <div>
          <span style={{ fontSize: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>PERFIL EMOCIONAL™</span>
          <p style={{ marginTop: "3px", fontSize: "9px", fontWeight: 700, color: "var(--text-primary)" }}>Tu mapa del dinero</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {bars.map((bar, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "6px", color: "var(--text-secondary)" }}>{bar.label}</span>
                <span style={{ fontSize: "6.5px", fontWeight: 700, color: bar.varColor }}>{bar.pct}%</span>
              </div>
              <div style={{ height: "4px", borderRadius: "9999px", background: "color-mix(in oklab, var(--text-muted) 20%, transparent)", overflow: "hidden" }}>
                {/* FIX baseline #3: barras se dibujan al entrar en viewport */}
                <div style={{
                  width: barsVisible ? `${bar.pct}%` : "0%",
                  height: "100%",
                  background: bar.varColor,
                  borderRadius: "inherit",
                  transition: `width ${500 + i * 80}ms ease-out ${i * 80}ms`,
                }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "8px", borderRadius: "8px", background: "color-mix(in oklab, var(--brand-primary) 8%, transparent)", border: "1px solid color-mix(in oklab, var(--brand-primary) 22%, transparent)" }}>
          <span style={{ fontSize: "6px", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>HERIDA RAÍZ</span>
          <p style={{ marginTop: "3px", fontSize: "7px", color: "var(--text-secondary)", lineHeight: 1.4 }}>Miedo a la escasez formado en la infancia por inseguridad económica familiar.</p>
        </div>
      </div>
    </div>
  );
}

function RutaScreen() {
  const steps = [
    { day: "DÍA 1", title: "La herida de escasez", state: "done" },
    { day: "DÍA 2", title: "El niño que sobrevivió", state: "done" },
    { day: "DÍA 3", title: "Romper el pacto", state: "active" },
    { day: "DÍA 4", title: "La nueva narrativa", state: "locked" },
    { day: "DÍA 5", title: "Zona de merecimiento", state: "locked" },
  ] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "var(--surface-base)", overflow: "hidden" }}>
      <div style={{ padding: "8px 10px 6px", background: "var(--surface-elevated)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "9px", color: "var(--brand-primary)" }}>ReconectaAI</span>
      </div>
      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <div>
          <span style={{ fontSize: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>RUTA PERSONALIZADA</span>
          <p style={{ marginTop: "3px", fontSize: "9px", fontWeight: 700, color: "var(--text-primary)" }}>Tu camino de sanación</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 8px", borderRadius: "8px", background: step.state === "active" ? "color-mix(in oklab, var(--brand-primary) 10%, transparent)" : step.state === "done" ? "var(--surface-elevated)" : "var(--surface-sunken)", border: `1px solid ${step.state === "active" ? "var(--brand-primary)" : "color-mix(in oklab, var(--text-muted) 18%, transparent)"}` }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "9999px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: step.state === "done" ? "var(--brand-primary)" : step.state === "active" ? "color-mix(in oklab, var(--brand-primary) 15%, transparent)" : "color-mix(in oklab, var(--text-muted) 20%, transparent)", border: step.state === "active" ? "1.5px solid var(--brand-primary)" : "none" }}>
                {step.state === "done" ? (
                  <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                    <path d="M0.5 2.5L2.5 4.5L6.5 0.5" stroke="var(--surface-elevated)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div style={{ width: "4px", height: "4px", borderRadius: "9999px", background: step.state === "active" ? "var(--brand-primary)" : "var(--text-muted)", opacity: step.state === "locked" ? 0.4 : 1 }} />
                )}
              </div>
              <div>
                <span style={{ fontSize: "5.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)" }}>{step.day}</span>
                <p style={{ fontSize: "7px", fontWeight: step.state === "active" ? 600 : 400, color: step.state === "active" ? "var(--brand-primary)" : step.state === "done" ? "var(--text-primary)" : "var(--text-muted)" }}>{step.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EjercicioScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "var(--surface-base)", overflow: "hidden" }}>
      <div style={{ padding: "8px 10px 6px", background: "var(--surface-elevated)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "9px", color: "var(--brand-primary)" }}>ReconectaAI</span>
      </div>
      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <span style={{ fontSize: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>EJERCICIO · DÍA 3</span>
        {/* IA bubble */}
        <div style={{ maxWidth: "88%", padding: "7px 9px", borderRadius: "12px 12px 12px 2px", background: "var(--surface-elevated)" }}>
          <p style={{ fontSize: "6.5px", lineHeight: 1.45, color: "var(--text-secondary)" }}>¿Qué sentías a los 8 años cuando no había suficiente dinero en casa?</p>
        </div>
        {/* Usuario */}
        <div style={{ maxWidth: "82%", alignSelf: "flex-end", padding: "7px 9px", borderRadius: "12px 12px 2px 12px", background: "var(--brand-primary)" }}>
          <p style={{ fontSize: "6.5px", lineHeight: 1.45, color: "var(--surface-elevated)" }}>Miedo. Y que dependía de portarme bien.</p>
        </div>
        {/* IA bubble 2 */}
        <div style={{ maxWidth: "88%", padding: "7px 9px", borderRadius: "12px 12px 12px 2px", background: "var(--surface-elevated)" }}>
          <p style={{ fontSize: "6.5px", lineHeight: 1.45, color: "var(--text-secondary)" }}>Eso se llama seguridad condicionada. Vamos a trabajar eso juntos...</p>
        </div>
        {/* Indicador de escritura */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "inline-flex", gap: "3px", alignItems: "center", padding: "5px 8px", borderRadius: "9999px", background: "var(--surface-elevated)" }}>
            {[0, 1, 2].map((j) => (
              <div key={j} style={{ width: "3px", height: "3px", borderRadius: "9999px", background: "var(--text-muted)", opacity: 0.4 + j * 0.2 }} />
            ))}
          </div>
        </div>
        {/* Input */}
        <div style={{ padding: "7px 10px", borderRadius: "9999px", background: "var(--surface-elevated)", border: "1px solid color-mix(in oklab, var(--brand-primary) 25%, transparent)" }}>
          <p style={{ fontSize: "6.5px", color: "var(--text-muted)" }}>Escribe tu respuesta...</p>
        </div>
      </div>
    </div>
  );
}

// ─── Primitives ────────────────────────────────────────────

// FIX 1 + 2: HeroReveal — anima en mount (no useInView); respeta prefers-reduced-motion
function HeroReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={prefersReduced ? {} : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// FIX 2: Reveal — añade useReducedMotion; useInView para elementos below-the-fold
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      animate={prefersReduced ? {} : (isInView ? { opacity: 1, y: 0 } : {})}
      transition={prefersReduced ? {} : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
      style={{
        background: "var(--brand-primary-light)",
        borderColor: "color-mix(in oklab, var(--brand-primary) 30%, transparent)",
        color: "var(--brand-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {children}
    </span>
  );
}

function CustomCheck() {
  return (
    <div
      className="flex size-5 shrink-0 items-center justify-center rounded-full"
      style={{ background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)" }}
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke="var(--brand-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Blob({
  color = "primary",
  style,
}: {
  color?: "primary" | "gold";
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        background:
          color === "gold"
            ? "radial-gradient(ellipse at 50% 50%, rgba(201,149,26,0.25) 0%, rgba(224,123,64,0.12) 50%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(224,123,64,0.22) 0%, rgba(201,149,26,0.10) 50%, transparent 70%)",
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
        filter: "blur(8px)",
        ...style,
      }}
    />
  );
}

function Soft3DIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
      style={{
        background: "var(--soft3d-bg)",
        boxShadow: "var(--soft3d-shadow)",
        color: "var(--surface-elevated)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Landing Page ──────────────────────────────────────────

export default function LandingPage() {
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [activeScreen, setActiveScreen] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const itemWidth = 192 + 16; // w-48 + gap-4
    const index = Math.round(el.scrollLeft / itemWidth);
    setActiveScreen(Math.min(index, screens.length - 1));
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const painPoints = [
    {
      icon: <Wallet weight="duotone" size={22} />,
      text: "Trabajo mucho, pero el dinero siempre se va antes de la próxima quincena.",
    },
    {
      icon: <Brain weight="duotone" size={22} />,
      text: "Sé lo que debería hacer con el dinero, pero algo me paraliza cuando intento hacerlo.",
    },
    {
      icon: <Heart weight="duotone" size={22} />,
      text: "Siento culpa cuando gasto en mí. Como si no mereciera que el dinero me alcance.",
    },
    {
      icon: <CurrencyDollar weight="duotone" size={22} />,
      text: "He leído libros, hecho cursos, intentado presupuestos — el patrón siempre regresa.",
    },
  ];

  const raizSteps = [
    {
      letter: "R",
      title: "Revelar la herida de origen",
      desc: "La IA analiza tu historia y encuentra el momento exacto donde se formó la creencia que hoy te limita.",
    },
    {
      letter: "A",
      title: "Acompañar el proceso emocional",
      desc: "Ejercicios de 5 minutos diarios para sanar la herida con la parte de ti que tomó esa decisión de supervivencia.",
    },
    {
      letter: "Í",
      title: "Integrar la nueva narrativa",
      desc: "Reescribes tu relato con el dinero desde tu yo adulto — desde la merecida abundancia, no desde el miedo.",
    },
    {
      letter: "Z",
      title: "Zona de merecimiento activo",
      desc: "Tu Perfil Emocional™ se enriquece con cada sesión. La IA recuerda tu historia y adapta tu camino exacto.",
    },
  ];

  // FIX 3: componentes esquemáticos en lugar de placeholders dashed
  const screens = [
    { label: "Diagnóstico", sub: "Descubre tu herida raíz", Screen: DiagnosticoScreen },
    { label: "Perfil Emocional™", sub: "Tu mapa del dinero", Screen: PerfilScreen },
    { label: "Ruta Personalizada", sub: "Tu camino de sanación", Screen: RutaScreen },
    { label: "Ejercicio Diario", sub: "5 minutos de profundidad", Screen: EjercicioScreen },
  ];

  const testimonials = [
    {
      quote: "Siempre pensé que mi problema era la disciplina. En la primera sesión entendí que era miedo — miedo a que si me iba bien, algo malo pasaría. Nunca lo había conectado así.",
      name: "Valentina R.",
      country: "Colombia",
    },
    {
      quote: "Llevo 10 años ganando buen dinero y siempre llegando a cero. Reconecta AI me hizo ver que me saboteo exactamente cuando las cosas empiezan a funcionar. Es incómodo, pero necesitaba saberlo.",
      name: "Mariana T.",
      country: "México",
    },
    {
      quote: "La parte que más me sorprendió fue el ejercicio del día 2. Lloré. No por tristeza — por reconocimiento. Hacía años que nadie me preguntaba qué sentía a los 8 años cuando no había dinero en casa.",
      name: "Sofía L.",
      country: "Argentina",
    },
  ];

  const valueItems = [
    { label: "Diagnóstico Emocional del Dinero™", value: "$97" },
    { label: "Chat IA con memoria completa", value: "$67" },
    { label: "Ruta personalizada + ejercicio diario", value: "$120" },
  ];

  const faqs = [
    {
      q: "¿Esto realmente funciona si llevo años con el mismo patrón?",
      a: "Sí — de hecho, la duración del patrón confirma que tiene raíz emocional. Reconecta AI trabaja desde la causa, no desde el síntoma. No intenta convencerte de que 'pienses positivo'; te acompaña a entender por qué el dinero activa en ti lo que activa — y desde ahí, el cambio es real.",
    },
    {
      q: "¿En qué es diferente a terapia o a un libro de autoayuda?",
      a: "La terapia tradicional es excelente pero cara y lenta. Los libros no te conocen. Reconecta AI combina estructura terapéutica + personalización real. La IA recuerda cada sesión, adapta tu ruta y está disponible a las 3am cuando el dinero no te deja dormir.",
    },
    {
      q: "¿Necesito tiempo libre o hacer ejercicios largos?",
      a: "No. Cada sesión dura 5 minutos. Diseñado para gente ocupada: un check-in rápido, un ejercicio concreto, una revelación. La constancia de 5 minutos diarios produce más cambio que una sesión mensual de 2 horas.",
    },
    {
      q: "¿Lo que comparto en la app está seguro?",
      a: "Totalmente. Tus respuestas y conversaciones son privadas y nunca se comparten con terceros. Usamos cifrado estándar bancario. Puedes leer nuestra política completa en el pie de página — sin letra pequeña.",
    },
    {
      q: "¿Qué pasa si pruebo y no me convence?",
      a: "Tienes 14 días de garantía completa. Si después de tu Primera Revelación sientes que no fue para ti, te regresamos el dinero sin preguntas. Confiamos en que lo que descubras en los primeros minutos ya va a valer el intento.",
    },
    {
      q: "¿Vale la pena si ya pago otras suscripciones?",
      a: "$7.49 al mes es menos de $0.25 al día — menos que el café de camino al trabajo, menos que el libro de finanzas que dejaste a la mitad. La diferencia real es que esto trabaja la raíz del bloqueo, no el síntoma. Y si en 14 días sientes que no fue para ti, te regresamos cada centavo.",
    },
  ];

  return (
    <div className="min-h-dvh" style={{ background: "var(--surface-base)", color: "var(--text-primary)" }}>

      {/* ──────────────────────────────────────────────────── */}
      {/* §1  HERO                                           */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-10">
        <Blob style={{ left: "-20%", top: "-10%", width: "480px", height: "480px", opacity: 0.7 }} />
        <Blob color="gold" style={{ right: "-15%", bottom: "5%", width: "300px", height: "300px", opacity: 0.5 }} />

        <div className="relative mx-auto max-w-sm">
          {/* Nav */}
          <div className="mb-10 flex items-center justify-between">
            <span className="font-display text-lg font-semibold">
              Reconecta<span style={{ color: "var(--brand-primary)" }}>AI</span>
            </span>
            <Link href="/login" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Iniciar sesión
            </Link>
          </div>

          {/* FIX 1: HeroReveal para elementos above-the-fold */}
          <HeroReveal>
            <Kicker>Método RAÍZ™ · Solo en español</Kicker>
          </HeroReveal>

          <HeroReveal delay={0.06}>
            <h1
              className="mt-4 font-display font-bold leading-[1.12] tracking-tight"
              style={{ fontSize: "clamp(2.2rem, 8vw, 2.8rem)", color: "var(--text-primary)" }}
            >
              La herida no está{" "}
              <em className="not-italic" style={{ color: "var(--brand-primary)" }}>
                en&nbsp;tu bolsillo
              </em>
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.1}>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Millones en LATAM trabajan duro, pero el dinero siempre se va. No es disciplina lo
              que falta — es sanar la raíz emocional que bloquea tu abundancia.
            </p>
          </HeroReveal>

          <HeroReveal delay={0.14}>
            <div id="hero-cta-sentinel" ref={sentinelRef} className="mt-8">
              <Link href="/onboarding" className="block">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
                  style={{
                    background: "var(--brand-primary)",
                    color: "var(--surface-elevated)",
                    boxShadow: "0 4px 18px rgba(224,123,64,0.38)",
                    transition: "transform 100ms, box-shadow 200ms",
                  }}
                >
                  Descubrir mi herida del dinero
                  <ArrowRight weight="bold" size={18} />
                </motion.button>
              </Link>
              <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                Gratis · 5 minutos · Sin tarjeta
              </p>
            </div>
          </HeroReveal>

          {/* FIX hero visual: mockup esquemático real en lugar de dashed placeholder */}
          <HeroReveal delay={0.18}>
            <div
              className="mx-auto mt-10 overflow-hidden"
              style={{
                width: "190px",
                aspectRatio: "9 / 16",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg), 0 0 0 1.5px color-mix(in oklab, var(--brand-primary) 20%, transparent)",
              }}
            >
              <DiagnosticoScreen />
            </div>
          </HeroReveal>

          {/* FIX 4 (trust strip): sin "4.9★" — copy verificable */}
          <HeroReveal delay={0.22}>
            <div className="mt-10 flex items-start justify-center">
              {[
                { n: "Solo", label: "en español" },
                { n: "7 días", label: "gratis" },
                { n: "14 días", label: "garantía" },
              ].map((item, i) => (
                <div
                  key={item.n}
                  className="flex flex-col items-center gap-0.5 px-5"
                  style={{
                    borderLeft: i > 0 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {item.n}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §2  PROBLEMA                                        */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: "var(--surface-elevated)" }}>
        <div className="mx-auto max-w-sm">
          <Reveal>
            <Kicker>¿Te identificas?</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 font-display text-2xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              No estás sola. Millones sienten exactamente esto
            </h2>
          </Reveal>

          {/* FIX: escena concreta del dolor (FICHA-AVATAR — momento de crisis exacto) */}
          <Reveal delay={0.08}>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
              Domingo por la noche. Abres el banco. Otra vez salió más de lo que entró.
              No sabes cómo pasó. Te da vergüenza. Y en silencio te preguntas: ¿qué hago mal?
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-4">
            {painPoints.map((item, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  className="flex gap-4 rounded-[var(--radius-md)] p-4"
                  style={{ background: "var(--surface-sunken)", boxShadow: "var(--shadow-sm)" }}
                >
                  <Soft3DIcon>{item.icon}</Soft3DIcon>
                  <p className="self-center text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §3  AGITACIÓN                                       */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-sm">
          <Reveal>
            <Kicker>El costo real del patrón</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 font-display text-2xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Cada año que el patrón sigue,
              <br />
              te cuesta más de lo que crees
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="mt-8 rounded-[var(--radius-lg)] p-6"
              style={{ background: "var(--surface-elevated)", boxShadow: "var(--shadow-lg)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Estimado para tu perfil · ajústalo en el diagnóstico
              </p>
              {/* FIX baseline #2: count-up animation al entrar en viewport */}
              <div className="mt-2 flex items-end gap-1">
                <span className="font-display text-4xl font-bold" style={{ color: "var(--brand-primary)" }}>
                  <AnimatedCounter target={9600} prefix="$" />
                </span>
                <span className="mb-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  &nbsp;/ año
                </span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                En oportunidades perdidas, decisiones por miedo y autoboicot
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {[
                  "Rechazas aumentos de sueldo por sentirte insuficiente",
                  "Gastas impulsivamente para aliviar la ansiedad financiera",
                  "Evitas revisar tus cuentas porque genera angustia",
                  "Saboteas proyectos justo cuando empiezan a funcionar",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: "color-mix(in oklab, var(--text-secondary) 25%, transparent)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      ×
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
              *Rango basado en $200–800 USD/mes de oportunidades perdidas reportadas · perfil emprendedora LATAM
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p
              className="mt-6 text-center text-base font-medium leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              No es mala suerte. No es falta de disciplina.{" "}
              <strong style={{ color: "var(--brand-primary)" }}>
                Es una herida emocional que nadie te enseñó a sanar.
              </strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §4  SOLUCIÓN — MÉTODO RAÍZ™                        */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: "var(--surface-elevated)" }}>
        <div className="mx-auto max-w-sm">
          <Reveal>
            <Kicker>Método RAÍZ™</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 font-display text-2xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              La primera IA diseñada para sanar tu relación con el dinero desde la raíz
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              No es otro curso de finanzas. No es positivismo vacío. Es un proceso terapéutico
              personalizado que trabaja donde el dinero realmente vive: en tu historia emocional.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col">
            {raizSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex gap-4">
                  <div className="flex shrink-0 flex-col items-center">
                    <div
                      className="flex size-10 items-center justify-center rounded-full font-display text-lg font-bold"
                      style={{
                        background: "var(--soft3d-bg)",
                        boxShadow: "var(--soft3d-shadow)",
                        color: "var(--surface-elevated)",
                      }}
                    >
                      {step.letter}
                    </div>
                    {i < raizSteps.length - 1 && (
                      <div
                        className="my-1 w-px flex-1"
                        style={{
                          minHeight: "28px",
                          background: "color-mix(in oklab, var(--brand-primary) 20%, transparent)",
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-6 pt-1">
                    <h3 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §5  CARRUSEL DE PANTALLAS — mockups esquemáticos   */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="overflow-hidden py-16">
        <div className="mx-auto max-w-sm px-4">
          <Reveal>
            <Kicker>Así se ve por dentro</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 font-display text-2xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Cada sesión te lleva un paso más lejos del patrón
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {screens.map((screen, i) => {
              const Screen = screen.Screen;
              return (
                <div key={i} className="flex w-48 shrink-0 snap-center flex-col gap-2">
                  <div
                    style={{
                      aspectRatio: "9 / 16",
                      overflow: "hidden",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-lg)",
                      flexShrink: 0,
                    }}
                  >
                    <Screen />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {screen.label}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {screen.sub}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="w-4 shrink-0" />
          </div>
        </Reveal>

        {/* Pagination dots */}
        <div className="mt-4 flex justify-center gap-2">
          {screens.map((_, i) => (
            <div
              key={i}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "9999px",
                background: activeScreen === i ? "var(--brand-primary)" : "color-mix(in oklab, var(--text-muted) 35%, transparent)",
                transition: "background-color 200ms",
              }}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-sm px-4">
          <Reveal>
            <Link href="/onboarding" className="block">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 py-4 text-sm font-semibold"
                style={{
                  borderColor: "var(--brand-primary)",
                  color: "var(--brand-primary)",
                  background: "transparent",
                  transition: "transform 100ms",
                }}
              >
                Empezar gratis — sin tarjeta
                <ArrowRight weight="bold" size={16} />
              </motion.button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §6  OFERTA / PRICING                               */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: "var(--surface-elevated)" }}>
        <div className="mx-auto max-w-sm">
          {/* FIX 6: kicker sin "Inversión" (prohibido en avatar) */}
          <Reveal>
            <Kicker>Empieza sin riesgo</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 font-display text-2xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Todo lo que necesitas para sanar tu relación con el dinero
            </h2>
          </Reveal>

          {/* Value stack */}
          <Reveal delay={0.08}>
            <div className="mt-6 rounded-[var(--radius-md)] p-5" style={{ background: "var(--surface-sunken)" }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Valor incluido
              </p>
              {valueItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2"
                  style={{
                    borderBottom:
                      i < valueItems.length - 1
                        ? "1px solid color-mix(in oklab, var(--text-muted) 18%, transparent)"
                        : "none",
                  }}
                >
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold line-through" style={{ color: "var(--text-muted)" }}>
                    {item.value}
                  </span>
                </div>
              ))}
              <div
                className="mt-1 flex items-center justify-between border-t pt-3"
                style={{ borderColor: "color-mix(in oklab, var(--text-muted) 18%, transparent)" }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Valor total
                </span>
                <span className="font-display text-lg font-bold line-through" style={{ color: "var(--text-muted)" }}>
                  $284
                </span>
              </div>
            </div>
          </Reveal>

          {/* Billing toggle */}
          <Reveal delay={0.11}>
            <div className="mt-6 flex rounded-full p-1" style={{ background: "var(--surface-sunken)" }}>
              {(["annual", "monthly"] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setBilling(plan)}
                  className="flex-1 rounded-full py-2 text-sm font-medium"
                  style={{
                    background: billing === plan ? "var(--brand-primary)" : "transparent",
                    color: billing === plan ? "var(--surface-elevated)" : "var(--text-muted)",
                    transition: "background-color 200ms, color 200ms",
                  }}
                >
                  {plan === "annual" ? "Anual · 4 meses gratis" : "Mensual"}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Price card */}
          <Reveal delay={0.14}>
            <div
              className="mt-4 rounded-[var(--radius-lg)] p-6"
              style={{
                background: "var(--surface-base)",
                backgroundImage:
                  "linear-gradient(var(--surface-base), var(--surface-base)) padding-box, linear-gradient(135deg, color-mix(in oklab, var(--brand-primary) 40%, transparent), transparent 60%) border-box",
                border: "2px solid transparent",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <AnimatePresence mode="wait">
                {billing === "annual" && (
                  <motion.div
                    key="annual-badge"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: "var(--brand-gold-light)", color: "var(--brand-gold)" }}
                  >
                    ✦ 4 meses gratis incluidos
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FIX baseline #2: precio anima al entrar + al cambiar plan */}
              <div className="flex items-end gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={billing}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="font-display text-4xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    $<AnimatedNumber value={billing === "annual" ? 4.99 : 7.49} decimals={2} />
                  </motion.span>
                </AnimatePresence>
                <span className="mb-1 text-sm" style={{ color: "var(--text-muted)" }}>/mes</span>
              </div>

              {billing === "annual" && (
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  $59.99 al año · equivale a $4.99/mes
                </p>
              )}

              <div className="mt-5 flex flex-col gap-2.5">
                {[
                  "7 días de prueba completa sin cargo",
                  "Cancela cuando quieras, sin penalización",
                  "Soporte en español, siempre",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CustomCheck />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</span>
                  </div>
                ))}
              </div>

              <Link href="/onboarding" className="block">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
                  style={{
                    background: "var(--brand-primary)",
                    color: "var(--surface-elevated)",
                    boxShadow: "0 4px 16px rgba(224,123,64,0.38)",
                    transition: "transform 100ms",
                  }}
                >
                  Empezar gratis — sin tarjeta
                  <ArrowRight weight="bold" size={18} />
                </motion.button>
              </Link>
              {/* FIX §6: nota de cobro específica por plan (evita confusión $4.99 vs $59.99) */}
              <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                {billing === "annual"
                  ? "Al día 8 se carga $59.99 (año completo) si decides quedarte"
                  : "Al día 8 se carga $7.49/mes si decides quedarte"}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §7  GARANTÍA                                       */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-sm">
          <Reveal>
            <div
              className="rounded-[var(--radius-lg)] p-8 text-center"
              style={{
                background: "var(--surface-elevated)",
                backgroundImage:
                  "linear-gradient(var(--surface-elevated), var(--surface-elevated)) padding-box, linear-gradient(135deg, color-mix(in oklab, var(--brand-gold) 50%, transparent), transparent 60%) border-box",
                border: "2px solid transparent",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div
                className="mx-auto flex size-16 items-center justify-center rounded-full"
                style={{
                  background: "var(--gold-bg)",
                  boxShadow: "var(--gold-shadow)",
                  color: "var(--surface-elevated)",
                }}
              >
                <SealCheck weight="fill" size={32} />
              </div>

              <h3 className="mt-5 font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                La Garantía de la Primera Revelación
              </h3>

              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Si en los primeros{" "}
                <strong style={{ color: "var(--text-primary)" }}>14 días</strong> no tienes una
                revelación genuina sobre tu relación con el dinero — algo que diga "esto soy yo
                exactamente" — te regresamos cada centavo.{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  Sin preguntas. Sin formularios complicados.
                </strong>
              </p>

              <p className="mt-4 text-sm font-medium" style={{ color: "var(--brand-primary)" }}>
                Porque si no te conocemos, no merecemos tu dinero.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §7B TESTIMONIOS                                    */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: "var(--surface-elevated)" }}>
        <div className="mx-auto max-w-sm">
          <Reveal>
            <Kicker>Voces reales</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 font-display text-2xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Lo que cambia cuando llegas a la raíz
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-4">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  className="rounded-[var(--radius-md)] p-5"
                  style={{
                    background: "var(--surface-base)",
                    boxShadow: "var(--shadow-sm)",
                    borderLeft: "3px solid var(--brand-primary)",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)", fontStyle: "italic" }}
                  >
                    "{t.quote}"
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className="flex size-7 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold"
                      style={{ background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)", color: "var(--brand-primary)" }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.country}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §8  FAQ                                            */}
      {/* ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: "var(--surface-elevated)" }}>
        <div className="mx-auto max-w-sm">
          <Reveal>
            <Kicker>Preguntas frecuentes</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-4 font-display text-2xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Todo lo que necesitas saber antes de empezar
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div
                  className="overflow-hidden rounded-[var(--radius-md)]"
                  style={{ background: "var(--surface-base)", boxShadow: "var(--shadow-sm)" }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0"
                    >
                      <CaretDown weight="bold" size={16} color="var(--text-muted)" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §9  CTA FINAL                                      */}
      {/* ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 py-20"
        style={{ background: "var(--text-primary)" }}
      >
        <Blob color="gold" style={{ left: "-10%", top: "-20%", width: "400px", height: "400px", opacity: 0.25 }} />
        <Blob style={{ right: "-10%", bottom: "-10%", width: "300px", height: "300px", opacity: 0.15 }} />

        <div className="relative mx-auto max-w-sm text-center">
          {/* FIX 5: badge §9 — afirmación metodológica, no social proof fabricado */}
          <Reveal>
            <div
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "color-mix(in oklab, var(--brand-gold) 15%, transparent)",
                border: "1px solid color-mix(in oklab, var(--brand-gold) 30%, transparent)",
              }}
            >
              <Star weight="fill" size={13} color="var(--brand-gold)" />
              <span className="text-xs font-semibold" style={{ color: "var(--brand-gold)" }}>
                Basado en psicología terapéutica del niño interior
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="font-display font-bold leading-[1.15]"
              style={{
                fontSize: "clamp(1.75rem, 7vw, 2.2rem)",
                color: "var(--surface-base)",
              }}
            >
              ¿Y si la próxima revelación{" "}
              <em className="not-italic" style={{ color: "var(--brand-gold)" }}>
                es la tuya?
              </em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--surface-base) 70%, transparent)" }}
            >
              Imagina que en 30 días entiendes por primera vez POR QUÉ el dinero siempre se va.
              No con culpa — con comprensión. Y desde ahí, con un camino concreto hacia la sanación.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <Link href="/onboarding" className="block">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold"
                style={{
                  background: "var(--brand-primary)",
                  color: "var(--surface-elevated)",
                  boxShadow: "0 4px 22px rgba(224,123,64,0.48)",
                  transition: "transform 100ms",
                }}
              >
                Descubrir mi herida del dinero
                <ArrowRight weight="bold" size={18} />
              </motion.button>
            </Link>
            <p
              className="mt-3 text-xs"
              style={{ color: "color-mix(in oklab, var(--surface-base) 45%, transparent)" }}
            >
              Gratis · 5 minutos · Sin tarjeta de crédito
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              className="mt-10 text-xs italic leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--surface-base) 40%, transparent)" }}
            >
              PD: El patrón no desaparece solo con el tiempo. Lleva décadas ahí. Pero con el
              acompañamiento correcto, puede sanar más rápido de lo que imaginas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────── */}
      {/* §10  FOOTER                                        */}
      {/* ──────────────────────────────────────────────────── */}
      <footer
        className="px-4 py-10"
        style={{
          background: "var(--surface-elevated)",
          borderTop: "1px solid color-mix(in oklab, var(--text-muted) 15%, transparent)",
        }}
      >
        <div className="mx-auto max-w-sm">
          <div className="flex flex-col items-center gap-6">
            <span className="font-display text-lg font-semibold">
              Reconecta<span style={{ color: "var(--brand-primary)" }}>AI</span>
            </span>

            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {[
                { label: "Privacidad", href: "/privacidad" },
                { label: "Términos", href: "/terminos" },
                { label: "Reembolsos", href: "/reembolsos" },
                { label: "Aviso IA", href: "/aviso-ia" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs underline-offset-2 hover:underline"
                  style={{ color: "var(--text-muted)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p
              className="text-center text-xs leading-relaxed"
              style={{ color: "var(--text-muted)", maxWidth: "340px" }}
            >
              Reconecta AI es una herramienta de apoyo emocional y no sustituye la atención de
              un profesional de salud mental. Si estás pasando por una crisis, consulta a un
              especialista.
            </p>

            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Reconecta AI · Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* ── STICKY CTA (mobile) ─────────────────────────── */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 88, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 88, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div
              className="px-4 pt-3"
              style={{
                background: "var(--surface-elevated)",
                boxShadow: "0 -4px 24px rgba(45,24,16,0.14)",
                paddingBottom: "max(16px, env(safe-area-inset-bottom))",
              }}
            >
              <Link href="/onboarding" className="block">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold"
                  style={{
                    background: "var(--brand-primary)",
                    color: "var(--surface-elevated)",
                    boxShadow: "0 4px 12px rgba(224,123,64,0.30)",
                    transition: "transform 100ms",
                  }}
                >
                  Descubrir mi herida del dinero
                  <ArrowRight weight="bold" size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
