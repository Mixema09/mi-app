"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessageAction } from "@/lib/actions/chat";

type UIMessage = { role: "user" | "assistant"; content: string };

export function ChatUI({
  conversationId,
  initialMessages,
  coachIntro,
}: {
  conversationId: string;
  initialMessages: UIMessage[];
  coachIntro: string;
}) {
  const [messages, setMessages] = useState<UIMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function send() {
    const text = input.trim();
    if (!text || pending) return;
    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    startTransition(async () => {
      const reply = await sendMessageAction(conversationId, text);
      if (reply.error) {
        setError(reply.error);
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply.content },
      ]);
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-black/10 p-4 text-sm text-gray-600 dark:border-white/10 dark:text-gray-300">
            {coachIntro}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "border border-black/10 dark:border-white/15"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-black/10 px-4 py-2 text-sm text-gray-400 dark:border-white/15">
              Tu coach está escribiendo…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p className="px-4 pb-2 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="border-t border-black/10 p-4 dark:border-white/10">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Escribe a tu coach…"
            className="max-h-32 flex-1 resize-none rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
          />
          <button
            onClick={send}
            disabled={pending || !input.trim()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
