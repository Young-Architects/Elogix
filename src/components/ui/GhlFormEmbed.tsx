"use client";

/**
 * GhlFormEmbed — a GHL (LeadConnector) form inside a white card.
 *
 * Generalised from the /contact-sales form so the demo funnel embeds a second
 * GHL form without a second copy of the sizing workarounds below. Those were
 * measured against the live widget and are easy to get subtly wrong; one copy
 * is the point of this file.
 *
 * The iframe carries the widget's `data-*` config verbatim; the companion
 * `form_embed.js` script reads it, wires up the postMessage channel, and sets
 * the iframe's inline height to the form's rendered height on every viewport.
 * Sizing gotchas, all measured against the live widget:
 *
 *  - Don't put a large min-height on the iframe: CSS min-height beats the
 *    script's inline height and pads the card with empty space. The small
 *    min-height here is only a boot fallback while the widget loads.
 *  - The inner form document can end up a few dozen px taller than the height
 *    the script reports (font loading, sub-pixel rounding, browser zoom), which
 *    makes the form scrollable INSIDE the iframe — the fields visibly shift
 *    when the wheel passes over the card. The MutationObserver below re-adds
 *    HEIGHT_BUFFER_PX on top of every height the script sets, so the inner
 *    document always fits and nothing can scroll.
 *  - The form document itself bakes in dead space around the fields, and it
 *    varies with the form's internal layout mode (by iframe width):
 *    <~480px → 135px above the first field / 148px below the submit button;
 *    ~500–600px → 95/108; ≥~650px (two-column fields) → 95/~48. It's
 *    cross-origin so we can't restyle it — negative margins plus the card's
 *    overflow-hidden crop it instead. `cropClassName` carries those crops so a
 *    caller whose column width crosses a different layout threshold can tune
 *    them without touching this component. **These numbers are per-form.** The
 *    value that is right for one GHL form will clip another: /book-a-demo's
 *    form has markedly less padding below its submit button than
 *    /contact-sales', and reusing the latter's -mb-[148px] sliced its CTA in
 *    half. Crop too little and you get whitespace; crop too much and you lose
 *    the primary button, so tune upward from a safe value, never downward from
 *    a borrowed one.
 *  - The extra 30px of width + negative right margin push the iframe's
 *    scrollbar gutter past the card's overflow-hidden edge, so classic Windows
 *    scrollbars can never paint inside the card (30px minus 8–12px card padding
 *    clips ≥18px — a full 17px scrollbar).
 */

import { useEffect } from "react";
import Script from "next/script";
import GhlEmbedLoader from "@/components/ui/GhlEmbedLoader";
import { useGhlEmbedLoaded } from "@/hooks/use-ghl-embed-loaded";

/** Extra iframe height beyond what form_embed.js reports — see docblock. */
const HEIGHT_BUFFER_PX = 60;

/** Shape of a GHL form embed, as copied out of the widget's embed snippet. */
export interface GhlFormEmbedConfig {
  src: string;
  formId: string;
  iframeId: string;
  embedScriptSrc: string;
  title: string;
  /** The widget's own `data-height` from the GHL embed snippet. */
  dataHeight: string;
  /** Shown in the loading overlay while the widget boots. */
  loadingLabel: string;
}

export default function GhlFormEmbed({
  embed,
  cropClassName = "-mt-[40px] -mr-[30px] -mb-[148px] xl:-mb-[92px]",
  className = "",
}: {
  embed: GhlFormEmbedConfig;
  /**
   * Negative margins cropping the widget's baked-in dead space. The default is
   * tuned for a single-column column that widens to two columns at xl; pass
   * your own if the card's width crosses a different threshold.
   */
  cropClassName?: string;
  /** Extra classes on the outer card. */
  className?: string;
}) {
  const loaded = useGhlEmbedLoaded(embed.iframeId);

  useEffect(() => {
    const iframe = document.getElementById(
      embed.iframeId
    ) as HTMLIFrameElement | null;
    if (!iframe) return;

    const bump = (): void => {
      // Our own mutation — already buffered, nothing to do (loop guard).
      if (iframe.style.height === iframe.dataset.bufferedHeight) return;
      const reported = Number.parseFloat(iframe.style.height);
      if (!Number.isFinite(reported)) return;
      const next = `${Math.round(reported) + HEIGHT_BUFFER_PX}px`;
      iframe.dataset.bufferedHeight = next;
      iframe.style.height = next;
    };

    const observer = new MutationObserver(bump);
    observer.observe(iframe, { attributes: true, attributeFilter: ["style"] });
    bump();
    return () => observer.disconnect();
  }, [embed.iframeId]);

  // min-height on the card: form_embed.js collapses the iframe while the widget
  // boots, and without it the card shrinks to a sliver and hides the loading
  // overlay. The loaded form is always taller than this.
  return (
    <div
      className={`relative min-h-[420px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_48px_rgba(99,102,241,0.10),0_6px_20px_rgba(0,0,0,0.05)] sm:p-3 ${className}`}
    >
      <GhlEmbedLoader loaded={loaded} label={embed.loadingLabel} />
      <iframe
        src={embed.src}
        id={embed.iframeId}
        title={embed.title}
        className={`block min-h-[420px] w-[calc(100%+30px)] ${cropClassName}`}
        style={{ border: "none", borderRadius: "3px" }}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={embed.title}
        data-height={embed.dataHeight}
        data-layout-iframe-id={embed.iframeId}
        data-form-id={embed.formId}
      />

      {/* Auto-resizes the LeadConnector iframe to its content height */}
      <Script src={embed.embedScriptSrc} strategy="afterInteractive" />
    </div>
  );
}
