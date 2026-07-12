export default function AvisoIAPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16" style={{ background: "var(--surface-base)" }}>
      <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        Aviso sobre Inteligencia Artificial
      </h1>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Reconecta AI usa modelos de lenguaje para generar respuestas personalizadas basadas en
        tu historial de sesiones. La IA no es un terapeuta clínico y sus respuestas no
        constituyen diagnóstico ni tratamiento médico. Si estás en una crisis de salud mental,
        contacta a un profesional de inmediato.
      </p>
    </div>
  );
}
