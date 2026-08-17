/**
 * Site-wide JSON-LD structured data.
 *
 * ── Why this exists ──
 *
 * Searching "expendesk" on Google returns "Showing results for spendesk".
 * That is a *spelling correction*, and it happens when Google's index holds no
 * confident entity for the typed string but holds a very strong one for a
 * near-identical string. Google isn't ranking this site badly — it is not
 * convinced "Expendesk" is a word at all.
 *
 * Fixing that means publishing an unambiguous, machine-readable claim about
 * who this brand is. That's what the graph below does: it names the
 * organisation, ties it to the domain it owns, and corroborates it with the
 * social profiles the company controls (`sameAs`). Those are the signals
 * Google uses to promote a string from "probable typo" to "known entity" with
 * its own brand SERP.
 *
 * ── Why one @graph rather than several separate scripts ──
 *
 * Each node gets a stable `@id` and references the others by that `@id`, so
 * the Organization, the WebSite and the product are read as one connected
 * entity rather than three unrelated islands. Disconnected blobs are much
 * weaker evidence — the whole point is to state that *this* site is published
 * by *this* company which makes *this* product.
 *
 * Everything asserted here must be independently true and verifiable. There
 * are deliberately no `aggregateRating`, `review` or `offers` nodes: inventing
 * them is a structured-data policy violation, and the pricing figures in the
 * app are still placeholders.
 */
import {
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  CONTACT_EMAIL,
  PARENT_ORGANIZATION,
  BRAND_ALTERNATE_NAMES,
  absoluteUrl,
} from '@/lib/site';

/** Stable node identifiers. Fragment `@id`s on the canonical origin are the
 *  convention for "the concept of X as described by this site". */
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#software`;
const PARENT_ORGANIZATION_ID = `${SITE_URL}/#parent-organization`;

const DESCRIPTION =
  'Expendesk is an expense intelligence platform for finance teams. Track expenses, automate reimbursements, enforce spend policies, and get real-time visibility into company spending from one platform built for SMEs and mid-market businesses.';

/**
 * `disambiguatingDescription` exists in schema.org for exactly this situation:
 * "a short description of the item used to disambiguate from other, similar
 * items". The similar item here is Spendesk, and the confusion is not
 * hypothetical — it is the literal failure mode this whole file was written to
 * address.
 *
 * Note what this sentence does and does not do. It states, in the site's own
 * structured data, who owns the name and who publishes the product. It does
 * *not* name the competitor: "not to be confused with Spendesk" would put a
 * rival's brand into this site's entity data and invite the association it is
 * trying to break. Asserting a positive identity is what separates two
 * entities; denying another one only links them.
 */
const DISAMBIGUATING_DESCRIPTION =
  `Expendesk is an expense and reimbursement management platform published by ${PARENT_ORGANIZATION.name}, an IT company operating from Kolkata, India since 2000. Expendesk is the product's full and official name.`;

/**
 * The site-wide entity graph, rendered once in the root layout.
 *
 * Typed loosely (`Record<string, unknown>`) on purpose — schema.org is an open
 * vocabulary and hand-maintaining TypeScript types for it adds friction
 * without catching the errors that actually matter here (which are factual,
 * not structural). Correctness is verified against Google's Rich Results Test
 * instead; see docs/SEO.md.
 */
export function siteStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: SITE_NAME,
        // Spellings people actually use for this brand. This is the direct
        // counter-signal to the "did you mean Spendesk" correction: it tells
        // Google the exact string "Expendesk" names a real organisation.
        alternateName: [...BRAND_ALTERNATE_NAMES],
        legalName: SITE_NAME,
        url: `${SITE_URL}/`,
        description: DESCRIPTION,
        disambiguatingDescription: DISAMBIGUATING_DESCRIPTION,
        // The brand is a product of a company that has been indexed for 25
        // years. Naming that company here is what lets an unknown string
        // inherit an established entity's credibility — see PARENT_ORGANIZATION.
        parentOrganization: { '@id': PARENT_ORGANIZATION_ID },
        email: CONTACT_EMAIL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: absoluteUrl('/logo.png'),
          contentUrl: absoluteUrl('/logo.png'),
          caption: SITE_NAME,
        },
        image: { '@id': `${SITE_URL}/#logo` },
        // Independent corroboration that the brand exists off its own domain.
        sameAs: SOCIAL_PROFILES,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: CONTACT_EMAIL,
            url: absoluteUrl('/contact-sales'),
            availableLanguage: ['en'],
          },
        ],
      },
      /**
       * The parent company, as a node of its own rather than an inline blob.
       *
       * Giving it an `@id` and its own `url` + `sameAs` makes it a first-class
       * entity in the graph, which is what allows Google to reconcile it with
       * the Elogix entity it already holds — the one behind the AI Overview's
       * "by Elogix Software". An inline `parentOrganization: { name: "..." }`
       * would be an unresolvable string; this is a claim it can verify against
       * three independent sources.
       */
      {
        '@type': 'Organization',
        '@id': PARENT_ORGANIZATION_ID,
        name: PARENT_ORGANIZATION.name,
        alternateName: PARENT_ORGANIZATION.shortName,
        url: PARENT_ORGANIZATION.url,
        sameAs: [...PARENT_ORGANIZATION.sameAs],
        subOrganization: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        alternateName: 'Expendesk — Expense Intelligence Platform',
        url: `${SITE_URL}/`,
        description: DESCRIPTION,
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': SOFTWARE_ID,
        name: SITE_NAME,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Expense Management Software',
        operatingSystem: 'Web',
        url: `${SITE_URL}/`,
        description: DESCRIPTION,
        disambiguatingDescription: DISAMBIGUATING_DESCRIPTION,
        publisher: { '@id': ORGANIZATION_ID },
        provider: { '@id': ORGANIZATION_ID },
        featureList: [
          'Expense tracking',
          'Automated reimbursements',
          'Spend policy enforcement',
          'Approval workflows',
          'Real-time spend visibility',
          'Receipt capture and matching',
        ],
      },
    ],
  };
}

/**
 * `BreadcrumbList` for a page, so Google can render the site's hierarchy in
 * the result snippet instead of a bare URL.
 *
 * `trail` is ordered root-first and excludes the home page, which is prepended
 * here — e.g. `[{ name: 'Pricing', path: '/pricing' }]`.
 */
export function breadcrumbStructuredData(
  trail: ReadonlyArray<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map(
      (crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })
    ),
  };
}

/**
 * `WebPage` (or a subtype) for a single route, wired back into the site-wide
 * graph by `@id`.
 *
 * The root layout's graph describes the *site*. This describes *one page* and
 * says which entity that page is about — `about` is the property Google reads
 * to answer "what is this page's subject". On the brand page that subject is
 * the Organization itself, which is the most explicit statement the site can
 * make that "Expendesk" is the name of a company, not a typo.
 *
 * `type` accepts any WebPage subtype (`AboutPage`, `ContactPage`, …); the
 * default plain `WebPage` is correct for everything else.
 */
export function webPageStructuredData({
  path,
  name,
  description,
  type = 'WebPage',
  about = 'organization',
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
  about?: 'organization' | 'software' | null;
}): Record<string, unknown> {
  const url = absoluteUrl(path);
  const aboutId =
    about === 'organization'
      ? ORGANIZATION_ID
      : about === 'software'
        ? SOFTWARE_ID
        : null;

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
    ...(aboutId ? { about: { '@id': aboutId }, mainEntity: { '@id': aboutId } } : {}),
  };
}

/**
 * Serialise JSON-LD for injection into a `<script type="application/ld+json">`.
 *
 * Every left angle bracket is replaced with its unicode escape, so a stray
 * closing script tag inside any string value cannot terminate the script
 * element early — the standard guard for inline JSON, and cheap insurance now
 * that some of this content is CMS-adjacent.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
