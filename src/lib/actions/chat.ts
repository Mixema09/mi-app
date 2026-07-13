"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser, getProfile } from "@/lib/dal";
import { loadMessages } from "@/lib/chat-service";
import { getOrCreateDiagnosis } from "@/lib/diagnosis-service";
import { getAnthropic, buildCoachSystemPrompt, COACH_MODEL } from "@/lib/coach";
import type { ChatRole } from "@/lib/database.types";

export type ChatReply = {
  role: ChatRole;
  content: string;
  error?: string;
};

const MAX_HISTORY = 20;
const FALLBACK_REPLY =
  "Ahora mismo tu coach con IA no está disponible (falta configurar la clave de Anthropic). " +
  "Tu mensaje se guardó y podrás retomar la conversación cuando esté lista.";

/**
 * Envía un mensaje de la usuaria, guarda su mensaje, obtiene la respuesta del
 * coach (Claude) y la guarda también. Devuelve la respuesta del coach.
 */
export async function sendMessageAction(
  conversationId: string,
  content: string,
): Promise<ChatReply> {
  const user = await getUser();
  if (!user) redirect("/login");

  const text = content.trim();
  if (!text) {
    return { role: "assistant", content: "", error: "El mensaje está vacío." };
  }

  const supabase = await createClient();

  // Verifica que la conversación pertenece a la usuaria.
  const { data: conversation } = await supabase
    .from("chat_conversations")
    .select("id, user_id")
    .eq("id", conversationId)
    .maybeSingle();
  if (!conversation || conversation.user_id !== user.id) {
    return {
      role: "assistant",
      content: "",
      error: "Conversación no encontrada.",
    };
  }

  // Guarda el mensaje de la usuaria.
  await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "user",
    content: text,
  });

  // Construye el contexto para el coach.
  const profile = await getProfile();
  const bundle = await getOrCreateDiagnosis(user.id);
  const system = buildCoachSystemPrompt(
    profile,
    bundle?.result ?? null,
    bundle?.path ?? null,
  );

  const history = await loadMessages(conversationId);
  const anthropic = getAnthropic();

  let replyText: string;
  if (!anthropic) {
    replyText = FALLBACK_REPLY;
  } else {
    try {
      const message = await anthropic.messages.create({
        model: COACH_MODEL,
        max_tokens: 1024,
        system,
        messages: history
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-MAX_HISTORY)
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
      });
      replyText = message.content
        .filter((b) => b.type === "text")
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("\n")
        .trim();
      if (!replyText) replyText = "…";
    } catch {
      return {
        role: "assistant",
        content: "",
        error: "No pudimos contactar al coach. Intenta de nuevo en un momento.",
      };
    }
  }

  // Guarda la respuesta del coach.
  await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "assistant",
    content: replyText,
  });

  return { role: "assistant", content: replyText };
}
