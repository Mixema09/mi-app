import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { requireUser, getProfile } from "@/lib/dal";
import { getOrCreateConversation, loadMessages } from "@/lib/chat-service";
import { getOrCreateDiagnosis } from "@/lib/diagnosis-service";
import { primaryAreaLabel } from "@/lib/diagnosis";
import { ChatUI } from "./chat-ui";

export default async function ChatPage() {
  const user = await requireUser();
  const profile = await getProfile();

  // Requiere haber completado el flujo previo.
  if (!profile?.onboarding_completed) redirect("/onboarding");
  if (!profile?.diagnosis_completed) redirect("/diagnostico");

  const conversation = await getOrCreateConversation(user.id);
  if (!conversation) redirect("/dashboard");

  const messages = await loadMessages(conversation.id);
  const bundle = await getOrCreateDiagnosis(user.id);
  const focus = bundle ? primaryAreaLabel(bundle.result) : "tu bienestar";
  const firstName = profile?.full_name?.split(" ")[0];

  const coachIntro = `Hola${
    firstName ? ` ${firstName}` : ""
  }, soy tu coach. Vamos a trabajar juntas en ${focus.toLowerCase()}. ¿Cómo te sientes hoy?`;

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader />
      <ChatUI
        conversationId={conversation.id}
        initialMessages={messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }))}
        coachIntro={coachIntro}
      />
    </div>
  );
}
