/**
 * Cookie Policy copy for /legal/cookies.
 *
 * ── Provenance ──
 *
 * Transcribed verbatim from Expendesk_Cookie_Policy.pdf (last updated
 * 21 September 2026). The wording has NOT been edited, rewritten or summarised
 * — it is a legal document, and paraphrasing one is how a clause quietly stops
 * meaning what it was drafted to mean. Only the PDF's page furniture (running
 * header and footer) was dropped.
 *
 * ── This replaced an earlier draft ──
 *
 * The first version of this page was built from a generic third-party template
 * with bracketed placeholders. This document supersedes it entirely: it names
 * the contracting entity and its CIN inline, covers the Platform as well as the
 * Website, adds the cookie-categories table and the "Your consent" section, and
 * names the actual providers in use (Google Analytics via GTM, LinkedIn Insight
 * Tag, Meta Pixel, Expy AI). Nothing from the template survives.
 *
 * Entity details and cross-document links come from ../../_data/company.ts —
 * never hardcode the address or another policy's path here.
 */
import {
  LEGAL_ENTITY,
  LEGAL_LAST_UPDATED,
  LEGAL_ROUTES,
  legalContact,
} from "../../_data/company";
import type { LegalDocument } from "../../_data/types";

/** Browser cookie-settings help pages, as referenced by the document. */
const BROWSER_HELP = {
  chrome: "https://support.google.com/chrome/answer/95647",
  firefox:
    "https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer",
  safari: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
  gaOptOut: "https://tools.google.com/dlpage/gaoptout",
} as const;

export const cookiePolicy: LegalDocument = {
  eyebrow: "Legal",
  title: "Cookie Policy",
  lastUpdated: LEGAL_LAST_UPDATED,

  intro: [
    {
      type: "p",
      content: [
        "This cookie policy (“Policy”) describes what cookies are and how they are being used by the ",
        { text: LEGAL_ENTITY.websiteUrl, href: `${LEGAL_ENTITY.websiteUrl}/`, external: true },
        " website (“Website”), the Expendesk expense and reimbursement management platform available at ",
        { text: LEGAL_ENTITY.platformUrl, href: LEGAL_ENTITY.platformUrl, external: true },
        " and through any related mobile application (“Platform”), and any of their related products and services (collectively, “Services”). This Policy is a legally binding agreement between you (“User”, “you” or “your”) and ",
        { text: LEGAL_ENTITY.name, bold: true },
        `, a company incorporated under the laws of India with Corporate Identification Number ${LEGAL_ENTITY.cin} and its registered office at ${LEGAL_ENTITY.addressInline}, which owns and operates Expendesk (“Expendesk”, “we”, “us” or “our”). If you are entering into this agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this agreement, you must not accept this agreement and may not access and use the Website and Services. You should read this Policy so you can understand the types of cookies we use, the information we collect using cookies, and how that information is used. It also describes the choices available to you regarding accepting or declining the use of cookies. For further information on how we use, store and keep your personal data secure, see our `,
        { text: "Privacy Policy", href: LEGAL_ROUTES.privacy },
        ".",
      ],
    },
  ],

  sections: [
    {
      id: "what-are-cookies",
      heading: "What are cookies?",
      blocks: [
        {
          type: "p",
          content: [
            "Cookies are small pieces of data stored in text files that are saved on your computer or other devices when websites are loaded in a browser. They are widely used to remember you and your preferences, either for a single visit, through a “session cookie”, or for multiple repeat visits, using a “persistent cookie”. In this Policy, we also use the term “cookies” to refer to similar technologies, such as local storage, pixels, tags and software development kits in our mobile applications.",
          ],
        },
        {
          type: "p",
          content: [
            "Session cookies are temporary cookies that are used during the course of your visit to the Website, and they expire when you close the web browser.",
          ],
        },
        {
          type: "p",
          content: [
            "Persistent cookies are used to remember your preferences within our Website and remain on your desktop or mobile device even after you close your browser or restart your computer. They ensure a consistent and efficient experience for you while visiting the Website and Services.",
          ],
        },
        {
          type: "p",
          content: [
            "Cookies may be set by the Website (“first-party cookies”), or by third parties, such as those who serve content or provide advertising or analytics services on the Website (“third-party cookies”). These third parties can recognize you when you visit our Website and also when you visit certain other websites.",
          ],
        },
      ],
    },

    {
      id: "types-of-cookies",
      heading: "What type of cookies do we use?",
      blocks: [
        { type: "h3", text: "Necessary cookies" },
        {
          type: "p",
          content: [
            "Necessary cookies allow us to offer you the best possible experience when accessing and navigating through our Website and using its features. For example, these cookies keep the Website secure, balance traffic across our servers, remember your cookie preferences, and let us recognize that you have signed in to your Platform account. Because the Website and Platform cannot function properly without them, these cookies cannot be switched off.",
          ],
        },

        { type: "h3", text: "Functionality cookies" },
        {
          type: "p",
          content: [
            "Functionality cookies let us operate the Website and Services in accordance with the choices you make. For example, we will recognize your username and remember how you customized the Website and Services during future visits. They also enable embedded tools on our Website, such as Expy AI, our website assistant, the demo booking calendar and our contact forms, which are provided by our chat, scheduling and customer relationship management service providers.",
          ],
        },

        { type: "h3", text: "Analytical cookies" },
        {
          type: "p",
          content: [
            "These cookies enable us and third-party services, such as Google Analytics deployed through Google Tag Manager, to collect aggregated data for statistical purposes on how our visitors use the Website. These cookies do not contain personal information such as names and email addresses and are used to help us improve your user experience of the Website.",
          ],
        },

        { type: "h3", text: "Advertising cookies" },
        {
          type: "p",
          content: [
            "Advertising cookies allow us and third parties, such as Google, LinkedIn and Meta, to serve relevant ads to you more effectively and help us collect aggregated audit data, research, and performance reporting for advertisers. They also enable us to understand and improve the delivery of ads to you and know when certain ads have been shown to you.",
          ],
        },
        {
          type: "p",
          content: [
            "Your web browser may request advertisements directly from ad network servers, and these networks can view, edit, or set their own cookies, just as if you had requested a web page from their website. Although we do not use cookies to create a profile of your browsing behavior on third-party websites, we do use aggregate data from third parties to show you relevant, interest-based advertising.",
          ],
        },

        { type: "h3", text: "Social media cookies" },
        {
          type: "p",
          content: [
            "Third-party cookies from social media sites, such as LinkedIn, Facebook, Instagram and YouTube, let us track social network users when they visit or use the Website and Services, share content, or view embedded content such as videos, by using a tagging mechanism provided by those social networks.",
          ],
        },
        {
          type: "p",
          content: [
            "These cookies are also used for event tracking and remarketing purposes. Any data collected with these tags will be used in accordance with our and the social networks’ privacy policies. We will not collect or share any personally identifiable information from the user through these cookies.",
          ],
        },
      ],
    },

    {
      id: "technologies-we-use",
      heading: "Cookies and similar technologies we use",
      blocks: [
        {
          type: "p",
          content: [
            "The table below summarizes the main categories of cookies and similar technologies that may be used on the Website and Platform. The specific cookies in use may change over time as we update our Services.",
          ],
        },
        {
          type: "table",
          caption:
            "Categories of cookies and similar technologies used on the Website and Platform",
          headers: ["Category", "Purpose", "Examples / providers", "Typical duration"],
          rows: [
            [
              "Necessary",
              "Security, load balancing, sign-in to the Platform and remembering your cookie choices",
              "Expendesk first-party cookies",
              "Session to 12 months",
            ],
            [
              "Functionality",
              "Remembering preferences and enabling Expy AI, demo booking and contact forms",
              "Expendesk; our chat, scheduling and CRM providers",
              "Session to 12 months",
            ],
            [
              "Analytics",
              "Understanding how visitors use the Website so that we can improve it",
              "Google Analytics via Google Tag Manager, such as _ga and _ga_*",
              "Up to 2 years",
            ],
            [
              "Advertising",
              "Measuring campaign performance and showing relevant ads on other platforms",
              "Google Ads, LinkedIn Insight Tag and Meta Pixel, used only when such campaigns are active",
              "Up to 12 months",
            ],
            [
              "Social media",
              "Enabling sharing, links to our official pages and embedded content such as videos",
              "LinkedIn, Facebook, Instagram, YouTube",
              "Set by each provider",
            ],
          ],
        },
      ],
    },

    {
      id: "your-consent",
      heading: "Your consent",
      blocks: [
        {
          type: "p",
          content: [
            "Where required by applicable law, including the Digital Personal Data Protection Act, 2023 and the EU and UK General Data Protection Regulation, we will ask for your consent before placing analytics, advertising or social media cookies on your device. You can withdraw or change your consent at any time using the cookie settings link on the Website or by adjusting your browser settings. Necessary cookies do not require consent because the Website and Platform cannot function without them.",
          ],
        },
      ],
    },

    {
      id: "web-beacons",
      heading: "Do we use web beacons or tracking pixels?",
      blocks: [
        {
          type: "p",
          content: [
            "Our emails may contain a “web beacon”, also known as a “tracking pixel”, to tell us whether our emails are opened and verify any clicks through to links or advertisements within the email.",
          ],
        },
        {
          type: "p",
          content: [
            "We may use this information for purposes including determining which of our emails are more interesting to users and to query whether users who do not open our emails wish to continue receiving them.",
          ],
        },
        {
          type: "p",
          content: [
            "The pixel will be deleted when you delete the email. If you do not wish the pixel to be downloaded to your device, you should read the email in plain text view or with images disabled. Our Website may also use tracking pixels provided by our analytics and advertising partners, as described in this Policy.",
          ],
        },
      ],
    },

    {
      id: "cookie-options",
      heading: "What are your cookie options?",
      blocks: [
        {
          type: "p",
          content: [
            "If you don’t like the idea of cookies or certain types of cookies, you can change your browser’s settings to delete cookies that have already been set and to not accept new cookies. To learn more about how to do this, visit the help pages of your browser, such as ",
            { text: "Google Chrome", href: BROWSER_HELP.chrome, external: true },
            ", ",
            { text: "Mozilla Firefox", href: BROWSER_HELP.firefox, external: true },
            " and ",
            { text: "Apple Safari", href: BROWSER_HELP.safari, external: true },
            ", or the privacy settings of Microsoft Edge. You can also opt out of Google Analytics by installing the ",
            {
              text: "Google Analytics opt-out browser add-on",
              href: BROWSER_HELP.gaOptOut,
              external: true,
            },
            ".",
          ],
        },
        {
          type: "p",
          content: [
            "Please note that if you block necessary cookies, some parts of the Website may not work properly and you may not be able to sign in to the Platform.",
          ],
        },
      ],
    },

    {
      id: "changes-and-amendments",
      heading: "Changes and amendments",
      blocks: [
        {
          type: "p",
          content: [
            "We reserve the right to modify this Policy or its terms related to the Website and Services at any time at our discretion. When we do, we will revise the updated date at the bottom of this page. We may also provide notice to you in other ways at our discretion, such as through the contact information you have provided.",
          ],
        },
        {
          type: "p",
          content: [
            "An updated version of this Policy will be effective immediately upon the posting of the revised Policy unless otherwise specified. Your continued use of the Website and Services after the effective date of the revised Policy, or such other act specified at that time, will constitute your consent to those changes.",
          ],
        },
      ],
    },

    {
      id: "acceptance",
      heading: "Acceptance of this policy",
      blocks: [
        {
          type: "p",
          content: [
            "You acknowledge that you have read this Policy and agree to all its terms and conditions. By accessing and using the Website and Services you agree to be bound by this Policy. If you do not agree to abide by the terms of this Policy, you are not authorized to access or use the Website and Services.",
          ],
        },
      ],
    },
  ],

  contact: legalContact(
    "If you have any questions, concerns, or complaints regarding this Policy or the use of cookies, we encourage you to contact us using the details below:"
  ),
};
