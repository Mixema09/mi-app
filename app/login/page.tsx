"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, EnvelopeSimple, Check, GoogleLogo, SpinnerGap } from "@phosphor-icons/react";

type Mode = "idle" | "sending" | "sent" | "error";
type LoginMode = "create" | "login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<Mode>("idle");
  const [loginMode, setLoginMode] = useState<LoginMode>("create");
  const prefersReduced = useReducedMotion();
  const emailRef = useRef<HTMLInputElement>(null);

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    setMode("sending");
    // Stub: Supabase magic link en Sesión 6
    await new Promise((r) => setTimeout(r, 1200));
    setMode("sent");
  }

  function handleGoogle() {
    // Stub: Supabase Google OAuth en Sesión 6
    setMode("sending");
    setTimeout(() => {
      setMode("error");
      setTimeout(() => emailRef.current?.focus(), 50);
    }, 1500);
  }

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
  const dur = prefersReduced ? 0 : 0.45;

  const headings = {
    create: {
      title: "Crea tu cuenta",
      subtitle: "Tu progreso y diagnóstico quedaron guardados. Crea una cuenta para protegerlos y empezar tu ruta.",
    },
    login: {
      title: "Bienvenida de vuelta",
      subtitle: "Ingresa tu correo para recibir tu enlace de acceso.",
    },
  };

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: "var(--surface-base)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <header className="px-4 pt-safe-top">
        <div className="mx-auto flex max-w-sm items-center justify-between py-4">
          <Link href="/" className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Reconecta<span style={{ color: "var(--brand-primary)" }}>AI</span>
          </Link>
          <Link href="/paywall" className="text-sm" style={{ color: "var(--text-muted)" }}>
            Volver
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col justify-center px-4 pb-12 pt-4">
        <div className="blob-hero" />
        <div className="mx-auto w-full max-w-sm">

          {/* Heading — con transición al cambiar modo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={loginMode}
              initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : -8 }}
              transition={{ duration: 0.25, ease }}
            >
              <h1
                className="font-display text-3xl font-bold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {headings[loginMode].title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {headings[loginMode].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Magic link form */}
          <motion.div
            initial={{ y: prefersReduced ? 0 : 16, opacity: prefersReduced ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: prefersReduced ? 0 : 0.1, duration: dur, ease }}
            className="mt-8"
          >
            <AnimatePresence mode="wait">
              {mode === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="rounded-[var(--radius-md)] p-6 text-center"
                  style={{ background: "color-mix(in oklab, var(--brand-primary) 8%, transparent)", border: "1px solid color-mix(in oklab, var(--brand-primary) 18%, transparent)" }}
                >
                  <div
                    className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full"
                    style={{ background: "var(--brand-primary)" }}
                  >
                    <Check size={24} weight="bold" color="white" />
                  </div>
                  <p className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    Revisa tu correo
                  </p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Te enviamos un link a <strong>{email}</strong>. Tócalo y entras directo — sin contraseña, sin app extra.
                  </p>
                  <button
                    onClick={() => setMode("idle")}
                    className="mt-4 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Usar otro correo
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleMagicLink}
                  className="flex flex-col gap-3"
                >
                  <div className="relative">
                    <EnvelopeSimple
                      size={18}
                      weight="duotone"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      className="w-full rounded-[var(--radius-md)] py-4 pl-11 pr-4 text-base outline-none"
                      style={{
                        background: "var(--surface-elevated)",
                        border: "1.5px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                        caretColor: "var(--brand-primary)",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "var(--brand-primary)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--border-subtle)"; }}
                    />
                  </div>

                  {mode === "error" && (
                    <p className="text-xs" style={{ color: "var(--semantic-error)" }}>
                      Google no está disponible en este momento. Ingresa tu correo arriba para entrar sin contraseña — es igual de rápido.
                    </p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    type="submit"
                    disabled={!isValidEmail(email) || mode === "sending"}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] py-4 text-base font-semibold"
                    style={{
                      background: isValidEmail(email) ? "var(--brand-primary)" : "transparent",
                      border: `1.5px solid ${isValidEmail(email) ? "transparent" : "color-mix(in oklab, var(--brand-primary) 35%, transparent)"}`,
                      color: isValidEmail(email) ? "white" : "var(--text-muted)",
                      boxShadow: isValidEmail(email) ? "0 4px 18px rgba(224,123,64,0.28)" : "none",
                      transition: "all 200ms",
                    }}
                  >
                    {mode === "sending" ? (
                      <>
                        <SpinnerGap size={18} weight="bold" className="animate-spin" />
                        Enviando enlace...
                      </>
                    ) : (
                      <>
                        Entrar sin contraseña
                        <ArrowRight size={18} weight="bold" />
                      </>
                    )}
                  </motion.button>

                  {/* Magic link explanation */}
                  <p className="text-center text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Te enviamos un link a tu correo — solo tócalo y entras.
                    <br />Sin contraseña, sin app extra.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Divider */}
          {mode !== "sent" && (
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1" style={{ height: "1px", background: "var(--border-subtle)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>o continúa con</span>
              <div className="flex-1" style={{ height: "1px", background: "var(--border-subtle)" }} />
            </div>
          )}

          {/* Google — siempre visible y habilitado (OAuth independiente del email) */}
          {mode !== "sent" && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              onClick={handleGoogle}
              disabled={mode === "sending"}
              className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-md)] py-4 text-base font-medium"
              style={{
                background: "var(--surface-elevated)",
                border: "1.5px solid var(--border-subtle)",
                color: "var(--text-primary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <GoogleLogo size={20} weight="bold" />
              Continuar con Google
            </motion.button>
          )}

          {/* Legal — separado en dos bloques */}
          <p
            className="mt-6 text-center text-xs leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Al continuar aceptas los{" "}
            <Link href="/terminos" style={{ color: "var(--brand-primary)" }}>Términos</Link>{" "}
            y la{" "}
            <Link href="/privacidad" style={{ color: "var(--brand-primary)" }}>Política de privacidad</Link>.
          </p>

          {/* Toggle login/create */}
          <p className="mt-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
            {loginMode === "create" ? "¿Ya tienes cuenta?" : "¿Eres nueva aquí?"}{" "}
            <button
              onClick={() => setLoginMode((m) => (m === "create" ? "login" : "create"))}
              className="font-medium"
              style={{ color: "var(--brand-primary)" }}
            >
              {loginMode === "create" ? "Entrar" : "Crear cuenta"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
