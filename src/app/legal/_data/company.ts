/**
 * Single source of truth for the legal entity details and route map shared by
 * every /legal/* document.
 *
 * ── Why this file exists ──
 *
 * All six legal documents name the same company, the same registered office,
 * the same contact channels, and the same grievance officer. They also
 * cross-reference each other: the Terms incorporate the Privacy Policy, Cookie
 * Policy and Acceptable Use Policy by reference; the Acceptable Use Policy
 * points at the Copyright and DMCA Policy; the Cookie Policy points at the
 * Privacy Policy. Six copies of the same address is six chances for one to
 * drift, and hardcoded cross-links are how a legal document ends up citing a
 * 404.
 *
 * Both problems are solved the same way — declare it once here.
 *
 * ── A correction worth recording ──
 *
 * An earlier draft of the Cookie Policy used "Premises No. 07-0313", taken from
 * the contact page of elogixsoft.com. All six of the company's own legal
 * documents say **07-313**. The legal documents are authoritative for a
 * registered office, so that is what is used throughout. If the public contact
 * page is the one that is wrong, it should be corrected there too.
 */

/** Canonical paths for the legal documents, so cross-references cannot rot. */
export const LEGAL_ROUTES = {
  terms: "/legal/terms",
  privacy: "/legal/privacy",
  cookies: "/legal/cookies",
  acceptableUse: "/legal/acceptable-use",
  disclaimer: "/legal/disclaimer",
  copyright: "/legal/copyright",
} as const;

/**
 * The contracting party. Note the spelling: the legal documents use
 * "Elogix Software Private Limited" in full, not the "Pvt. Ltd." abbreviation
 * used elsewhere in the codebase for the brand-entity structured data. Inside a
 * binding agreement the registered form is the one that belongs.
 */
export const LEGAL_ENTITY = {
  name: "Elogix Software Private Limited",
  /** Corporate Identification Number, as stated in every document. */
  cin: "U72200WB2002PTC094194",
  /** How the publisher is introduced at the head of each contact block. */
  attribution: "Expendesk, a product of Elogix Software Private Limited",
  /** Registered office, one line per array entry for rendering. */
  addressLines: [
    "Premises No. 07-313, Plot No. DH-6/45",
    "Action Area-I, New Town",
    "Kolkata – 700156",
    "West Bengal, India",
  ],
  /** The same address as a single sentence, for use inside running prose. */
  addressInline:
    "Premises No. 07-313, Plot No. DH-6/45, Action Area-I, New Town, Kolkata – 700156, West Bengal, India",
  email: "info@expendesk.com",
  /** Marketing site, as named in the documents' definition of "Website". */
  websiteUrl: "https://www.expendesk.com",
  /** The product itself, as named in the documents' definition of "Platform". */
  platformUrl: "https://product.expendesk.com",
  contactPath: "/contact-sales",
} as const;

/** Grievance Officer, required under the IT Act, 2000 and the DPDP Act. */
export const GRIEVANCE_OFFICER = {
  name: "Mr. Pradip Chanda",
  designation: "Director, Elogix Software Private Limited",
  emailSubject: "Grievance – Expendesk",
} as const;

/**
 * Revision date carried by all six documents.
 *
 * This is the date printed on the source documents, not the date they were
 * published to the site — a legal document's "last updated" must track when its
 * terms last changed, not when the deployment happened.
 */
export const LEGAL_LAST_UPDATED = "2026-09-21";

/**
 * The closing contact block, identical across all six documents apart from the
 * introductory sentence, which names the document in question.
 */
export function legalContact(intro: string, heading?: string, outro?: string) {
  return {
    ...(heading ? { heading } : {}),
    ...(outro ? { outro } : {}),
    intro,
    attribution: LEGAL_ENTITY.attribution,
    pageHref: LEGAL_ENTITY.contactPath,
    pageLabel: "Contact us",
    email: LEGAL_ENTITY.email,
    address: [...LEGAL_ENTITY.addressLines],
  };
}
