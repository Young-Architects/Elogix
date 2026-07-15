"use client";

/**
 * GhlContactForm — the white form card on /contact-sales, embedding the
 * "Expendesk Book Demo Form" GHL (LeadConnector) form.
 *
 * The iframe carries the widget's `data-*` config verbatim; the companion
 * `form_embed.js` script reads it, wires up the postMessage channel, and
 * sets the iframe's inline height to the form's rendered height on every
 * viewport. Sizing gotchas, all measured against the live widget:
 *
 *  - Don't put a large min-height on the iframe: CSS min-height beats the
 *    script's inline height and pads the card with empty space. The small
 *    min-height here is only a boot fallback while the widget loads.
 *  - The inner form document can end up a few dozen px taller than the
 *    height the script reports (font loading, sub-pixel rounding, browser
 *    zoom), which makes the form scrollable INSIDE the iframe — the fields
 *    visibly shift when the wheel passes over the card. The MutationObserver
 *    below re-adds HEIGHT_BUFFER_PX on top of every height the script sets,
 *    so the inner document always fits and nothing can scroll.
 *  - The form document itself bakes in dead space around the fields, and it
 *    varies with the form's internal layout mode (by iframe width):
 *    <~480px → 135px above the first field / 148px below the submit button;
 *    ~500–600px → 95/108; ≥~650px (two-column fields, like the GHL builder
 *    preview) → 95/~48. It's cross-origin so we can't restyle it — the
 *    negative margins + the card's overflow-hidden crop it instead. Bottom
 *    crops include HEIGHT_BUFFER_PX on top of those gaps: -148px in the
 *    single-column modes and xl:-92px in two-column mode (the only place
 *    two-column occurs: ContactSalesSection caps the card at 600px below lg
 *    and the lg column is 560px, so only the xl 680px column crosses the
 *    ~640px two-column threshold).
 *  - The extra 30px of width + negative right margin push the iframe's
 *    scrollbar gutter past the card's overflow-hidden edge, so classic
 *    Windows scrollbars can never paint inside the card (30px minus 8–12px
 *    card padding clips ≥18px — a full 17px scrollbar).
 *
 * Embed config lives in ../_data/content.ts.
 */

import { useEffect } from "react";
import Script from "next/script";
import GhlEmbedLoader from "@/components/ui/GhlEmbedLoader";
import { useGhlEmbedLoaded } from "@/lib/use-ghl-embed-loaded";
import { salesFormEmbed } from "../_data/content";

/** Extra iframe height beyond what form_embed.js reports — see docblock. */
const HEIGHT_BUFFER_PX = 60;

export default function GhlContactForm() {
  const loaded = useGhlEmbedLoaded(salesFormEmbed.iframeId);

  useEffect(() => {
    const iframe = document.getElementById(
      salesFormEmbed.iframeId
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
  }, []);

  // min-height on the card: form_embed.js collapses the iframe while the
  // widget boots, and without it the card shrinks to a sliver and hides the
  // loading overlay. The loaded form is always taller than this.
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_48px_rgba(99,102,241,0.10),0_6px_20px_rgba(0,0,0,0.05)] sm:p-3">
      <GhlEmbedLoader loaded={loaded} label={salesFormEmbed.loadingLabel} />
      <iframe
        src={salesFormEmbed.src}
        id={salesFormEmbed.iframeId}
        title={salesFormEmbed.title}
        className="-mt-[40px] -mr-[30px] -mb-[148px] block min-h-[420px] w-[calc(100%+30px)] xl:-mb-[92px]"
        style={{
          border: "none",
          borderRadius: "3px",
        }}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={salesFormEmbed.title}
        data-height={salesFormEmbed.dataHeight}
        data-layout-iframe-id={salesFormEmbed.iframeId}
        data-form-id={salesFormEmbed.formId}
      />

      {/* Auto-resizes the LeadConnector iframe to its content height */}
      <Script src={salesFormEmbed.embedScriptSrc} strategy="afterInteractive" />
    </div>
  );
}
