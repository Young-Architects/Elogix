"use client";

/**
 * HeroChatDock — drop-in chat slot for a hero's right column.
 *
 * Renders the shared ChatPanel *in flow* (not fixed), so it naturally scrolls
 * away with the hero — no per-frame position syncing. It registers itself with
 * ChatProvider; an IntersectionObserver there flips `heroInView`, which hides
 * the floating widget while this is on screen and reveals it once scrolled past.
 *
 * Usage (inside any hero's right column):
 *   <HeroChatDock />
 *
 * Width is inherited from the parent column; height is responsive and can be
 * overridden via `className`.
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useChat } from "./ChatProvider";
import ChatPanel from "./ChatPanel";

export default function HeroChatDock({ className = "" }: { className?: string }) {
  const { registerDock } = useChat();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerDock(ref.current);
    return () => registerDock(null);
  }, [registerDock]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`relative h-[460px] w-full sm:h-[500px] lg:h-[520px] ${className}`}
    >
      {/* Ambient glow so the dark panel reads as premium on the light hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-fuchsia-500/20 blur-2xl"
      />
      <div className="relative h-full w-full">
        <ChatPanel variant="docked" />
      </div>
    </motion.div>
  );
}
