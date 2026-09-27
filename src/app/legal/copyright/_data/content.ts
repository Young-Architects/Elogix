/**
 * Copyright and DMCA Policy copy for /legal/copyright.
 *
 * Transcribed verbatim from Expendesk_Copyright_and_DMCA_Policy.pdf (last
 * updated 21 September 2026). Wording is unedited; only the PDF's running
 * header and footer were dropped. Entity details come from
 * ../../_data/company.ts.
 *
 * This document closes with "Reporting copyright infringement" rather than
 * "Contacting us" — the heading is passed through `legalContact`, because a
 * legal document's own section names are not ours to normalise.
 */
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED, legalContact } from "../../_data/company";
import type { LegalDocument } from "../../_data/types";

/** The U.S. Copyright Office, as referenced in the opening section. */
const US_COPYRIGHT_OFFICE = "https://www.copyright.gov/";

export const copyrightPolicy: LegalDocument = {
  eyebrow: "Legal",
  title: "Copyright and DMCA Policy",
  lastUpdated: LEGAL_LAST_UPDATED,

  intro: [
    {
      type: "p",
      content: [
        "This copyright and Digital Millennium Copyright Act policy (“Policy”) applies to the ",
        { text: LEGAL_ENTITY.websiteUrl, href: `${LEGAL_ENTITY.websiteUrl}/`, external: true },
        " website (“Website”), the Expendesk expense and reimbursement management platform available at ",
        { text: LEGAL_ENTITY.platformUrl, href: LEGAL_ENTITY.platformUrl, external: true },
        ` and through any related mobile application (“Platform”), and any of their related products and services (collectively, “Services”), and outlines how ${LEGAL_ENTITY.name}, which owns and operates Expendesk (“Expendesk”, “we”, “us” or “our”), addresses copyright infringement notifications and how you (“you” or “your”) may submit a copyright infringement complaint.`,
      ],
    },
    {
      type: "p",
      content: [
        "Protection of intellectual property is of utmost importance to us and we ask our users and their authorized agents to do the same. It is our policy to expeditiously respond to clear notifications of alleged copyright infringement that comply with the Copyright Act, 1957 and the Copyright Rules, 2013 of India, the Information Technology Act, 2000 and the rules made under it and, where applicable, the United States Digital Millennium Copyright Act (“DMCA”) of 1998, the text of which can be found at the U.S. Copyright Office ",
        { text: "website", href: US_COPYRIGHT_OFFICE, external: true },
        ".",
      ],
    },
  ],

  sections: [
    {
      id: "before-submitting",
      heading: "What to consider before submitting a copyright complaint",
      blocks: [
        {
          type: "p",
          content: [
            "Before submitting a copyright complaint to us, consider whether the use could be considered fair dealing under Section 52 of the Copyright Act, 1957 or fair use under the laws of the United States. These exceptions permit the use of copyrighted material, under certain circumstances, for purposes such as private use, research, criticism, review, news reporting and teaching, without the need for permission from or payment to the copyright holder. If you have considered these exceptions and you still wish to continue with a copyright complaint, you may want to first reach out to the user in question to see if you can resolve the matter directly with the user.",
          ],
        },
        {
          type: "p",
          content: [
            "Please note that you may be liable for damages, including costs and legal fees incurred by us or our users, if you knowingly misrepresent that the material or activity is infringing, including under 17 U.S.C. § 512(f) where the DMCA applies. If you are unsure whether the material you are reporting is in fact infringing, you may wish to contact an attorney before filing a notification with us.",
          ],
        },
        {
          type: "p",
          content: [
            "We may, at our discretion or as required by law, share a copy of your notification or counter-notification with third parties. This may include sharing the information with the account holder engaged in the allegedly infringing activity. If you are concerned about your information being forwarded, you may wish to appoint an agent or attorney to report infringing material on your behalf.",
          ],
        },
      ],
    },

    {
      id: "notifications",
      heading: "Notifications of infringement",
      blocks: [
        {
          type: "p",
          content: [
            "If you are a copyright owner, an exclusive licensee, or an agent thereof, and you believe that any material available on our Services infringes your copyrights, then you may submit a written copyright infringement notification (“Notification”) by email to ",
            { text: LEGAL_ENTITY.email, href: `mailto:${LEGAL_ENTITY.email}` },
            " with the subject line “Copyright Notice”, or by post to the address below, providing us with the following information:",
          ],
        },
        {
          type: "list",
          items: [
            [
              "Identification of the copyrighted work that you claim has been infringed, or, if multiple copyrighted works are covered by this Notification, a representative list of the copyrighted works that you claim have been infringed.",
            ],
            [
              "Details establishing that you are the owner or exclusive licensee of the copyright in the work, or that you are authorized to act on their behalf.",
            ],
            [
              "Identification of the infringing material and information you claim is infringing or is the subject of infringing activity, including at a minimum, if applicable, the URL or URLs of the web pages where the allegedly infringing material may be found.",
            ],
            ["Details of the person who made the allegedly infringing material available, if known."],
            [
              "Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and, if available, an email address.",
            ],
            [
              "A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, the copyright owner’s agent, or the law, and is not covered by any exception under applicable law.",
            ],
            [
              "A statement that the information in the Notification is accurate and, where the DMCA applies, under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.",
            ],
            [
              "A physical or electronic signature of the copyright owner or a person authorized to act on their behalf. Typing your full name will suffice.",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "All such Notifications must comply with the requirements of applicable law. Filing a copyright complaint is the start of a pre-defined legal process. Your complaint will be reviewed for accuracy, validity, and completeness. If your complaint has satisfied these requirements, our response may include the removal or restriction of access to allegedly infringing material as well as a permanent termination of repeat infringers’ accounts.",
          ],
        },
      ],
    },

    {
      id: "indian-law",
      heading: "Notices under Indian law",
      blocks: [
        {
          type: "p",
          content: [
            "Where a Notification is submitted under Section 52(1)(c) of the Copyright Act, 1957 read with Rule 75 of the Copyright Rules, 2013, and we are satisfied that it is complete and valid, we will disable access to the allegedly infringing material within 36 hours of receipt. Access will remain disabled for 21 days from the date of receipt of the Notification, or until we receive an order from a competent court, whichever is earlier. If no such court order is received within 21 days, we may restore access to the material. We also act on orders of courts and directions of authorized government agencies in accordance with Section 79 of the Information Technology Act, 2000 and the rules made under it.",
          ],
        },
        {
          type: "p",
          content: [
            "If we remove or restrict access to materials or terminate an account in response to a Notification of alleged infringement, we will make a good faith effort to contact the affected user with information concerning the removal or restriction of access, which may include a full copy of your Notification, including your name, address, phone and email address, along with instructions for filing a counter-notification.",
          ],
        },
        {
          type: "p",
          content: [
            "Notwithstanding anything to the contrary contained in any portion of this Policy, Expendesk reserves the right to take no action upon receipt of a copyright infringement Notification if it fails to comply with the requirements of applicable law for such notifications.",
          ],
        },
      ],
    },

    {
      id: "counter-notifications",
      heading: "Counter-notifications",
      blocks: [
        {
          type: "p",
          content: [
            "A user who receives a copyright infringement Notification may make a counter-notification, including pursuant to sections 512(g)(2) and (3) of the US Copyright Act where the DMCA applies. If you receive a copyright infringement Notification, it means that the material described in the Notification has been removed from our Services or access to the material has been restricted. Please take the time to read through the Notification, which includes information on the Notification we received as well as instructions on how to file counter-notifications.",
          ],
        },
        {
          type: "p",
          content: [
            "To file a counter-notification with us, you must provide a written communication that sets out the information specified in the list below:",
          ],
        },
        {
          type: "list",
          items: [
            [
              "Identification of the material that has been removed or to which access has been restricted and the location at which the material appeared before it was removed or access to it was restricted.",
            ],
            [
              "Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and, if available, an email address.",
            ],
            [
              "A statement, under penalty of perjury where the DMCA applies, that you have a good faith belief that the material was removed or restricted as a result of mistake or misidentification of the material to be removed or restricted.",
            ],
            [
              "A statement that you consent to the jurisdiction of the courts at Kolkata, West Bengal, India or, where the DMCA applies, of the federal district court for the judicial district in which your address is located or, if you are outside of the United States, of any judicial district in which the service provider may be found, and that you will accept service of process from the person or company who provided the original infringement Notification.",
            ],
            [
              "Your physical or electronic signature or that of a person authorized to act on your behalf. Typing your full name will suffice.",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "Please note that you may be liable for damages, including costs and legal fees incurred by us or our users, if you knowingly misrepresent that the material or activity is not infringing the copyrights of others or that the material or activity was removed or restricted by mistake or misidentification. Accordingly, if you are not sure whether certain material infringes the copyrights of others or that the material or activity was removed or restricted by mistake or misidentification, you may wish to contact an attorney before filing a counter-notification.",
          ],
        },
        {
          type: "p",
          content: [
            "Notwithstanding anything to the contrary contained in any portion of this Policy, Expendesk reserves the right to take no action upon receipt of a counter-notification. If we receive a counter-notification that complies with applicable law, including 17 U.S.C. § 512(g) where applicable, we may forward it to the person who filed the original Notification.",
          ],
        },
        {
          type: "p",
          content: [
            "The process described in this Policy does not limit our ability to pursue any other remedies we may have to address suspected infringement.",
          ],
        },
      ],
    },

    {
      id: "repeat-infringers",
      heading: "Repeat infringers",
      blocks: [
        {
          type: "p",
          content: [
            "We will, in appropriate circumstances and at our discretion, suspend or terminate the accounts of users who are found to be repeat infringers.",
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
  ],

  contact: legalContact(
    "If you would like to notify us of the infringing material or activity, we encourage you to contact us using the details below:",
    "Reporting copyright infringement"
  ),
};
