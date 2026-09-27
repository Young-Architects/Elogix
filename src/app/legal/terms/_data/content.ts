/**
 * Terms and Conditions copy for /legal/terms.
 *
 * Transcribed verbatim from Expendesk_Terms_and_Conditions.pdf (last updated
 * 21 September 2026). Wording is unedited; only the PDF's running header and
 * footer were dropped. Entity details and cross-document links come from
 * ../../_data/company.ts.
 *
 * This Agreement incorporates the Privacy Policy, Cookie Policy and Acceptable
 * Use Policy by reference and also points at the Disclaimer and the Pricing
 * page. Every one of those links is routed through LEGAL_ROUTES or a real
 * site path — a legal document citing a 404 is worse than one citing nothing.
 */
import {
  GRIEVANCE_OFFICER,
  LEGAL_ENTITY,
  LEGAL_LAST_UPDATED,
  LEGAL_ROUTES,
  legalContact,
} from "../../_data/company";
import type { LegalDocument } from "../../_data/types";

const MAILTO = `mailto:${LEGAL_ENTITY.email}`;

export const termsAndConditions: LegalDocument = {
  eyebrow: "Legal",
  title: "Terms and Conditions",
  lastUpdated: LEGAL_LAST_UPDATED,

  intro: [
    {
      type: "p",
      content: [
        "These terms and conditions (“Agreement”) set forth the general terms and conditions of your use of the ",
        { text: LEGAL_ENTITY.websiteUrl, href: `${LEGAL_ENTITY.websiteUrl}/`, external: true },
        " website (“Website”), the Expendesk expense and reimbursement management platform available at ",
        { text: LEGAL_ENTITY.platformUrl, href: LEGAL_ENTITY.platformUrl, external: true },
        " and through any related mobile application (“Platform”), and any of their related products and services (collectively, “Services”). This Agreement is legally binding between you (“User”, “you” or “your”) and ",
        { text: LEGAL_ENTITY.name, bold: true },
        `, a company incorporated under the laws of India with Corporate Identification Number ${LEGAL_ENTITY.cin} and its registered office at ${LEGAL_ENTITY.addressInline}, which owns and operates Expendesk (“Expendesk”, “we”, “us” or “our”). If you are entering into this agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this agreement, you must not accept this agreement and may not access and use the Website and Services. By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. You acknowledge that this Agreement is a contract between you and Expendesk, even though it is electronic and is not physically signed by you, and it governs your use of the Website and Services. This Agreement is an electronic record under the Information Technology Act, 2000 and does not require any physical or digital signature.`,
      ],
    },
    {
      type: "p",
      content: [
        "Where your organization has signed an order form, quotation, proposal or subscription agreement with us (“Order Form”), that Order Form forms part of this Agreement and, in case of any conflict, the Order Form will prevail. Your use of the Services is also governed by our ",
        { text: "Privacy Policy", href: LEGAL_ROUTES.privacy },
        ", ",
        { text: "Cookie Policy", href: LEGAL_ROUTES.cookies },
        " and ",
        { text: "Acceptable Use Policy", href: LEGAL_ROUTES.acceptableUse },
        ", which are incorporated into this Agreement by reference.",
      ],
    },
  ],

  sections: [
    {
      id: "eligibility",
      heading: "Eligibility and business use",
      blocks: [
        {
          type: "p",
          content: [
            "The Services are intended for businesses and professional use. You must be at least 18 years old and competent to enter into a contract under the Indian Contract Act, 1872 to use the Services. If you use the Services on behalf of an organization (“Customer”), the Customer is responsible for ensuring that its employees and other individuals it authorizes to use the Platform (“Authorized Users”) comply with this Agreement.",
          ],
        },
      ],
    },

    {
      id: "accounts",
      heading: "Accounts and membership",
      blocks: [
        {
          type: "p",
          content: [
            "Platform accounts are created by a Customer’s administrator or by us on the Customer’s instructions. If you create or are given an account, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. We may, but have no obligation to, monitor and review new accounts before you may sign in and start using the Services. Providing false contact information of any kind may result in the termination of your account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security. We will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result of such acts or omissions.",
          ],
        },
        {
          type: "p",
          content: [
            "Customer administrators are responsible for managing the roles, permissions, approval hierarchies and expense policies configured in the Platform, and for promptly deactivating Authorized Users who should no longer have access. We may suspend, disable, or delete your account, or any part of it, if we determine that you have violated any provision of this Agreement or that your conduct or content would tend to damage our reputation and goodwill. If we delete your account for the foregoing reasons, you may not re-register for our Services. We may block your email address and Internet protocol address to prevent further registration.",
          ],
        },
      ],
    },

    {
      id: "trials-and-demos",
      heading: "Free trials and demos",
      blocks: [
        {
          type: "p",
          content: [
            "We may offer free product demos or a free trial of the Platform for a limited period. Certain features may not be available during a trial. At the end of a trial, you may need to purchase a subscription to continue using the Services, and data entered during a trial may be deleted if you do not subscribe within the period we communicate to you. Trials and demos are provided “as is”, without any warranty or service level commitment, and we may modify or end a trial at any time.",
          ],
        },
      ],
    },

    {
      id: "billing",
      heading: "Subscriptions, billing and payments",
      blocks: [
        {
          type: "p",
          content: [
            "Subscription plans, pricing, the number of users and the billing cycle are set out on our ",
            { text: "Pricing", href: "/pricing" },
            " page or in your Order Form. Prices displayed on the Website are indicative and may be customized based on your organization’s size, number of users and required features. Unless otherwise agreed in writing, fees are quoted and payable in Indian Rupees, are billed in advance on an annual basis, and are exclusive of goods and services tax and other applicable taxes, which will be charged additionally.",
          ],
        },
        {
          type: "p",
          content: [
            "You shall pay all invoices in accordance with the payment terms stated in the invoice or Order Form and, if none are stated, within 15 days of the invoice date. If any undisputed amount remains unpaid after its due date, we may, after giving you reasonable notice, suspend access to the Services until payment is received. Unless either party gives notice of non-renewal at least 30 days before the end of the current subscription term, your subscription will renew automatically for a further term of the same length at our then-current pricing, which we will communicate to you in advance.",
          ],
        },
        {
          type: "p",
          content: [
            "Where you pay online, payments are processed by third-party payment gateways over secure, encrypted connections. We reserve the right to change products and pricing at any time; price changes will not affect a subscription term that has already been paid for. We also reserve the right to refuse or cancel any order, for example where we suspect fraudulent or unauthorized activity. In the event that we make a change to or cancel an order, we will attempt to notify you by contacting the email and/or billing address/phone number provided at the time the order was made.",
          ],
        },
      ],
    },

    {
      id: "cancellation",
      heading: "Cancellation and refunds",
      blocks: [
        {
          type: "p",
          content: [
            "You may cancel your subscription at any time by notifying us in writing at ",
            { text: LEGAL_ENTITY.email, href: MAILTO },
            ". Cancellation will take effect at the end of your current paid subscription term, and you will continue to have access to the Services until then. Unless otherwise stated in your Order Form or required by applicable law, fees paid are non-refundable, and no refunds or credits will be issued for partial subscription periods, unused user licenses or downgrades. If you believe you have been charged in error, please contact us within 30 days of the charge.",
          ],
        },
      ],
    },

    {
      id: "customer-data",
      heading: "Customer data and user content",
      blocks: [
        {
          type: "p",
          content: [
            "We do not own any data, information, or material, including expense records, receipts and documents (collectively, “Content”), that you or your Authorized Users submit to the Platform. As between you and us, the Customer retains all rights in its Content. You shall have sole responsibility for the accuracy, quality, integrity, legality, reliability, appropriateness, and intellectual property ownership or right to use of all submitted Content.",
          ],
        },
        {
          type: "p",
          content: [
            "You grant us a limited, non-exclusive license to access, copy, store, transmit, reformat, display, and process the Content solely as required for the purpose of providing, securing, supporting and improving the Services for you. We may generate aggregated and de-identified data from the use of the Services, such as usage statistics and performance metrics, that does not identify you, any individual or your organization, and we may use such data to operate, analyze and improve our Services. We will not use your Content for marketing purposes or disclose it publicly without your prior written consent.",
          ],
        },
        {
          type: "p",
          content: [
            "We may, but have no obligation to, monitor and review the Content submitted or created using our Services. We have the right, though not the obligation, to, in our own sole discretion, refuse or remove any Content that, in our reasonable opinion, violates any of our policies or is in any way harmful or objectionable.",
          ],
        },
      ],
    },

    {
      id: "data-protection",
      heading: "Data protection",
      blocks: [
        {
          type: "p",
          content: [
            "We process Personal Information in accordance with our ",
            { text: "Privacy Policy", href: LEGAL_ROUTES.privacy },
            ". For Content containing personal data of the Customer’s Authorized Users or other individuals, the Customer is the Data Fiduciary and we act as its Data Processor under the Digital Personal Data Protection Act, 2023. The Customer is responsible for giving any notices to, and obtaining any consents from, its Authorized Users that are required for their use of the Platform, including for features such as location-based travel or conveyance tracking. A data processing agreement is available to Customers on request.",
          ],
        },
      ],
    },

    {
      id: "availability",
      heading: "Service availability and support",
      blocks: [
        {
          type: "p",
          content: [
            "We aim to keep the Services available at all times, but we do not guarantee uninterrupted or error-free operation. The Services may be temporarily unavailable due to scheduled maintenance, updates, or events beyond our reasonable control, and we will try to give advance notice of planned maintenance. Support is provided through the channels described in your plan or Order Form, and any service level commitments apply only if they are expressly set out in an Order Form. We may modify, update or discontinue features of the Services from time to time, provided that we will not materially reduce the core functionality of a paid subscription during its current term.",
          ],
        },
      ],
    },

    {
      id: "ai-features",
      heading: "AI-assisted features",
      blocks: [
        {
          type: "p",
          content: [
            "The Services include features powered by artificial intelligence and automation, such as receipt data extraction, expense categorization, policy checks, anomaly flags and our Expy AI assistant. These features are designed to assist, not replace, human judgment. AI-generated outputs may be incomplete or inaccurate, and you are responsible for reviewing them before relying on them, including before approving, rejecting or reimbursing any claim.",
          ],
        },
      ],
    },

    {
      id: "accuracy",
      heading: "Accuracy of information",
      blocks: [
        {
          type: "p",
          content: [
            "Occasionally there may be information on the Website that contains typographical errors, inaccuracies, or omissions that may relate to product descriptions, pricing, promotions and offers. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information or cancel orders if any information on the Website or Services is inaccurate at any time without prior notice, including after you have submitted your order. We undertake no obligation to update, amend or clarify information on the Website including, without limitation, pricing information, except as required by law. No specified update or refresh date applied on the Website should be taken to indicate that all information on the Website or Services has been modified or updated.",
          ],
        },
      ],
    },

    {
      id: "third-party-services",
      heading: "Third-party services and integrations",
      blocks: [
        {
          type: "p",
          content: [
            "The Services may allow you to enable, access or integrate third-party services, such as accounting, ERP, payroll, cloud storage, email or calendar applications (“Third-Party Services”). If you decide to enable, access, or use Third-Party Services, be advised that your access and use of such services are governed solely by the terms and conditions of those services, and we do not endorse, are not responsible or liable for, and make no representations as to any aspect of such services, including, without limitation, their content or the manner in which they handle data, including your data, or any interaction between you and the provider of such services.",
          ],
        },
        {
          type: "p",
          content: [
            "You irrevocably waive any claim against Expendesk with respect to such Third-Party Services. Expendesk is not liable for any damage or loss caused or alleged to be caused by or in connection with your enablement, access, or use of any such services, or your reliance on the privacy practices, data security processes, or other policies of such services. You may be required to register for or log into such services on their respective platforms. By enabling any Third-Party Services, you are expressly permitting Expendesk to disclose your data as necessary to facilitate the use or enablement of such services.",
          ],
        },
      ],
    },

    {
      id: "backups",
      heading: "Backups and data export",
      blocks: [
        {
          type: "p",
          content: [
            "We maintain regular backups of the Platform as part of our operational practices. However, we do not guarantee that any lost or deleted Content can be restored, and it is your responsibility to maintain your own copies of any records that you are required to keep under applicable tax, accounting or other laws. You may export your Content using the export features available in the Platform or by contacting us. Following the termination or expiry of your subscription, we will make your Content available for export for 30 days, after which it will be deleted in accordance with our ",
            { text: "Privacy Policy", href: LEGAL_ROUTES.privacy },
            ".",
          ],
        },
      ],
    },

    {
      id: "links-to-other-resources",
      heading: "Links to other resources",
      blocks: [
        {
          type: "p",
          content: [
            "Although the Website and Services may link to other resources, such as websites and mobile applications, we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked resource, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their resources. We do not assume any responsibility or liability for the actions, products, services, and content of any other third parties. You should carefully review the legal statements and other conditions of use of any resource which you access through a link on the Website. Your linking to any other off-site resources is at your own risk.",
          ],
        },
      ],
    },

    {
      id: "prohibited-uses",
      heading: "Prohibited uses",
      blocks: [
        {
          type: "p",
          content: [
            "In addition to other terms as set forth in the Agreement and our ",
            { text: "Acceptable Use Policy", href: LEGAL_ROUTES.acceptableUse },
            ", you are prohibited from using the Website and Services or Content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, national, state or local regulations, rules or laws; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information, including fraudulent, falsified or inflated expense claims, receipts or invoices; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Website and Services, third-party products and services, or the Internet; (h) to spam, phish, pharm, pretext, spider, crawl, or scrape; (i) for any obscene or immoral purpose; (j) to interfere with or circumvent the security features of the Website and Services, third-party products and services, or the Internet; (k) to reverse engineer, decompile, copy, resell, sublicense or build a competing product from the Services; or (l) to access the Services through automated means other than the interfaces we make available. We reserve the right to terminate your use of the Website and Services for violating any of the prohibited uses.",
          ],
        },
      ],
    },

    {
      id: "intellectual-property",
      heading: "Intellectual property rights",
      blocks: [
        {
          type: "p",
          content: [
            "“Intellectual Property Rights” means all present and future rights conferred by statute, common law or equity in or in relation to any copyright and related rights, trademarks, designs, patents, inventions, goodwill and the right to sue for passing off, rights to inventions, rights to use, and all other intellectual property rights, in each case whether registered or unregistered and including all applications and rights to apply for and be granted, rights to claim priority from, such rights and all similar or equivalent rights or forms of protection and any other results of intellectual activity which subsist or will subsist now or in the future in any part of the world. This Agreement does not transfer to you any intellectual property owned by Expendesk or third parties, and all rights, titles, and interests in and to such property, including the Expendesk software, Platform, Website, documentation and brand, will remain, as between the parties, solely with ",
            LEGAL_ENTITY.name,
            ". All trademarks, service marks, graphics, and logos used in connection with the Website and Services are trademarks or registered trademarks of ",
            LEGAL_ENTITY.name,
            " or its licensors. Other trademarks, service marks, graphics, and logos used in connection with the Website and Services may be the trademarks of other third parties. Your use of the Website and Services grants you no right or license to reproduce or otherwise use any of Expendesk’s or third-party trademarks. If you give us feedback or suggestions about the Services, we may use them without any obligation to you.",
          ],
        },
      ],
    },

    {
      id: "confidentiality",
      heading: "Confidentiality",
      blocks: [
        {
          type: "p",
          content: [
            "Each party may receive non-public business, technical or financial information from the other in connection with the Services (“Confidential Information”). Each party will protect the other’s Confidential Information with at least reasonable care, use it only to perform its obligations or exercise its rights under this Agreement, and not disclose it to anyone except its employees, contractors and advisors who need to know it and are bound by confidentiality obligations, or as required by law. The Customer’s Content is the Customer’s Confidential Information.",
          ],
        },
      ],
    },

    {
      id: "disclaimer-of-warranties",
      heading: "Disclaimer of warranties",
      blocks: [
        {
          type: "p",
          content: [
            "Except as expressly stated in this Agreement or an Order Form, the Website and Services are provided on an “as is” and “as available” basis, and we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement. The Services are tools for managing expenses and do not constitute tax, accounting, legal or financial advice. You remain responsible for your organization’s financial decisions, expense policies and statutory compliance, including goods and services tax and income tax compliance. Please also read our ",
            { text: "Disclaimer", href: LEGAL_ROUTES.disclaimer },
            ".",
          ],
        },
      ],
    },

    {
      id: "limitation-of-liability",
      heading: "Limitation of liability",
      blocks: [
        {
          type: "p",
          content: [
            "To the fullest extent permitted by applicable law, in no event will Expendesk, its affiliates, directors, officers, employees, agents, suppliers, or licensors be liable to any person for any indirect, incidental, special, punitive, cover or consequential damages, including, without limitation, damages for lost profits, revenue, sales, goodwill, use of the content, impact on business, business interruption, loss of anticipated savings or loss of business opportunity, however caused, under any theory of liability, including, without limitation, contract, tort, warranty, breach of statutory duty, negligence or otherwise, even if the liable party has been advised as to the possibility of such damages or could have foreseen such damages. To the maximum extent permitted by applicable law, the aggregate liability of Expendesk and its affiliates, officers, employees, agents, suppliers, and licensors relating to the Services will be limited to the total fees actually paid by you to Expendesk for the Services during the 12 months immediately preceding the first event or occurrence giving rise to such liability, and, for free trials, demos and other free Services, will not exceed INR 1,000. The limitations and exclusions also apply if this remedy does not fully compensate you for any losses or fails of its essential purpose.",
          ],
        },
      ],
    },

    {
      id: "indemnification",
      heading: "Indemnification",
      blocks: [
        {
          type: "p",
          content: [
            "You agree to indemnify and hold Expendesk and its affiliates, directors, officers, employees, agents, suppliers, and licensors harmless from and against any liabilities, losses, damages, or costs, including reasonable attorneys’ fees, incurred in connection with or arising from any third-party allegations, claims, actions, disputes, or demands asserted against any of them as a result of or relating to your Content, your use of the Website and Services, your breach of this Agreement or applicable law, or any willful misconduct on your part.",
          ],
        },
      ],
    },

    {
      id: "suspension-and-termination",
      heading: "Suspension and termination",
      blocks: [
        {
          type: "p",
          content: [
            "You may stop using the Services at any time, subject to the cancellation terms above. We may suspend or terminate your access to the Services, in whole or in part, with notice where practicable, if you breach this Agreement or our policies, fail to pay fees when due, or if your use poses a security, legal or reputational risk to us or to other Users. Upon termination, your right to use the Services will end, and the provisions of this Agreement that by their nature should survive termination will survive, including those relating to fees owed, intellectual property, confidentiality, disclaimers, limitation of liability, indemnification and dispute resolution.",
          ],
        },
      ],
    },

    {
      id: "force-majeure",
      heading: "Force majeure",
      blocks: [
        {
          type: "p",
          content: [
            "We will not be liable for any delay or failure to perform caused by events beyond our reasonable control, including natural disasters, epidemics, war, terrorism, civil unrest, government actions, power or Internet failures, cyber-attacks, or failures of third-party hosting or telecommunication providers.",
          ],
        },
      ],
    },

    {
      id: "severability",
      heading: "Severability",
      blocks: [
        {
          type: "p",
          content: [
            "All rights and restrictions contained in this Agreement may be exercised and shall be applicable and binding only to the extent that they do not violate any applicable laws and are intended to be limited to the extent necessary so that they will not render this Agreement illegal, invalid or unenforceable. If any provision or portion of any provision of this Agreement shall be held to be illegal, invalid, or unenforceable by a court of competent jurisdiction, it is the intention of the parties that the remaining provisions or portions thereof shall constitute their agreement with respect to the subject matter hereof, and all such remaining provisions or portions thereof shall remain in full force and effect.",
          ],
        },
      ],
    },

    {
      id: "dispute-resolution",
      heading: "Dispute resolution",
      blocks: [
        {
          type: "p",
          content: [
            "The formation, interpretation, and performance of this Agreement and any disputes arising out of it shall be governed by the substantive and procedural laws of India, without regard to its rules on conflicts or choice of law.",
          ],
        },
        {
          type: "p",
          content: [
            "The parties will first attempt to resolve any dispute amicably through good-faith discussions for a period of 30 days after written notice of the dispute. If the dispute is not resolved within that period, it shall be referred to and finally resolved by arbitration by a sole arbitrator appointed in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Kolkata, West Bengal, India, and the arbitration shall be conducted in English.",
          ],
        },
        {
          type: "p",
          content: [
            "Subject to the foregoing, the courts located in Kolkata, West Bengal, India shall have exclusive jurisdiction over all matters arising out of or relating to this Agreement, and you hereby submit to the personal jurisdiction of such courts. Nothing in this section prevents either party from seeking urgent interim relief from a court of competent jurisdiction.",
          ],
        },
      ],
    },

    {
      id: "miscellaneous",
      heading: "Miscellaneous",
      blocks: [
        {
          type: "p",
          content: [
            "You may not assign or transfer this Agreement without our prior written consent. We may assign this Agreement to an affiliate or in connection with a merger, acquisition or sale of all or substantially all of our assets. This Agreement, together with any Order Form and the policies referred to in it, constitutes the entire agreement between you and us regarding the Services. Our failure to enforce any right or provision will not be considered a waiver of that right. Notices to us must be sent to ",
            { text: LEGAL_ENTITY.email, href: MAILTO },
            " or to our registered office address.",
          ],
        },
      ],
    },

    {
      id: "grievance-redressal",
      heading: "Grievance redressal",
      blocks: [
        {
          type: "p",
          content: [
            `In accordance with the Information Technology Act, 2000 and the rules made under it, you may contact our Grievance Officer, ${GRIEVANCE_OFFICER.name}, Director, at `,
            { text: LEGAL_ENTITY.email, href: MAILTO },
            ` with the subject line “${GRIEVANCE_OFFICER.emailSubject}”, or by post at our registered office address, with any complaint relating to the Website or Services. We will acknowledge complaints within 24 hours and endeavor to resolve them within 15 days of receipt.`,
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
            "We reserve the right to modify this Agreement or its terms related to the Website and Services at any time at our discretion. When we do, we will revise the updated date at the bottom of this page. We may also provide notice to you in other ways at our discretion, such as through the contact information you have provided.",
          ],
        },
        {
          type: "p",
          content: [
            "An updated version of this Agreement will be effective immediately upon the posting of the revised Agreement unless otherwise specified. Your continued use of the Website and Services after the effective date of the revised Agreement, or such other act specified at that time, will constitute your consent to those changes. For material changes that affect paid subscriptions, we will give Customers at least 30 days’ prior notice by email or through the Platform.",
          ],
        },
      ],
    },

    {
      id: "acceptance",
      heading: "Acceptance of these terms",
      blocks: [
        {
          type: "p",
          content: [
            "You acknowledge that you have read this Agreement and agree to all its terms and conditions. By accessing and using the Website and Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to access or use the Website and Services.",
          ],
        },
      ],
    },
  ],

  contact: legalContact(
    "If you have any questions, concerns, or complaints regarding this Agreement, we encourage you to contact us using the details below:"
  ),
};
