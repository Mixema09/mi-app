"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/dal";
import { QUESTIONS, OPEN_GOAL_QUESTION } from "@/lib/diagnosis";

export type OnboardingState = { error?: string } | null;

/**
 * Guarda las respuestas del onboarding y marca el perfil como completado.
 * Al terminar, lleva a la usuaria al diagnóstico.
 */
export async function saveOnboardingAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await getUser();
  if (!user) redirect("/login");

  // Construye y valida el mapa de respuestas.
  const answers: Record<string, number | string> = {};
  for (const q of QUESTIONS) {
    const raw = Number(formData.get(q.id));
    if (Number.isNaN(raw) || raw < 1 || raw > 5) {
      return { error: "Por favor responde todas las preguntas." };
    }
    answers[q.id] = raw;
  }
  const goal = (formData.get(OPEN_GOAL_QUESTION.id) as string)?.trim();
  if (goal) answers[OPEN_GOAL_QUESTION.id] = goal;

  const supabase = await createClient();

  const { error: insertError } = await supabase
    .from("onboarding_responses")
    .insert({
      user_id: user.id,
      answers,
      completed_at: new Date().toISOString(),
    });
  if (insertError) {
    return { error: "No pudimos guardar tus respuestas. Intenta de nuevo." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);
  if (profileError) {
    return { error: "No pudimos actualizar tu perfil. Intenta de nuevo." };
  }

  revalidatePath("/", "layout");
  redirect("/diagnostico");
}
