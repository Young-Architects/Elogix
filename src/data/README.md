# Data Directory

Centralised content for the site. **No marketing copy is hardcoded in components** — every section reads its own JSON here and maps string `iconKey`s onto Lucide/SVG icons through a local registry, so the JSON stays serialisable and never imports React.

> Replace placeholder values with real API responses before going to production.

## Home-page sections

Files under `sections/` map 1-to-1 with a component in `src/components/sections/`. The rows below are in **visual page order** (the same order they render in [`src/app/page.tsx`](../app/page.tsx)). The **Anchor** is the section's DOM `id` — in-page nav/footer links target `/#<anchor>`, so keep these in sync with `navigation.json` and `footer.json`.

| # | Section | Anchor (`id`) | Component | Data file |
|---|---------|---------------|-----------|-----------|
| 1 | Hero | `hero` | `HeroSection.tsx` | `sections/hero.json` |
| 2 | Problem | `problem` | `ProblemSection.tsx` | `sections/problem.json` |
| 3 | Solution | `solution` | `SolutionSection.tsx` | `sections/solution.json` |
| 4 | Benefits | `benefits` | `BenefitsSection.tsx` | `sections/benefits.json` |
| 5 | Features / Industries | `features-video` | `FeaturesVideo.tsx` | `sections/features.json` |
| 6 | How It Works | `how-it-works` | `HowItWorksSection.tsx` | `sections/how-it-works.json` |
| 7 | Free Guide (lead magnet) | `lead-magnet` | `LeadMagnetSection.tsx` | `sections/lead-magnet.json` |
| 8 | Comparison (Traditional vs Expendesk) | `comparison` | `ComparisonSection.tsx` | `sections/comparison.json` |
| 9 | Testimonials | `testimonials` | `TestimonialsSection.tsx` | `sections/testimonials.json` |
| 10 | FAQ | `faq` | `FaqSection.tsx` | `sections/faq.json` |
| 11 | Why Expendesk (+ final CTA) | `why-expendesk` | `WhyExpendesk.tsx` | `sections/why-expendesk.json` |

## Site chrome

| File | Consumed by | Contents |
|------|-------------|----------|
| `navigation.json` | [`components/layout/Navbar.tsx`](../components/layout/Navbar.tsx) | Top-level nav items, the Home/Solutions/Resources dropdown entries, and the Login + CTA buttons. The Home dropdown mirrors the section anchors above. |
| `footer.json` | [`components/layout/Footer.tsx`](../components/layout/Footer.tsx) | Brand blurb, link columns (Solutions / Features / Resources / Quick Links), socials, and legal links. The **Features** column mirrors the section anchors above. The footer's own root carries `id="footer"`, so the Home dropdown's "Footer" link (`/#footer`) scrolls to it. |

## Conventions

- **Adding a section:** create `sections/<key>.json`, build `src/components/sections/<Name>.tsx` reading it, register the component in `src/app/page.tsx`, add its anchor to the Home dropdown in `navigation.json` + the Features column in `footer.json`, and add a row to the table above.
- **Icons:** data stores a string `iconKey` (e.g. `"bar-chart"`); the component maps it to a Lucide/SVG component via a local `ICON_MAP`. Never put JSX/React in JSON.
- **Split headlines:** headlines that render a gradient run are stored as parts (e.g. `{ "plain": "…", "accent": "…" }`) so the gradient stays data-driven.
- **Styling:** section CSS lives in [`src/app/globals.css`](../app/globals.css); components use `style={{}}` only for runtime/data-driven values (accent colours, dynamic widths). No `<style>` blocks in components.
