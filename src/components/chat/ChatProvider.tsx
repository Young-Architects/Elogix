"use client";

/**
 * ChatProvider — single source of truth for the Expy AI chat.
 *
 * Owns the conversation state and webhook logic (moved out of ChatWidget) so the
 * exact same chat can be rendered in two places without losing history:
 *   1. Docked into a hero's right-side slot (see `HeroChatDock`).
 *   2. As the floating bottom-right widget (see `ChatWidget`).
 *
 * It also owns the dock handoff: a hero registers its slot via `registerDock`,
 * and an IntersectionObserver flips `heroInView`. While the hero (and its docked
 * chat) is on screen, the floating widget hides; once scrolled past, the docked
 * chat scrolls away and the floating launcher takes over.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ChatMessage,
  ChatWebhookRequest,
  ChatWebhookResponse,
} from "@/types";
import chatData from "@/data/chat.json";

/**
 * Our own server route, not the n8n webhook. It attaches the `x-chat-secret`
 * header server-side so the shared secret never reaches the browser.
 * See `src/app/api/chat/route.ts`.
 */
const CHAT_ENDPOINT = "/api/chat";
const RATE_LIMIT_MS = 2500;
const STORAGE_KEY = "expendesk_visitor_id";
/** How long the assistant "types" before revealing its greeting on load. */
const BOOT_TYPING_MS = 1300;

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  content: chatData.greeting,
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

interface ChatContextValue {
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  /** True while the greeting is being "typed out" on first load. */
  isBooting: boolean;
  canSend: boolean;
  sendMessage: () => void;
  /** Sends a predefined quick question as if the visitor had typed it. */
  sendQuickQuestion: (text: string) => void;
  // Floating widget open/closed state
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  toggleOpen: () => void;
  // Dock handoff
  heroInView: boolean;
  registerDock: (node: HTMLElement | null) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within <ChatProvider>");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Start with no messages + "typing" so the greeting animates in on load.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(false);

  const visitorIdRef = useRef<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId();
  }, []);

  // Boot sequence: show typing dots briefly, then reveal the greeting.
  useEffect(() => {
    const t = setTimeout(() => {
      setMessages((prev) => (prev.length ? prev : [GREETING]));
      setIsBooting(false);
    }, BOOT_TYPING_MS);
    return () => clearTimeout(t);
  }, []);

  // Esc closes the floating panel.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // A hero registers its dock slot here. We optimistically assume the slot is in
  // view the moment it registers (heroes sit at the top of the page) so the
  // floating widget doesn't flash on first paint, then let the observer correct.
  const registerDock = useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node) {
      setHeroInView(false);
      return;
    }

    setHeroInView(true);
    const obs = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    obs.observe(node);
    observerRef.current = obs;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  /**
   * Core send path shared by the composer (`sendMessage`) and the predefined
   * quick-question chips (`sendQuickQuestion`). Does NOT touch the input box —
   * callers decide whether to clear it.
   */
  const submitText = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || isLoading || isCoolingDown || isBooting) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setIsCoolingDown(true);
    setTimeout(() => setIsCoolingDown(false), RATE_LIMIT_MS);

    const payload: ChatWebhookRequest = {
      sessionId: visitorIdRef.current,
      message: text,
    };

    try {
      const res = await fetch(CHAT_ENDPOINT, {
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
          content: chatData.errorMessage,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isCoolingDown, isBooting]);

  const sendMessage = useCallback(() => {
    setInput("");
    void submitText(input);
  }, [input, submitText]);

  const sendQuickQuestion = useCallback(
    (text: string) => {
      void submitText(text);
    },
    [submitText],
  );

  const canSend =
    input.trim().length > 0 && !isLoading && !isCoolingDown && !isBooting;

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      input,
      setInput,
      isLoading,
      isBooting,
      canSend,
      sendMessage,
      sendQuickQuestion,
      isOpen,
      setOpen: setIsOpen,
      toggleOpen: () => setIsOpen((o) => !o),
      heroInView,
      registerDock,
    }),
    [messages, input, isLoading, isBooting, canSend, sendMessage, sendQuickQuestion, isOpen, heroInView, registerDock],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
