# Expendesk — Content Export (for the Backend / CMS team)

This folder is the **content handover package** for the Expendesk marketing site. It contains every piece of editable text/content that appears on the site, as clean JSON, with all frontend presentation details removed.

**Goal:** the backend team models these as fields in a headless CMS (WordPress + ACF on Hostinger). The website will later fetch this content from the CMS instead of the local files, so marketing can edit copy without a developer.

> ⚠️ This is an **export/reference package only.** The live website does **not** read from this folder — it still reads its own copies under `src/`. Editing files here does **not** change the website. This folder exists so you can see the exact shape and values the CMS must produce. See "How this connects to the site" below.

---

## What's in here

```
content-export/
├── README.md                    ← this file
├── ACF-FIELD-MAP.md             ← field-by-field guide for building the ACF groups
├── global/
│   ├── navigation.json          ← Navbar links + dropdowns + Login/CTA
│   └── footer.json              ← Footer brand, link columns, socials, legal
├── home/                        ← the one long home page, one file per section
│   ├── hero.json
│   ├── problem.json
│   ├── solution.json
│   ├── benefits.json
│   ├── features.json            ← "Features / By Industry" section
│   ├── lead-magnet.json         ← free eBook block
│   ├── testimonials.json
│   └── why-expendesk.json       ← before/after comparison
└── solutions/                   ← per-industry landing pages
    ├── digital-agencies.json
    ├── manufacturing.json
    └── pharmaceutical/          ← multi-section page, one file per section
        ├── hero.json
        ├── problem.json
        ├── self-assessment.json
        ├── checklist-intro.json
        ├── bridge.json
        ├── introducing-expendesk.json
        ├── checklist-contents.json
        ├── choose-next-step.json
        └── final-cta.json
```

Each file starts with a `"_section"` label naming where it appears on the site. That key is documentation only — ignore it when modelling fields.

---

## Conventions (please read before modelling fields)

**1. Content only — no styling.** Colours, fonts, Tailwind classes, gradients, animation timings, and layout hints have been **stripped out** on purpose. Those stay in the website code. You only manage the words, numbers, links, and images.

**2. `icon` = a name, not an image.** Where an item has an `"icon"` field (e.g. `"shield-check"`, `"clock"`, `"download"`), it is a **semantic name**. The website already has these icons drawn in code and picks one by this name. In the CMS, model this as a **text field or a fixed dropdown** of allowed names — not a file/image upload. The allowed values per section are listed in `ACF-FIELD-MAP.md`. If marketing shouldn't change icons, you can leave `icon` out of the CMS entirely and let the site keep its defaults.

**3. `id` fields are stable keys — keep them.** Items like testimonials, questions, and cards have an `"id"`. The website matches CMS content back to its styling using this `id`, so **do not change or reorder-away existing ids**. New items need a new unique id.

**4. `emoji` is content.** Some sections (mostly pharmaceutical) use an `"emoji"` field as real, editable content — model it as a short text field.

**5. `null` means "intentionally empty / optional."** e.g. a testimonial `metric: null` shows no metric badge; a card `tag: null` shows no tag. Model these as optional fields.

**6. Split headlines.** A few headlines were originally split into parts (e.g. `pre` / `accent` / `post`, or `lead` / `accent` / `tail`) so the site can colour one word differently. In this export they are mostly **joined back into one plain string** for easy editing. Where a split remains (some solution headlines still have `pre`/`accent`), it's because the site needs to know which word gets the coloured/gradient treatment — keep those sub-fields.

**7. Numbers vs strings.** Stat/metric `value`s are sometimes numbers (`94`, animated as a count-up) and sometimes strings (`"38%"`, `"3×"`, `"Live"`). Keep the type as shown in each file.

---

## How this connects to the site (for whoever wires up the fetch later)

Today each section component imports its content locally, e.g. the home Hero reads `src/data/sections/hero.json`. The migration path is:

1. Backend team builds ACF field groups matching these files (one group per file is the simplest 1:1 mapping) and exposes them via the **WordPress REST API** or **WPGraphQL**.
2. Frontend adds a small data layer that fetches the same shape from WordPress and **falls back to the local JSON** if the CMS is unreachable.
3. Because the shapes match and `id`s are preserved, the site re-attaches its styling (icons, colours, animations) to the fetched content with no visual change.

Keeping the JSON **shape and field names identical** to these files is what makes step 2 a drop-in. If you rename fields in ACF, please give the frontend team a mapping.

---

## Source of truth (where these came from)

These files were generated from the website's current content:
- `home/*` and `global/*` ← `src/data/**` (already JSON on the site)
- `solutions/digital-agencies` · `manufacturing` ← each page's `_data/content.ts`
- `solutions/pharmaceutical/*` ← `src/app/solutions/pharmaceutical/_data/*.ts`

If the website copy changes before the CMS goes live, regenerate this folder so it stays in sync.
