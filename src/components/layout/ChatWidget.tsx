"use client";

/**
 * ChatWidget — the floating bottom-right chat (launcher + panel).
 *
 * Now a thin view over `ChatProvider`: it only owns the floating presentation.
 * While a hero's docked chat is on screen (`heroInView`), this renders nothing —
 * so there's never a launcher and a docked panel at once. Once the user scrolls
 * past the hero, the launcher springs in at the bottom-right ("closes and goes
 * to the bottom"), and clicking it opens the same conversation, mid-history.
 *
 * All conversation state/logic lives in `@/components/chat/ChatProvider`; the
 * panel UI is the shared `@/components/chat/ChatPanel`.
 */

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import chatData from "@/data/chat.json";
import { useChat } from "@/components/chat/ChatProvider";
import ChatPanel from "@/components/chat/ChatPanel";

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export default function ChatWidget() {
  const { isOpen, toggleOpen, heroInView } = useChat();

  // The hero's docked chat is the active surface while it's on screen.
  if (heroInView) return null;

  return (
    <>
      {/* ─── Floating chat panel ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label={chatData.aria.dialogLabel}
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: SMOOTH_EASE }}
            className="fixed bottom-[88px] right-4 z-50 flex w-[calc(100vw-32px)] flex-col sm:w-[380px]"
            style={{ height: "min(520px, calc(100svh - 120px))" }}
          >
            <ChatPanel variant="floating" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Launcher button (springs in once the hero is scrolled past) ─── */}
      <motion.button
        onClick={toggleOpen}
        aria-label={isOpen ? chatData.aria.closeLauncher : chatData.aria.openLauncher}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        initial={{ scale: 0, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
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
