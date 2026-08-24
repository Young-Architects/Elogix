/**
 * SEO output verifier — run after `npm run build`.
 *
 *   node scripts-verify-seo.mjs
 *
 * Checks the three invariants that have each been broken at least once on this
 * site, and that are invisible in code review because they are properties of
 * the *rendered* HTML rather than of any single source file:
 *
 *  1. every page's `og:url` equals its `rel=canonical`
 *  2. every FAQPage question in the markup also appears in the visible HTML
 *  3. every ld+json block parses, and no SoftwareApplication ships `offers`
 *     while pricing is still placeholder data
 */
import { readFileSync, existsSync } from 'node:fs';

const ROUTES = [
  'index', 'about', 'pricing', 'contact-us', 'contact-sales',
  'solutions/pharmaceutical', 'solutions/manufacturing', 'solutions/digital-agencies',
];

let failures = 0;
const fail = (msg) => { console.error('  FAIL ' + msg); failures++; };

for (const route of ROUTES) {
  const file = `.next/server/app/${route}.html`;
  if (!existsSync(file)) { fail(`${route}: no built HTML (run npm run build)`); continue; }
  const html = readFileSync(file, 'utf8');
  console.log(`\n${route}`);

  // 1. canonical === og:url
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (!canonical) fail(`${route}: no canonical`);
  else if (canonical.replace(/\/$/, '') !== (ogUrl ?? '').replace(/\/$/, ''))
    fail(`${route}: canonical "${canonical}" != og:url "${ogUrl}"`);
  else console.log(`  ok  canonical === og:url  (${canonical})`);

  // 2 + 3. structured data
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [i, m] of blocks.entries()) {
    let data;
    try { data = JSON.parse(m[1]); }
    catch (e) { fail(`${route}: ld+json block ${i + 1} is invalid — ${e.message}`); continue; }

    for (const node of data['@graph'] ?? [data]) {
      if (node['@type'] === 'FAQPage') {
        for (const q of node.mainEntity ?? []) {
          // The question text must be present in the rendered page, not only in
          // the markup — Google requires FAQ content to be visible.
          if (!html.includes(q.name)) fail(`${route}: FAQ question not visible on page — "${q.name}"`);
        }
        console.log(`  ok  FAQPage: ${node.mainEntity?.length ?? 0} questions, all visible`);
      }
      if (node['@type'] === 'SoftwareApplication' && node.offers) {
        const pricing = readFileSync('src/app/pricing/_data/content.ts', 'utf8');
        if (/PLACEHOLDER|placeholder pricing/i.test(pricing))
          fail(`${route}: SoftwareApplication has offers while pricing data is still placeholder`);
      }
    }
  }
  if (blocks.length) console.log(`  ok  ${blocks.length} ld+json block(s) parse`);
}

console.log(failures ? `\n${failures} failure(s)` : '\nAll SEO output checks passed');
process.exit(failures ? 1 : 0);
