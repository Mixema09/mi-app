import "server-only";
import { createClient } from "@/lib/supabase/server";
import { buildDiagnosis } from "@/lib/diagnosis";
import type {
  DiagnosticResult,
  PersonalizedPath,
  OnboardingResponse,
} from "@/lib/database.types";

export interface DiagnosisBundle {
  result: DiagnosticResult;
  path: PersonalizedPath | null;
}

/**
 * Devuelve el diagnóstico de la usuaria. Si aún no existe, lo calcula a partir
 * de sus respuestas de onboarding, lo guarda junto con la ruta personalizada y
 * marca el perfil como diagnosticado. Idempotente: si ya existe, lo reutiliza.
 *
 * Devuelve null si la usuaria todavía no ha respondido el onboarding.
 */
export async function getOrCreateDiagnosis(
  userId: string,
): Promise<DiagnosisBundle | null> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("diagnostic_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { data: path } = await supabase
      .from("personalized_paths")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return {
      result: existing as DiagnosticResult,
      path: (path as PersonalizedPath) ?? null,
    };
  }

  const { data: onboarding } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!onboarding) return null;

  const dg = buildDiagnosis((onboarding as OnboardingResponse).answers);

  const { data: inserted, error } = await supabase
    .from("diagnostic_results")
    .insert({
      user_id: userId,
      scores: dg.scores,
      primary_area: dg.primaryArea,
      summary: dg.summary,
    })
    .select()
    .single();

  if (error || !inserted) return null;

  const { data: path } = await supabase
    .from("personalized_paths")
    .insert({
      user_id: userId,
      diagnostic_id: (inserted as DiagnosticResult).id,
      title: dg.pathTitle,
      focus_area: dg.primaryArea,
      steps: dg.steps,
    })
    .select()
    .single();

  await supabase
    .from("profiles")
    .update({ diagnosis_completed: true })
    .eq("id", userId);

  return {
    result: inserted as DiagnosticResult,
    path: (path as PersonalizedPath) ?? null,
  };
}
