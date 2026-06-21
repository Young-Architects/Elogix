"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import type { ChatMessage, ChatWebhookRequest, ChatWebhookResponse } from "@/types";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL!;
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;
const RATE_LIMIT_MS = 2500;
const STORAGE_KEY = "expendesk_visitor_id";

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  content:
    "Hi there! I'm the Expendesk assistant. Ask me anything about expense management, reimbursements, or policies.",
  timestamp: 0,
};

function getOrCreateVisitorId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const visitorIdRef = useRef<string>("");

  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || isCoolingDown) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setIsCoolingDown(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setTimeout(() => setIsCoolingDown(false), RATE_LIMIT_MS);

    const visitorId = visitorIdRef.current;
    const payload: ChatWebhookRequest = {
      sessionId: visitorId,
      message: text,
      visitorId,
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as ChatWebhookResponse;

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          content: data.reply,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "error",
          content: "I'm having trouble connecting. Please try again in a moment.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isCoolingDown]);

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

  const canSend = input.trim().length > 0 && !isLoading && !isCoolingDown;

  return (
    <>
      {/* ─── Chat panel ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label="Expendesk AI chat assistant"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: SMOOTH_EASE }}
            className="fixed bottom-[88px] right-4 z-50 flex w-[calc(100vw-32px)] flex-col sm:w-[380px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0f1a] shadow-[0_24px_64px_rgba(0,0,0,0.65),0_0_0_1px_rgba(99,102,241,0.08)]"
            style={{ height: "min(520px, calc(100svh - 120px))" }}
          >
            {/* ── Header ── */}
            <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 py-3">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_4px_12px_rgba(99,102,241,0.38)]">
                <div
                  aria-hidden
                  className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10 text-[11px] font-bold text-white">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-white">Expendesk AI</span>
                <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Online
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="chat-scrollbar flex-1 overflow-y-auto px-4 py-3 space-y-3">
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

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03]">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
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
                  placeholder="Ask about expense management…"
                  aria-label="Type your message"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-white placeholder-slate-500 outline-none"
                  style={{ maxHeight: "80px", overflowY: "auto" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!canSend}
                  aria-label="Send message"
                  className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_2px_8px_rgba(99,102,241,0.28)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10.5px] text-slate-600">
                Powered by Expendesk AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Launcher button ─── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI chat" : "Open Expendesk AI chat"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        whileHover={{ scale: 1.07, y: -2 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_8px_32px_rgba(99,102,241,0.45),0_2px_12px_rgba(139,92,246,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 focus-visible:outline-offset-2"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.18, ease: SMOOTH_EASE }}
              className="flex items-center justify-center"
            >
              <X className="h-5 w-5 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="logo"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.18, ease: SMOOTH_EASE }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.15]"
            >
              <span className="text-[15px] font-black text-white">E</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
