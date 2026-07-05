# ACF Field Map — Expendesk Content

A build guide for turning each JSON file in this package into a **WordPress + ACF field group**. Read `README.md` first for the conventions (icon = name not image, keep `id`s, content-only, etc.).

**Recommended approach:** one **ACF Field Group per JSON file**, attached to a matching page or an "Options" page. Field names below are the JSON keys — keep them identical so the frontend fetch is a drop-in. Repeating lists (arrays of objects) map to ACF **Repeater** fields; nested single objects map to ACF **Group** fields.

ACF field-type shorthand used below: **Text** (single line), **Textarea** (multi-line), **URL**, **Number**, **True/False** (boolean), **Select** (fixed dropdown), **Repeater** (list), **Group** (nested object).

---

## Global

### `global/navigation.json` → Group "Navigation"
- `items` — **Repeater**
  - `label` Text · `href` Text
  - `dropdown` — **Repeater** (optional): `icon` Select · `label` Text · `desc` Text · `href` Text
- `login` — **Group**: `label` Text · `href` Text
- `cta` — **Group**: `label` Text · `href` Text

### `global/footer.json` → Group "Footer"
- `brand` — **Group**: `name` Text · `subheading` Textarea · `tagline` Text
- `columns` — **Repeater**: `heading` Text · `links` **Repeater** (`label` Text · `href` Text)
- `socials` — **Repeater**: `icon` Select · `label` Text · `href` Text
- `legal` — **Repeater**: `label` Text · `href` Text

---

## Home page (`home/`)

### `hero.json` → "Home Hero"
- `badge` Group: `text` Text · `tag` Text
- `headline` Text · `description` Textarea · `highlightText` Text · `subDescription` Textarea
- `trustPills` Repeater: `icon` Select · `label` Text
- `ctas` Group: `primary`(Group: `label`,`href`) · `secondary`(Group: `label`,`href`)
- `stats` Repeater: `value` Number · `suffix` Text · `label` Text
- `featureCards` Repeater: `icon` Select · `title` Text · `description` Textarea
- `socialProof` Group: `businessCount` Text · `businessText` Text · `rating` Number · `ratingText` Text · `avatarInitials` Repeater(Text)

### `problem.json` → "Home Problem"
- `sectionLabel` Text · `headline` Text · `description` Textarea
- `chaosPoint` Group: `emoji` Text · `label` Text
- `causes` Repeater: `id` Text · `emoji` Text · `title` Text · `sub` Text · `tag` Text (optional)
- `effects` Repeater: `id` Text · `emoji` Text · `title` Text · `badge` Text
- `stats` Repeater: `value` Text · `label` Text
- `bottomCta` Group: `heading` Text · `subtext` Text · `buttonLabel` Text

### `solution.json` → "Home Solution"
- `badge` Text
- `hero` Group: `headline`(Group: `pre`,`brand`,`sub`) · `description` Textarea · `bullets` Repeater(`text` Text · `positive` True/False) · `cta` Text
- `nodeDiagram` Group: `chaosLabel`,`controlLabel`,`brandName`,`brandTagline` Text · `chaosNodes`/`controlNodes` Repeater(`label` Text · `emoji` Text)
- `featuresSection` Group: `heading` Text · `subheading` Text · `features` Repeater(`icon` Select · `title` Text · `desc` Textarea)
- `stats` Repeater: `icon` Select · `value` Number (nullable) · `suffix` Text · `label` Text · `sub` Text
- `dashboardCta` Group: `headline` · `description` · `buttonLabel`
- `dashboardPreview` Group: `title`,`totalLabel`,`totalSpending`,`trend` Text · `transactions` Repeater(`name`,`amount`,`dept`,`status` Text)

### `benefits.json` → "Home Benefits"
- `sectionContent` Group: `badge` Text · `heading` Text · `subheading` Textarea · `cta`(Group: `eyebrow`,`body`,`buttonLabel`)
- `cards` Repeater: `id` Text · `icon` Select · `title` Text · `description` Textarea · `metric`(Group: `value` Number · `suffix` Text · `label` Text, optional) · `bars`(Repeater `label`,`tag`, optional) · `dualMetrics`(Repeater `value`,`suffix`,`label`, optional)
- `ticker` Repeater(Text)

### `features.json` → "Home Features / Industry"
- `featuresVideo` Group: `badge`,`headline`,`subheading`,`browserMockupUrl` Text · `floatingBadges` Repeater(`id`,`icon` Select,`title`,`subtitle`) · `stats` Repeater(`id`,`value`,`label`,`sub`)
- `industrySection` Group: `badge`,`headline`,`subheading` Text · `featurePills` Repeater(Text) · `comingSoon`(Group `label`,`subtitle`) · `interactionHints`(Group `mobile`,`desktopMain`,`desktopSub`) · `industries` Repeater(`id`,`icon` Select,`label`,`tagline`,`description`,`badge` [optional], `stats` Repeater(`value`,`label`))

### `lead-magnet.json` → "Home Lead Magnet"
- `eyebrow`,`headline` Text · `subheadline` Textarea · `insideLabel` Text · `bullets` Repeater(Text)
- `ctaButton`,`ctaNote` Text · `pdfUrl` URL/File · `downloadFilename` Text
- `bookMeta` Group: `pages`,`format`,`level` Text · `floatingTags` Repeater(`text` Text)

### `testimonials.json` → "Home Testimonials"
- `section` Group: `badge`(Group `label` Text,`rating` Number) · `headline` Text · `bottomCta`(Group `pre`,`highlight`,`post`)
- `testimonials` Repeater: `id` Text · `quote` Textarea · `author`,`role`,`company`,`companyType` Text · `avatar` Text (initials) · `avatarImage` Image (optional, may be null) · `rating` Number · `metric`(Group `value`,`label`, optional/null)

### `why-expendesk.json` → "Home Why Expendesk"
- `badge`,`heading` Text · `subheading` Textarea
- `columns` Group: `aspect` Text · `before`(Group `label`,`caption`) · `after`(Group `label`,`caption`,`tag`)
- `comparisons` Repeater: `id`,`aspect`,`before`,`after` Text · `icon` Select · `detail` Textarea · `metric`,`metricLabel` Text
- `cta` Group: `heading`,`prompt`,`button`,`note` Text · `body` Textarea · `trustPoints` Repeater(Text)

---

## Solution pages (`solutions/`)

### `digital-agencies.json` / `manufacturing.json` → "Solution: <industry>"
Same shape for both:
- `meta` Group: `title` Text · `description` Textarea (SEO)
- `eyebrow` Text · `headline` Group(`pre` Text · `accent` Text) · `description` Textarea
- `cta` Group: `label`,`href`
- `benefits` Group: `heading` Text · `items` Repeater(`title` Text · `desc` Textarea)

### Pharmaceutical (`solutions/pharmaceutical/`) — one group per section

- **`hero.json`** → `badge` Text · `headline` Text · `subheadline`(Group `emphasis`,`body`) · `benefits` Repeater(Text) · `ctaPrimary`,`ctaSecondary`,`trustedByLabel` Text · `trustTags` Repeater(Text)
- **`problem.json`** → `badge`,`headline`,`intro` · `impactStats` Repeater(`value` Number,`suffix`,`label`,`emoji`) · `mrExpensesLabel` · `mrExpenses` Repeater(`emoji`,`label`) · `legacyDivider`(Group `emoji`,`label`) · `oldToolsFooter` · `oldTools` Repeater(`emoji`,`name`,`desc`,`tag`) · `result`(Group `eyebrow`,`headline`,`subtext`) · `problems` Repeater(`emoji`,`label`,`body`) · `closing`(Group `emoji`,`badge`,`headline`,`body`,`cta`)
- **`self-assessment.json`** → `badge`,`heading`,`subheading`,`liveScoreLabel`,`ofLabel`,`scheduleCta` · `closing`(Group `emphasis`,`body`) · `questions` Repeater(`id`,`question`) · `tiers` Group of 4 sub-groups (`idle`/`critical`/`atRisk`/`strong`, each `label`,`message`)
- **`checklist-intro.json`** → `badge`,`heading`,`builtForLabel` · `roles` Repeater(`label`,`icon` Select) · `closing`(Group `emphasis`,`body`) · `cta`(Group `label`,`href` URL,`downloadName`,`subtext`) · `document`(Group: `ribbon`,`fileName`,`pointsBadge`; `evaluates` Repeater(`label`,`icon`); `footer` Group(`time`,`categories`); `floatingBadge` Group(`title`,`subtitle`))
- **`bridge.json`** → `badge`,`heading`,`subheading` · `challenges` Repeater(`id`,`label`,`icon` Select) · `closing` Textarea
- **`introducing-expendesk.json`** → `badge`,`heading`,`subheading` · `features` Repeater(`id` Number,`label`,`icon` Select) · `outro` Textarea · `cta`(Group `label`,`href`)
- **`checklist-contents.json`** → `badge`,`heading` · `totalAreas` Number · `items` Repeater(`id` Number,`title`,`icon` Select) · `locked`(Group `lead`,`accentSuffix`). Note: hidden count = `totalAreas − items.length`, computed by the site.
- **`choose-next-step.json`** → `badge`,`heading` · `options` Repeater(`id` Number,`label`,`title`,`description`,`buttonLabel`,`icon` Select) · `trust`(Group `heading`,`subheading`; `points` Repeater(Text))
- **`final-cta.json`** → `heading`,`subheading` · `panels` Repeater(`isPrimary` True/False,`icon` Select,`eyebrow` [optional],`title`,`description` Textarea [optional],`buttonLabel`)

---

## Appendix — allowed `icon` values

`icon` fields are semantic names the website maps to a built-in icon. If you model them as **Select** dropdowns, use these value lists. (If marketing won't change icons, omit the field and the site keeps its defaults.)

- **Home hero / trust / feature cards:** `shield-check`, `zap`, `eye`, `alert-triangle`, `git-branch`, `clock`
- **Home solution features & stats:** `camera`, `bolt`, `shield`, `users`, `refresh`, `file`, `bar-chart`
- **Home benefits cards:** `eye`, `calendar`, `building`, `trending`, `timer`, `shield`
- **Home features/industry:** `receipt`, `git-branch`, `wallet`, `file-text`, `monitor`, `cpu`, `briefcase`, `users`
- **Home why-expendesk:** `workflow`, `zap`, `camera`, `bar-chart`, `shield-check`, `wallet`
- **Navigation:** `home`, `alert-triangle`, `check-circle`, `star`, `play`, `mail`, `message-circle`, `help-circle`, `shield`, `zap`, `bar-chart-2`, `file-text`, `briefcase`, `book-open`
- **Footer socials:** `linkedin`, `youtube`, `facebook`, `instagram`, `x`
- **Pharma checklist-intro roles:** `briefcase`, `chart-bar`, `handshake`, `target`, `users`
- **Pharma checklist-intro evaluates:** `wallet`, `document`, `workflow`, `shield-alert`, `chart-line`, `shield-check`, `smile`
- **Pharma bridge:** `file-warning`, `clock`, `eye-off`, `hourglass`, `shield-alert`, `alert-triangle`
- **Pharma introducing:** `file-check`, `zap`, `shield-check`, `workflow`, `bar-chart`, `trending-down`, `smile`
- **Pharma checklist-contents:** `receipt`, `fuel`, `plane`, `workflow`, `shield-alert`, `file-check`, `clipboard-check`, `eye`, `smile`, `bar-chart`
- **Pharma choose-next-step / final-cta:** `download`, `calendar`

> The website will ignore an unknown icon name and fall back to a default, so a typo won't break the page — but it won't show the intended icon either.
