"use client";

/**
 * ChatPanel — presentational chat surface (header · messages · input).
 *
 * Stateless with respect to the conversation: everything comes from
 * `useChat()`, so the docked and floating instances stay perfectly in sync.
 * The parent controls position + outer size; this fills it (`h-full w-full`).
 *
 *   variant="docked"    sits inside a hero slot · no close button
 *   variant="floating"  bottom-right widget · shows a close (X) button
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";
import chatData from "@/data/chat.json";
import { useChat } from "./ChatProvider";

/**
 * Predefined conversation starters, shown under the greeting until the
 * visitor sends their first message. Each chip submits its text as a normal
 * user message via `sendQuickQuestion`. Copy lives in src/data/chat.json.
 */
const QUICK_QUESTIONS = chatData.quickQuestions;

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-indigo-400"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function ChatPanel({
  variant,
}: {
  variant: "docked" | "floating";
}) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isBooting,
    canSend,
    sendMessage,
    sendQuickQuestion,
    setOpen,
  } = useChat();

  const showTyping = isLoading || isBooting;

  // Quick questions are conversation starters — hide them for good the moment
  // the visitor sends anything themselves (typed or via a chip).
  const showQuickQuestions =
    !isBooting && !messages.some((m) => m.role === "user");

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the latest message in view by scrolling ONLY the message list — never
  // the page. (scrollIntoView would bubble up and scroll the window, which is
  // especially wrong while the chat is docked in-flow inside the hero.)
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0f1a] shadow-[0_24px_64px_rgba(0,0,0,0.45),0_0_0_1px_rgba(99,102,241,0.08)]">
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_4px_12px_rgba(99,102,241,0.38)]">
          <div
            aria-hidden
            className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          <span className="relative z-10 text-[11px] font-bold text-white">
            {chatData.assistant.avatarLetter}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-white">
            {chatData.assistant.name}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {chatData.assistant.status}
          </span>
        </div>
        {variant === "floating" && (
          <button
            onClick={() => setOpen(false)}
            aria-label={chatData.aria.closeChat}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div
        ref={listRef}
        className="chat-scrollbar flex-1 overflow-y-auto overscroll-contain space-y-3 px-4 py-3"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "error" ? (
              <div className="max-w-[82%] rounded-xl border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-[12.5px] leading-relaxed text-red-400">
                {msg.content}
              </div>
            ) : msg.role === "user" ? (
              <div className="max-w-[82%] rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-3 py-2.5 text-[12.5px] leading-relaxed text-white shadow-[0_4px_12px_rgba(99,102,241,0.22)]">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[82%] rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[12.5px] leading-relaxed text-slate-200">
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {/* ── Predefined quick questions ── */}
        {showQuickQuestions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2 pt-1"
          >
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => sendQuickQuestion(question)}
                disabled={isLoading}
                className="rounded-full border border-indigo-400/25 bg-indigo-500/[0.08] px-3 py-1.5 text-[11.5px] font-medium text-indigo-300 transition-colors duration-200 hover:border-indigo-400/50 hover:bg-indigo-500/[0.16] hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
              >
                {question}
              </button>
            ))}
          </motion.div>
        )}

        {showTyping && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03]">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-white/[0.06] px-3 py-3">
        <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 transition-colors duration-200 focus-within:border-indigo-500/40">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleTextareaInput}
            placeholder={chatData.input.placeholder}
            aria-label={chatData.input.typeAriaLabel}
            rows={1}
            className="flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-white placeholder-slate-500 outline-none"
            style={{ maxHeight: "80px", overflowY: "auto" }}
          />
          <button
            onClick={sendMessage}
            disabled={!canSend}
            aria-label={chatData.input.sendAriaLabel}
            className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_2px_8px_rgba(99,102,241,0.28)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[11px] font-semibold text-slate-300">
          Expendesk AI can make mistakes. Please verify important details with
          our team.
        </p>
      </div>
    </div>
  );
}
