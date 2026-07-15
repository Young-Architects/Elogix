"use client";

/**
 * GhlEmbedLoader — branded loading overlay for the GHL embeds on
 * /contact-us (booking calendar) and /contact-sales (contact form).
 *
 * Absolutely positioned over the embed card (the card supplies `relative` +
 * `overflow-hidden`), so it adds nothing to the layout: it covers the white
 * card while the widget boots and fades out — staying mounted but
 * click-through — once `loaded` flips (see useGhlEmbedLoaded).
 */

export default function GhlEmbedLoader({
  loaded,
  label,
}: {
  loaded: boolean;
  label: string;
}) {
  return (
    <div
      role="status"
      aria-hidden={loaded}
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white transition-opacity duration-500 ${
        loaded ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Spinner ring around the brand mark (same mark as the navbar logo) */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-500"
        />
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-[13px] font-bold text-white shadow-[0_6px_20px_rgba(99,102,241,0.38)]"
        >
          E
        </span>
      </div>
      <p className="text-[13px] font-medium text-slate-500">{label}</p>
    </div>
  );
}
