import type { DiagnosticResult, PathStep } from "@/lib/database.types";

/**
 * Dominio del onboarding + diagnóstico.
 *
 * El onboarding es una autoevaluación por dimensiones de bienestar. Cada
 * pregunta es una escala Likert 1..5. El diagnóstico promedia por dimensión
 * (0..100) y define el "área principal de enfoque" como la dimensión MÁS baja
 * (la que más apoyo necesita), con la que se genera una ruta personalizada.
 */

export type DimensionId =
  | "bienestar_emocional"
  | "autocuidado"
  | "relaciones"
  | "proposito"
  | "confianza";

export interface Dimension {
  id: DimensionId;
  label: string;
  description: string;
}

export interface Question {
  id: string; // p.ej. "bienestar_emocional_1"
  dimension: DimensionId;
  text: string;
}

export const LIKERT_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Nunca" },
  { value: 2, label: "Rara vez" },
  { value: 3, label: "A veces" },
  { value: 4, label: "A menudo" },
  { value: 5, label: "Siempre" },
];

export const DIMENSIONS: Dimension[] = [
  {
    id: "bienestar_emocional",
    label: "Bienestar emocional",
    description: "Cómo gestionas tus emociones y tu calma interior.",
  },
  {
    id: "autocuidado",
    label: "Autocuidado y energía",
    description: "El cuidado de tu cuerpo, descanso y energía diaria.",
  },
  {
    id: "relaciones",
    label: "Relaciones y vínculos",
    description: "La calidad y el apoyo de tus relaciones.",
  },
  {
    id: "proposito",
    label: "Propósito y dirección",
    description: "Tu claridad sobre metas y sentido de rumbo.",
  },
  {
    id: "confianza",
    label: "Confianza y autoestima",
    description: "La seguridad en ti misma y en tus decisiones.",
  },
];

export const QUESTIONS: Question[] = [
  // bienestar_emocional
  {
    id: "bienestar_emocional_1",
    dimension: "bienestar_emocional",
    text: "Logro mantener la calma cuando algo me estresa.",
  },
  {
    id: "bienestar_emocional_2",
    dimension: "bienestar_emocional",
    text: "Reconozco lo que siento y por qué lo siento.",
  },
  {
    id: "bienestar_emocional_3",
    dimension: "bienestar_emocional",
    text: "Me recupero pronto después de un día difícil.",
  },
  // autocuidado
  {
    id: "autocuidado_1",
    dimension: "autocuidado",
    text: "Dedico tiempo a descansar y recargar energía.",
  },
  {
    id: "autocuidado_2",
    dimension: "autocuidado",
    text: "Cuido mi alimentación y mi actividad física.",
  },
  {
    id: "autocuidado_3",
    dimension: "autocuidado",
    text: "Pongo límites sanos para proteger mi bienestar.",
  },
  // relaciones
  {
    id: "relaciones_1",
    dimension: "relaciones",
    text: "Cuento con personas en quienes puedo apoyarme.",
  },
  {
    id: "relaciones_2",
    dimension: "relaciones",
    text: "Expreso lo que necesito en mis relaciones.",
  },
  {
    id: "relaciones_3",
    dimension: "relaciones",
    text: "Me siento acompañada y comprendida.",
  },
  // proposito
  {
    id: "proposito_1",
    dimension: "proposito",
    text: "Tengo claridad sobre lo que quiero lograr.",
  },
  {
    id: "proposito_2",
    dimension: "proposito",
    text: "Mis actividades diarias tienen sentido para mí.",
  },
  {
    id: "proposito_3",
    dimension: "proposito",
    text: "Avanzo hacia metas que me importan.",
  },
  // confianza
  {
    id: "confianza_1",
    dimension: "confianza",
    text: "Confío en mi capacidad para resolver problemas.",
  },
  {
    id: "confianza_2",
    dimension: "confianza",
    text: "Tomo decisiones sin dudar en exceso de mí misma.",
  },
  {
    id: "confianza_3",
    dimension: "confianza",
    text: "Reconozco y valoro mis logros.",
  },
];

/** Pregunta abierta final del onboarding. */
export const OPEN_GOAL_QUESTION = {
  id: "meta_personal",
  text: "En una frase, ¿qué te gustaría lograr en los próximos meses?",
};

export function getDimension(id: string): Dimension | undefined {
  return DIMENSIONS.find((d) => d.id === id);
}

export type Scores = Record<DimensionId, number>;

/**
 * Calcula los puntajes (0..100) por dimensión a partir de las respuestas
 * Likert del onboarding.
 */
export function computeScores(
  answers: Record<string, number | string>,
): Scores {
  const scores = {} as Scores;
  for (const dim of DIMENSIONS) {
    const qs = QUESTIONS.filter((q) => q.dimension === dim.id);
    let sum = 0;
    let count = 0;
    for (const q of qs) {
      const raw = Number(answers[q.id]);
      if (!Number.isNaN(raw) && raw >= 1 && raw <= 5) {
        sum += raw;
        count += 1;
      }
    }
    // 1..5 -> 0..100
    scores[dim.id] = count > 0 ? Math.round(((sum / count - 1) / 4) * 100) : 0;
  }
  return scores;
}

/** La dimensión con el puntaje más bajo es el área principal de enfoque. */
export function getPrimaryArea(scores: Scores): DimensionId {
  let lowest: DimensionId = DIMENSIONS[0].id;
  for (const dim of DIMENSIONS) {
    if (scores[dim.id] < scores[lowest]) lowest = dim.id;
  }
  return lowest;
}

/** Contenido personalizado por área (resumen + pasos de la ruta). */
const AREA_CONTENT: Record<
  DimensionId,
  { summary: string; pathTitle: string; steps: PathStep[] }
> = {
  bienestar_emocional: {
    summary:
      "Tu mayor oportunidad ahora es el bienestar emocional. Trabajaremos en herramientas para gestionar el estrés y reconectar con tu calma.",
    pathTitle: "Ruta: Calma y equilibrio emocional",
    steps: [
      {
        title: "Diario de emociones",
        description:
          "Durante 7 días anota una emoción del día y qué la provocó.",
      },
      {
        title: "Respiración consciente",
        description: "Practica 5 minutos de respiración guiada cada mañana.",
      },
      {
        title: "Ritual de cierre",
        description: "Crea un pequeño ritual para soltar la tensión del día.",
      },
    ],
  },
  autocuidado: {
    summary:
      "Tu mayor oportunidad ahora es el autocuidado. Recuperaremos energía con hábitos sostenibles de descanso y límites sanos.",
    pathTitle: "Ruta: Energía y autocuidado",
    steps: [
      {
        title: "Mapa de energía",
        description: "Identifica qué actividades te dan y te quitan energía.",
      },
      {
        title: "Descanso no negociable",
        description: "Reserva un bloque diario solo para ti.",
      },
      {
        title: "Un límite sano",
        description: "Elige una situación donde practicar decir 'no'.",
      },
    ],
  },
  relaciones: {
    summary:
      "Tu mayor oportunidad ahora son tus relaciones. Fortaleceremos tus vínculos y tu comunicación con quienes te importan.",
    pathTitle: "Ruta: Vínculos que nutren",
    steps: [
      {
        title: "Círculo de apoyo",
        description: "Enumera 3 personas con quienes puedes contar.",
      },
      {
        title: "Conversación pendiente",
        description: "Prepara una conversación honesta que has postergado.",
      },
      {
        title: "Pedir ayuda",
        description: "Practica pedir apoyo en algo concreto esta semana.",
      },
    ],
  },
  proposito: {
    summary:
      "Tu mayor oportunidad ahora es el propósito. Ganaremos claridad sobre tus metas y tu sentido de rumbo.",
    pathTitle: "Ruta: Claridad y dirección",
    steps: [
      {
        title: "Visión a 6 meses",
        description: "Describe cómo quieres que se vea tu vida en 6 meses.",
      },
      {
        title: "Una meta clave",
        description: "Elige una meta importante y divídela en 3 pasos.",
      },
      {
        title: "Primer paso hoy",
        description: "Define la acción más pequeña que puedes dar hoy.",
      },
    ],
  },
  confianza: {
    summary:
      "Tu mayor oportunidad ahora es la confianza. Reforzaremos tu autoestima y tu seguridad al decidir.",
    pathTitle: "Ruta: Confianza y autoestima",
    steps: [
      {
        title: "Inventario de logros",
        description: "Escribe 10 cosas que has logrado, grandes y pequeñas.",
      },
      {
        title: "Voz interior amable",
        description: "Detecta una autocrítica y reescríbela con amabilidad.",
      },
      {
        title: "Decisión valiente",
        description: "Toma una pequeña decisión sin buscar aprobación externa.",
      },
    ],
  },
};

export interface DiagnosisComputation {
  scores: Scores;
  primaryArea: DimensionId;
  summary: string;
  pathTitle: string;
  steps: PathStep[];
}

/** Genera el diagnóstico completo a partir de las respuestas del onboarding. */
export function buildDiagnosis(
  answers: Record<string, number | string>,
): DiagnosisComputation {
  const scores = computeScores(answers);
  const primaryArea = getPrimaryArea(scores);
  const content = AREA_CONTENT[primaryArea];
  return {
    scores,
    primaryArea,
    summary: content.summary,
    pathTitle: content.pathTitle,
    steps: content.steps,
  };
}

/** Etiqueta legible del área principal de un diagnóstico guardado. */
export function primaryAreaLabel(result: DiagnosticResult): string {
  const dim = result.primary_area ? getDimension(result.primary_area) : null;
  return dim?.label ?? "Bienestar general";
}
