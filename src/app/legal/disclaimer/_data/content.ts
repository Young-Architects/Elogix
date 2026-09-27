/**
 * Disclaimer copy for /legal/disclaimer.
 *
 * Transcribed verbatim from Expendesk_Disclaimer.pdf (last updated
 * 21 September 2026). Wording is unedited; only the PDF's running header and
 * footer were dropped. Entity details come from ../../_data/company.ts.
 *
 * Note: this is the document the footer's "Legal Notice" link was always
 * pointing at in spirit — there is no separate "legal notice" document, and the
 * footer now links this one by its real name.
 */
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED, legalContact } from "../../_data/company";
import type { LegalDocument } from "../../_data/types";

export const disclaimer: LegalDocument = {
  eyebrow: "Legal",
  title: "Disclaimer",
  lastUpdated: LEGAL_LAST_UPDATED,

  intro: [
    {
      type: "p",
      content: [
        "This disclaimer (“Disclaimer”) sets forth the general guidelines, disclosures, and terms of your use of the ",
        { text: LEGAL_ENTITY.websiteUrl, href: `${LEGAL_ENTITY.websiteUrl}/`, external: true },
        " website (“Website”), the Expendesk expense and reimbursement management platform available at ",
        { text: LEGAL_ENTITY.platformUrl, href: LEGAL_ENTITY.platformUrl, external: true },
        " and through any related mobile application (“Platform”), and any of their related products and services (collectively, “Services”). This Disclaimer is a legally binding agreement between you (“User”, “you” or “your”) and ",
        { text: LEGAL_ENTITY.name, bold: true },
        `, a company incorporated under the laws of India with Corporate Identification Number ${LEGAL_ENTITY.cin} and its registered office at ${LEGAL_ENTITY.addressInline}, which owns and operates Expendesk (“Expendesk”, “we”, “us” or “our”). If you are entering into this agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this agreement, you must not accept this agreement and may not access and use the Website and Services. By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Disclaimer. You acknowledge that this Disclaimer is a contract between you and Expendesk, even though it is electronic and is not physically signed by you, and it governs your use of the Website and Services.`,
      ],
    },
  ],

  sections: [
    {
      id: "general-information",
      heading: "General information",
      blocks: [
        {
          type: "p",
          content: [
            "The Website, including our blogs, guides, whitepapers, case studies, industry and solution pages, product tours and other resources, is provided for general information and marketing purposes only. While we make reasonable efforts to keep this information accurate and up to date, it may not reflect the latest product features, pricing, or legal and regulatory developments.",
          ],
        },
      ],
    },

    {
      id: "representation",
      heading: "Representation",
      blocks: [
        {
          type: "p",
          content: [
            "Any views or opinions represented on the Website belong solely to the content creators and do not represent those of people, institutions, or organizations that Expendesk or creators may or may not be associated with in professional or personal capacity unless explicitly stated. Any views or opinions are not intended to malign any religion, ethnic group, club, organization, company, or individual.",
          ],
        },
      ],
    },

    {
      id: "content-and-postings",
      heading: "Content and postings",
      blocks: [
        {
          type: "p",
          content: [
            "Except for your personal, non-commercial reference, including downloading our guides and whitepapers for internal use within your organization, you may not modify, reproduce, republish, distribute or commercially exploit any part of the Website and Services. Inclusion of any part of the Website and Services in another work, whether in printed or electronic or another form, or inclusion of any part of the Website and Services on another resource by embedding, framing, or otherwise without the express written permission of Expendesk is prohibited.",
          ],
        },
        {
          type: "p",
          content: [
            "If you submit feedback, suggestions, reviews or other information to us through the Website, you grant Expendesk a non-exclusive, perpetual, royalty-free right to use it to operate and improve our Services and, with your consent where required, to publish it. You may not impersonate any other person through the Website and Services. You may not post content that is defamatory, fraudulent, obscene, threatening, invasive of another person’s privacy rights or that is otherwise unlawful. You may not post content that infringes on the intellectual property rights of any other person or entity. You may not post any content that includes any computer virus or other code designed to disrupt, damage, or limit the functioning of any computer software or hardware.",
          ],
        },
      ],
    },

    {
      id: "product-information",
      heading: "Product information, statistics and performance figures",
      blocks: [
        {
          type: "p",
          content: [
            "Product descriptions, screenshots, dashboards, sample data and demonstrations on the Website are illustrative and may differ from the Platform available to you, depending on your plan, configuration and the features enabled for your organization. Some features described on the Website may be available only on certain plans, may require separate setup, or may be under development.",
          ],
        },
        {
          type: "p",
          content: [
            "Statistics and performance figures on the Website, such as percentage improvements in reimbursement time, approval time, month-end closure, audit speed, policy compliance or spend visibility, are indicative. They may be based on internal analysis, typical deployment scenarios, industry research or individual customer experiences, and are not guarantees of the results your organization will achieve. Actual results depend on factors such as your processes, policies, data quality, user adoption and integrations.",
          ],
        },
        {
          type: "p",
          content: [
            "Pricing shown on the Website is indicative and subject to change. Your final pricing, plan and terms will be set out in your quotation or subscription agreement with us.",
          ],
        },
      ],
    },

    {
      id: "ai-generated-information",
      heading: "AI-generated information",
      blocks: [
        {
          type: "p",
          content: [
            "Expy AI, the assistant on our Website, and the AI-assisted features of the Platform, such as receipt data extraction, expense categorization and policy checks, generate responses automatically and can make mistakes. Information provided by Expy AI is for general guidance only and does not constitute a binding offer, quotation, commitment or advice. Please verify important details, including pricing, features and contractual terms, with our team before relying on them.",
          ],
        },
      ],
    },

    {
      id: "not-professional-advice",
      heading: "Not tax, accounting or legal advice",
      blocks: [
        {
          type: "p",
          content: [
            "Expendesk is a software tool that helps organizations manage expenses, approvals and reimbursements. The information on the Website, and the configurations, reports and outputs of the Services, are provided for your convenience only and are not intended to be treated as legal, tax, accounting, audit, financial, investment or regulatory advice. In particular, information about expense policies, goods and services tax, income tax, statutory record-keeping, and industry-specific codes or regulations, such as codes governing pharmaceutical marketing practices, is general in nature and does not address the circumstances of any particular individual or organization.",
          ],
        },
        {
          type: "p",
          content: [
            "You should not act, or refrain from acting, based solely upon the information provided on the Website without first seeking appropriate advice from a qualified professional, such as a chartered accountant, tax advisor or lawyer. You should never delay seeking professional advice, disregard professional advice, or commence or discontinue any legal action because of the information on the Website. Nothing contained on the Website constitutes a solicitation, recommendation, endorsement, or offer by Expendesk, its agents, employees, contractors, and any affiliated companies to buy or sell any securities or other financial instruments.",
          ],
        },
        {
          type: "p",
          content: [
            "You alone assume the sole responsibility of evaluating the merits and risks associated with the use of any information or other content on the Website before making any decisions based on such information, and you remain solely responsible for your organization’s financial decisions, expense policies and statutory compliance. You agree not to hold Expendesk, its agents, employees, contractors, and any affiliated companies liable for any possible claim for damages arising from any decision you make based on the information made available to you through the Website.",
          ],
        },
      ],
    },

    {
      id: "testimonials",
      heading: "Reviews, testimonials and case studies",
      blocks: [
        {
          type: "p",
          content: [
            "Testimonials and case studies are received in various forms through a variety of submission methods. They reflect the individual experiences of customers who have used the Website and Services in some way or another. However, they are individual results and results do vary. We do not claim that they are typical results that customers will generally achieve. The testimonials are not necessarily representative of all of those who will use the Website and Services, and Expendesk is not responsible for the opinions or comments available on the Website, and does not necessarily share them. All opinions expressed are strictly the views of the reviewers.",
          ],
        },
        {
          type: "p",
          content: [
            "Testimonials may have been edited for clarity or length, or shortened where the original included information of no relevance to the general public. Where a customer has requested confidentiality, certain identifying details may be withheld.",
          ],
        },
      ],
    },

    {
      id: "third-party-links",
      heading: "Third-party links, logos and integrations",
      blocks: [
        {
          type: "p",
          content: [
            "The Website may contain links to third-party websites and references to third-party products, including accounting, ERP and other software that the Platform can integrate with. Such references are for information only and do not imply any endorsement, sponsorship or affiliation unless expressly stated. All third-party trademarks and logos belong to their respective owners. We are not responsible for the content, availability or practices of any third-party website or service.",
          ],
        },
      ],
    },

    {
      id: "indemnification-and-warranties",
      heading: "Indemnification and warranties",
      blocks: [
        {
          type: "p",
          content: [
            "While we have made every attempt to ensure that the information contained on the Website is correct, Expendesk is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information on the Website is provided “as is”, with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied. In no event will Expendesk, or its partners, employees or agents, be liable to you or anyone else for any decision made or action taken in reliance on the information on the Website, or for any consequential, special or similar damages, even if advised of the possibility of such damages.",
          ],
        },
        {
          type: "p",
          content: [
            "Furthermore, the benefits you obtain from the Services will depend on your organization’s processes, policies, data, user adoption and other factors. There are no guarantees concerning the level of cost savings, efficiency gains or other outcomes you may achieve. The use of the information available on the Website should be based on your own due diligence, and you agree that Expendesk is not liable for any success or failure of your business that is directly or indirectly related to the purchase and use of our information, products, and services. Information contained on the Website is subject to change at any time and without warning.",
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
            "We reserve the right to modify this Disclaimer or its terms related to the Website and Services at any time at our discretion. When we do, we will revise the updated date at the bottom of this page. We may also provide notice to you in other ways at our discretion, such as through the contact information you have provided.",
          ],
        },
        {
          type: "p",
          content: [
            "An updated version of this Disclaimer will be effective immediately upon the posting of the revised Disclaimer unless otherwise specified. Your continued use of the Website and Services after the effective date of the revised Disclaimer, or such other act specified at that time, will constitute your consent to those changes.",
          ],
        },
      ],
    },

    {
      id: "acceptance",
      heading: "Acceptance of this disclaimer",
      blocks: [
        {
          type: "p",
          content: [
            "You acknowledge that you have read this Disclaimer and agree to all its terms and conditions. By accessing and using the Website and Services you agree to be bound by this Disclaimer. If you do not agree to abide by the terms of this Disclaimer, you are not authorized to access or use the Website and Services.",
          ],
        },
      ],
    },
  ],

  contact: legalContact(
    "If you have any questions, concerns, or complaints regarding this Disclaimer, we encourage you to contact us using the details below:"
  ),
};
