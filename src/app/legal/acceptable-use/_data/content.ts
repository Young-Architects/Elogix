/**
 * Acceptable Use Policy copy for /legal/acceptable-use.
 *
 * Transcribed verbatim from Expendesk_Acceptable_Use_Policy.pdf (last updated
 * 21 September 2026). Wording is unedited; only the PDF's running header and
 * footer were dropped. Entity details and cross-document links come from
 * ../../_data/company.ts.
 *
 * This Policy forms part of the Terms and Conditions and points at the
 * Copyright and DMCA Policy — both links resolve through LEGAL_ROUTES.
 */
import {
  LEGAL_ENTITY,
  LEGAL_LAST_UPDATED,
  LEGAL_ROUTES,
  legalContact,
} from "../../_data/company";
import type { LegalDocument } from "../../_data/types";

export const acceptableUsePolicy: LegalDocument = {
  eyebrow: "Legal",
  title: "Acceptable Use Policy",
  lastUpdated: LEGAL_LAST_UPDATED,

  intro: [
    {
      type: "p",
      content: [
        "This acceptable use policy (“Policy”) sets forth the general guidelines and acceptable and prohibited uses of the ",
        { text: LEGAL_ENTITY.websiteUrl, href: `${LEGAL_ENTITY.websiteUrl}/`, external: true },
        " website (“Website”), the Expendesk expense and reimbursement management platform available at ",
        { text: LEGAL_ENTITY.platformUrl, href: LEGAL_ENTITY.platformUrl, external: true },
        " and through any related mobile application (“Platform”), and any of their related products and services (collectively, “Services”). This Policy is a legally binding agreement between you (“User”, “you” or “your”) and ",
        { text: LEGAL_ENTITY.name, bold: true },
        `, a company incorporated under the laws of India with Corporate Identification Number ${LEGAL_ENTITY.cin} and its registered office at ${LEGAL_ENTITY.addressInline}, which owns and operates Expendesk (“Expendesk”, “we”, “us” or “our”). If you are entering into this agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this agreement, you must not accept this agreement and may not access and use the Website and Services. By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Policy. You acknowledge that this Policy is a contract between you and Expendesk, even though it is electronic and is not physically signed by you, and it governs your use of the Website and Services. This Policy forms part of our `,
        { text: "Terms and Conditions", href: LEGAL_ROUTES.terms },
        ".",
      ],
    },
  ],

  sections: [
    {
      id: "prohibited-activities",
      heading: "Prohibited activities and uses",
      blocks: [
        {
          type: "p",
          content: [
            "You may not use the Website and Services to publish content or engage in activity that is illegal under applicable law, that is harmful to others, or that would subject us to liability, including, without limitation, in connection with any of the following, each of which is prohibited under this Policy:",
          ],
        },
        {
          type: "list",
          items: [
            ["Distributing malware or other malicious code."],
            ["Disclosing sensitive personal information about others without authorization."],
            [
              "Collecting, or attempting to collect, personal information about third parties without their knowledge or consent, or without a lawful basis.",
            ],
            [
              "Submitting false, inflated, duplicate or fabricated expense claims, or uploading forged, altered or manipulated receipts, invoices, bills or other supporting documents.",
            ],
            ["Manipulating, spoofing or falsifying location, mileage, travel, attendance or time data."],
            [
              "Circumventing, disabling or interfering with expense policies, spending limits, approval workflows or audit trails configured in the Platform.",
            ],
            [
              "Using the Services to facilitate money laundering, tax evasion, bribery, corruption, or any payment or benefit that is prohibited by law or by applicable industry codes of conduct.",
            ],
            [
              "Hosting, distributing or linking to content that is obscene, pornographic, paedophilic, invasive of another’s privacy, or harmful to children.",
            ],
            [
              "Promoting or facilitating gambling, violence, terrorist activities, or the sale of weapons, ammunition, controlled substances, drug contraband or prescription medications.",
            ],
            [
              "Publishing content that threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign States, or public order.",
            ],
            ["Facilitating pyramid schemes or other fraudulent schemes."],
            ["Threatening harm to persons or property or otherwise harassing behavior."],
            ["Manual or automatic testing of credit cards or other payment methods using bots or scripts."],
            [
              "Misrepresenting or fraudulently representing products or services, impersonating any person or entity, or knowingly sharing information that is patently false or misleading.",
            ],
            ["Infringing the intellectual property or other proprietary rights of others."],
            ["Facilitating, aiding, or encouraging any of the above activities through the Website and Services."],
          ],
        },
      ],
    },

    {
      id: "system-abuse",
      heading: "System abuse",
      blocks: [
        {
          type: "p",
          content: [
            "Any User in violation of the Website and Services security is subject to criminal and civil liability, including under the Information Technology Act, 2000, as well as immediate account termination. Examples include, but are not limited to the following:",
          ],
        },
        {
          type: "list",
          items: [
            ["Use or distribution of tools designed for compromising the security of the Website and Services."],
            ["Intentionally or negligently transmitting files containing a computer virus or corrupted data."],
            [
              "Accessing another network or another User’s account without permission, including to probe, scan or test for vulnerabilities or breach security or authentication measures, unless you have our prior written authorization.",
            ],
            [
              "Unauthorized scanning or monitoring of data on any network or system without proper authorization of the owner of the system or network.",
            ],
            [
              "Scraping, crawling or harvesting data from the Website or Platform, or accessing the Platform through automated means other than the interfaces we make available.",
            ],
            ["Reverse engineering, decompiling or attempting to derive the source code of the Services."],
          ],
        },
      ],
    },

    {
      id: "service-resources",
      heading: "Service resources",
      blocks: [
        {
          type: "p",
          content: [
            "You may not consume excessive amounts of the resources of the Website and Services or use the Website and Services in any way which results in performance issues or which interrupts the Services for other Users. Prohibited activities that contribute to excessive use include, without limitation:",
          ],
        },
        {
          type: "list",
          items: [
            [
              "Deliberate attempts to overload the Website and Services and broadcast attacks, such as denial of service attacks.",
            ],
            ["Engaging in any other activities that degrade the usability and performance of the Website and Services."],
          ],
        },
      ],
    },

    {
      id: "no-spam",
      heading: "No spam policy",
      blocks: [
        {
          type: "p",
          content: [
            "You may not use the Website and Services to send spam or bulk unsolicited messages. The invitation, notification and sharing features of the Platform may only be used to communicate with individuals in connection with your organization’s legitimate use of Expendesk. We maintain a zero-tolerance policy for use of the Website and Services in any manner associated with the transmission, distribution, or delivery of unsolicited bulk or unsolicited commercial messages, or messages that do not comply with applicable anti-spam laws, including the Telecom Commercial Communications Customer Preference Regulations, 2018 in India and the U.S. CAN-SPAM Act of 2003 (“SPAM”).",
          ],
        },
        {
          type: "p",
          content: [
            "Sending messages through the Website and Services to purchased or rented contact lists will be treated as SPAM. We may terminate the Service of any User who sends out SPAM with or without notice.",
          ],
        },
      ],
    },

    {
      id: "defamation",
      heading: "Defamation and objectionable content",
      blocks: [
        {
          type: "p",
          content: [
            "The Platform allows Users to add comments, notes and messages, for example on expense claims and approvals. We encourage Users to be respectful with the content they post. We are not a publisher of User content and are not in a position to investigate the veracity of individual defamation claims or to determine whether certain material, which we may find objectionable, should be censored. However, we reserve the right to moderate, disable or remove any content to prevent harm to others or to us or the Website and Services, as determined in our sole discretion.",
          ],
        },
      ],
    },

    {
      id: "copyrighted-content",
      heading: "Copyrighted content",
      blocks: [
        {
          type: "p",
          content: [
            "Copyrighted material must not be published via the Website and Services without the explicit permission of the copyright owner or a person explicitly authorized to give such permission by the copyright owner. Upon receipt of a claim for copyright infringement, or a notice of such violation, we may, at our discretion, run an investigation and, upon confirmation, may remove the infringing material from the Website and Services. We may terminate the Service of Users with repeated copyright infringements. Further procedures may be carried out if necessary. We will assume no liability to any User of the Website and Services for the removal of any such material. If you believe your copyright is being infringed by a person or persons using the Website and Services, please follow the process set out in our ",
            { text: "Copyright and DMCA Policy", href: LEGAL_ROUTES.copyright },
            ".",
          ],
        },
      ],
    },

    {
      id: "ai-features",
      heading: "Use of AI features",
      blocks: [
        {
          type: "p",
          content: [
            "You may not use Expy AI or any other AI-assisted feature of the Website and Services to generate unlawful, harmful, deceptive or infringing content, to attempt to bypass or extract the instructions, safeguards or underlying models of those features, or to submit prompts intended to make the Services disclose information you are not authorized to access.",
          ],
        },
      ],
    },

    {
      id: "security",
      heading: "Security",
      blocks: [
        {
          type: "p",
          content: [
            "You take full responsibility for maintaining reasonable security precautions for your account. You are responsible for protecting and updating any login account provided to you for the Website and Services. You must protect the confidentiality of your login details, must not share your account with anyone else, and should change your password periodically.",
          ],
        },
      ],
    },

    {
      id: "enforcement",
      heading: "Enforcement",
      blocks: [
        {
          type: "p",
          content: [
            "We reserve our right to be the sole arbiter in determining the seriousness of each infringement and to immediately take corrective actions, including but not limited to:",
          ],
        },
        {
          type: "list",
          items: [
            [
              "Suspending or terminating your Service with or without notice upon any violation of this Policy. Any violations may also result in the immediate suspension or termination of your account.",
            ],
            [
              "Disabling or removing any content which is prohibited by this Policy, including to prevent harm to others or to us or the Website and Services, as determined by us in our sole discretion.",
            ],
            ["Informing the Customer organization that provided your account about the violation."],
            ["Reporting violations to law enforcement as determined by us in our sole discretion."],
            [
              "A failure to respond to an email from our team within 2 business days, or as otherwise specified in the communication to you, may result in the suspension or termination of your account.",
            ],
          ],
        },
        {
          type: "p",
          content: ["Suspended and terminated User accounts due to violations will not be re-activated."],
        },
        {
          type: "p",
          content: [
            "Nothing contained in this Policy shall be construed to limit our actions or remedies in any way with respect to any of the prohibited activities. We reserve the right to take any and all additional actions we may deem appropriate with respect to such activities, including without limitation taking action to recover the costs and expenses of identifying offenders and removing them from the Website and Services, and levying cancellation charges to cover our costs. In addition, we reserve at all times all rights and remedies available to us with respect to such activities at law or in equity.",
          ],
        },
      ],
    },

    {
      id: "reporting-violations",
      heading: "Reporting violations",
      blocks: [
        {
          type: "p",
          content: [
            "If you have discovered and would like to report a violation of this Policy, please contact us immediately at ",
            { text: LEGAL_ENTITY.email, href: `mailto:${LEGAL_ENTITY.email}` },
            " with the subject line “Policy Violation Report”. We will investigate the situation and provide you with full assistance.",
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
    "If you have any questions, concerns, or complaints regarding this Policy, we encourage you to contact us using the details below:"
  ),
};
