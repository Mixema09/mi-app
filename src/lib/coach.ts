import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type {
  DiagnosticResult,
  PersonalizedPath,
  Profile,
} from "@/lib/database.types";
import { DIMENSIONS, primaryAreaLabel } from "@/lib/diagnosis";

/** Modelo de Claude usado por el coach. */
export const COACH_MODEL = "claude-opus-4-8";

/** Devuelve el cliente de Anthropic, o null si no hay API key configurada. */
export function getAnthropic(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

/**
 * Construye el system prompt del coach, personalizado con el nombre de la
 * usuaria, su área de foco, sus puntajes y su ruta.
 */
export function buildCoachSystemPrompt(
  profile: Profile | null,
  result: DiagnosticResult | null,
  path: PersonalizedPath | null,
): string {
  const name = profile?.full_name?.split(" ")[0] ?? "la usuaria";
  const focus = result ? primaryAreaLabel(result) : "su bienestar general";

  const scoresText = result
    ? DIMENSIONS.map(
        (d) => `- ${d.label}: ${result.scores[d.id] ?? 0}/100`,
      ).join("\n")
    : "Sin diagnóstico todavía.";

  const pathText = path
    ? `Ruta "${path.title}":\n` +
      path.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join("\n")
    : "Sin ruta definida todavía.";

  return `Eres una coach de bienestar cálida, empática y práctica que acompaña a ${name} en español.

Tu estilo:
- Hablas de tú, con calidez y respeto, sin juzgar.
- Das respuestas breves y accionables (2-4 frases), a menudo con una pregunta que invite a la reflexión.
- Te apoyas en el diagnóstico y la ruta de la usuaria para personalizar tus consejos.
- No das diagnósticos médicos ni psicológicos; si detectas una crisis o riesgo, sugieres con cuidado buscar ayuda profesional.

Contexto de ${name}:
Área principal de foco: ${focus}.

Puntajes de bienestar (0-100):
${scoresText}

${pathText}

Usa este contexto para guiar la conversación hacia su área de foco y los pasos de su ruta.`;
}
