"use client";

/**
 * GhlContactForm — the white form card on /contact-sales, embedding the
 * "Contact Expendesk" GHL (LeadConnector) form.
 *
 * The iframe carries the widget's `data-*` config verbatim; the companion
 * `form_embed.js` script reads it, wires up the postMessage channel, and
 * sets the iframe's inline height to the form's rendered height on every
 * viewport. Two sizing gotchas, both measured against the live widget:
 *
 *  - Don't put a large min-height on the iframe: CSS min-height beats the
 *    script's inline height and pads the card with empty space. The small
 *    min-height here is only a boot fallback while the widget loads.
 *  - The form document itself bakes in a constant ~148px of dead space below
 *    the submit button and ~110px above the first field (same at 330/380/454px
 *    widths). It's cross-origin so we can't restyle it — instead the negative
 *    margins + the card's overflow-hidden crop it to a balanced ~50px of
 *    padding on each side.
 *
 * Embed config lives in ../_data/content.ts.
 */

import Script from "next/script";
import { salesFormEmbed } from "../_data/content";

export default function GhlContactForm() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_48px_rgba(99,102,241,0.10),0_6px_20px_rgba(0,0,0,0.05)] sm:p-3">
      <iframe
        src={salesFormEmbed.src}
        id={salesFormEmbed.iframeId}
        title={salesFormEmbed.title}
        className="-mt-[56px] -mb-[130px] block min-h-[420px] w-full"
        style={{
          width: "100%",
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
        data-height="863"
        data-layout-iframe-id={salesFormEmbed.iframeId}
        data-form-id={salesFormEmbed.formId}
      />

      {/* Auto-resizes the LeadConnector iframe to its content height */}
      <Script src={salesFormEmbed.embedScriptSrc} strategy="afterInteractive" />
    </div>
  );
}
