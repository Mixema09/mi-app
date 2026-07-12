export default function LoginPage() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-4"
      style={{ background: "var(--surface-base)" }}
    >
      <div className="text-center">
        <span className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Reconecta<span style={{ color: "var(--brand-primary)" }}>AI</span>
        </span>
        <p className="mt-4 text-base" style={{ color: "var(--text-secondary)" }}>
          Iniciar sesión — próximamente en Sesión 4
        </p>
      </div>
    </div>
  );
}
