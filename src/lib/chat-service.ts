import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ChatConversation, ChatMessage } from "@/lib/database.types";

/**
 * Devuelve la conversación activa de la usuaria (la más reciente) o crea una
 * nueva si no tiene ninguna. MVP: una sola conversación continua por usuaria.
 */
export async function getOrCreateConversation(
  userId: string,
): Promise<ChatConversation | null> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing as ChatConversation;

  const { data: created } = await supabase
    .from("chat_conversations")
    .insert({ user_id: userId, title: "Conversación con tu coach" })
    .select()
    .single();

  return (created as ChatConversation) ?? null;
}

/** Carga los mensajes de una conversación en orden cronológico. */
export async function loadMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return (data as ChatMessage[]) ?? [];
}
