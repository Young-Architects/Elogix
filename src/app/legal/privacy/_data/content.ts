/**
 * Privacy Policy copy for /legal/privacy.
 *
 * Transcribed verbatim from Expendesk_Privacy_Policy.pdf (last updated
 * 21 September 2026), the longest of the six documents at 19 pages. Wording is
 * unedited; only the PDF's running header and footer were dropped. Entity
 * details and cross-document links come from ../../_data/company.ts.
 *
 * This is the document every other one points at, so its route must never
 * change without updating LEGAL_ROUTES.
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
const GA_OPT_OUT = "https://tools.google.com/dlpage/gaoptout";

export const privacyPolicy: LegalDocument = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  lastUpdated: LEGAL_LAST_UPDATED,

  intro: [
    {
      type: "p",
      content: [
        "We respect your privacy and are committed to protecting it through our compliance with this privacy policy (“Policy”). This Policy describes the types of information we may collect from you or that you may provide (“Personal Information”) when you use the ",
        { text: LEGAL_ENTITY.websiteUrl, href: `${LEGAL_ENTITY.websiteUrl}/`, external: true },
        " website (“Website”), the Expendesk expense and reimbursement management platform available at ",
        { text: LEGAL_ENTITY.platformUrl, href: LEGAL_ENTITY.platformUrl, external: true },
        " and through any related mobile application (“Platform”), and any of their related products and services (collectively, “Services”), and our practices for collecting, using, maintaining, protecting, and disclosing that Personal Information. It also describes the choices available to you regarding our use of your Personal Information and how you can access, correct and update it.",
      ],
    },
    {
      type: "p",
      content: [
        "This Policy is a legally binding agreement between you (“User”, “you” or “your”) and ",
        { text: LEGAL_ENTITY.name, bold: true },
        `, a company incorporated under the laws of India with Corporate Identification Number ${LEGAL_ENTITY.cin} and its registered office at ${LEGAL_ENTITY.addressInline}, which owns and operates Expendesk (“Expendesk”, “we”, “us” or “our”). If you are entering into this agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this agreement, in which case the terms “User”, “you” or “your” shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this agreement, you must not accept this agreement and may not access and use the Website and Services. By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Policy. This Policy does not apply to the practices of companies that we do not own or control, or to individuals that we do not employ or manage.`,
      ],
    },
    {
      type: "p",
      content: [
        "This Policy has been prepared in accordance with the Information Technology Act, 2000 and the rules made under it, the Digital Personal Data Protection Act, 2023 (“DPDP Act”) and the Digital Personal Data Protection Rules, 2025 and, where they apply to you, the EU and UK General Data Protection Regulation (“GDPR”) and other applicable data protection laws.",
      ],
    },
  ],

  sections: [
    {
      id: "who-this-applies-to",
      heading: "Who this Policy applies to",
      blocks: [
        {
          type: "p",
          content: [
            "This Policy applies to: (i) visitors to our Website; (ii) prospective customers who book a demo, contact our sales team, chat with our website assistant, or download our guides and whitepapers; (iii) our customers and their authorized representatives; and (iv) employees, managers, approvers, finance team members and other individuals who are given access to the Platform by an organization that subscribes to Expendesk (“Customer”).",
          ],
        },
      ],
    },

    {
      id: "automatic-collection",
      heading: "Automatic collection of information",
      blocks: [
        {
          type: "p",
          content: [
            "When you open the Website or use the Platform, our servers automatically record information that your browser or device sends. This data may include information such as your device’s IP address, browser type and version, operating system type and version, language preferences or the webpage you were visiting before you came to the Website and Services, pages of the Website and Services that you visit, the time spent on those pages, the information you search for on the Website, access times and dates, and other statistics.",
          ],
        },
        {
          type: "p",
          content: [
            "Information collected automatically is used to identify potential cases of abuse, keep the Website and Services secure, and establish statistical information regarding the usage and traffic of the Website and Services. This statistical information is not otherwise aggregated in such a way that would identify any particular User of the system.",
          ],
        },
      ],
    },

    {
      id: "collection-of-personal-information",
      heading: "Collection of personal information",
      blocks: [
        {
          type: "p",
          content: [
            "You can browse the Website without telling us who you are or revealing any information by which someone could identify you as a specific, identifiable individual. If, however, you wish to book a demo, contact us, download a resource, or use the Platform, you will be asked to provide certain Personal Information.",
          ],
        },

        { type: "h3", text: "Information you provide through the Website" },
        {
          type: "p",
          content: [
            "When you book a demo, contact our sales team, subscribe to updates, download our free guides or whitepapers, or chat with Expy AI, our website assistant, we may collect:",
          ],
        },
        {
          type: "list",
          items: [
            ["Contact information, such as your name, business email address and phone number"],
            ["Professional information, such as your company name, job title, industry, team size and location"],
            ["Meeting details, such as your preferred date and time for a demo and information you share during the call"],
            ["The content of your messages, chat conversations and any other information you choose to share with us"],
          ],
        },

        { type: "h3", text: "Information processed through the Platform" },
        {
          type: "p",
          content: [
            "When a Customer subscribes to Expendesk and gives you access to the Platform, we process the following information on behalf of that Customer:",
          ],
        },
        {
          type: "list",
          items: [
            [
              "Account details, such as name, user ID, employee ID, login credentials, role, department, reporting manager and cost center",
            ],
            ["Contact information, such as work email address and mobile number"],
            [
              "Expense and claim data, such as amounts, dates, categories, merchants, descriptions, travel details, advances, budgets and reimbursement status",
            ],
            [
              "Receipts, invoices, bills and other documents you upload, including information printed on them such as GST details",
            ],
            [
              "Approval workflow data, such as approvals, rejections, comments, chat messages, policy exceptions and audit trail records",
            ],
            [
              "Reimbursement details, such as bank account information, where your organization processes reimbursements through the Platform",
            ],
            [
              "Location data, such as GPS coordinates, routes and distance travelled, only where your organization has enabled location-based travel or conveyance tracking and you have granted location permission on your device",
            ],
            ["Device and usage information, such as device type, operating system, app version, log data and in-app activity"],
          ],
        },
        {
          type: "p",
          content: [
            "Customers decide which features are enabled and what information their Users submit. You can choose not to grant location permission on your device, but certain travel or conveyance features may then not work.",
          ],
        },

        { type: "h3", text: "Information from other sources" },
        {
          type: "p",
          content: [
            "We may receive Personal Information about you from other sources, such as your employer or organization when it creates a Platform account for you, business contact databases, professional networking platforms such as LinkedIn, events and webinars, and our referral or implementation partners. This information is limited to business contact and professional details.",
          ],
        },
        {
          type: "p",
          content: [
            "You can choose not to provide us with your Personal Information, but then you may not be able to take advantage of some of the features of the Website and Services. Users who are uncertain about what information is mandatory are welcome to contact us.",
          ],
        },
      ],
    },

    {
      id: "privacy-of-children",
      heading: "Privacy of children",
      blocks: [
        {
          type: "p",
          content: [
            "The Website and Services are designed for businesses and are not directed at children. We do not knowingly collect any Personal Information from children under the age of 18. If you are under the age of 18, please do not submit any Personal Information through the Website and Services. If you have reason to believe that a child under the age of 18 has provided Personal Information to us through the Website and Services, please contact us to request that we delete that child’s Personal Information from our Services.",
          ],
        },
      ],
    },

    {
      id: "our-role",
      heading: "Our role in processing your information",
      blocks: [
        {
          type: "p",
          content: [
            "For information collected through the Website and information about our business relationship with Customers, such as billing and account contacts, we determine the purposes and means of processing and act as a “Data Fiduciary” under the DPDP Act and a “data controller” under the GDPR.",
          ],
        },
        {
          type: "p",
          content: [
            "For information that Customers and their Users submit to the Platform (“Customer Data”), the Customer is the Data Fiduciary, or data controller under the GDPR, and we act as a “Data Processor” that processes Customer Data only on the Customer’s instructions and in accordance with our agreement with that Customer. If you are an employee or other User of a Customer, please direct questions about how your organization uses your information, and any requests to exercise your rights, to your organization in the first instance. We will assist our Customers in responding to such requests.",
          ],
        },
      ],
    },

    {
      id: "use-and-processing",
      heading: "Use and processing of collected information",
      blocks: [
        {
          type: "p",
          content: [
            "In order to make the Website and Services available to you, or to meet a legal obligation, we may need to collect and use certain Personal Information. If you do not provide the information that we request, we may not be able to provide you with the requested products or services. Any of the information we collect from you may be used for the following purposes:",
          ],
        },
        {
          type: "list",
          items: [
            ["Create and manage user accounts and provide access to the Platform"],
            ["Deliver, operate, maintain and support the Services"],
            ["Process expense claims, approvals and reimbursements as configured by Customers"],
            ["Provide AI-assisted features, such as receipt data extraction, expense categorization and policy checks"],
            ["Schedule and conduct product demos and respond to sales inquiries"],
            ["Process subscriptions, invoices and payments"],
            ["Respond to inquiries and offer support"],
            ["Send administrative information, service notifications and product updates"],
            ["Send marketing and promotional communications, where permitted by law"],
            ["Measure and improve our marketing and advertising campaigns"],
            ["Request feedback and improve our products, services and user experience"],
            ["Publish customer testimonials and case studies, only with the customer’s prior consent"],
            ["Enforce our terms, conditions and policies"],
            ["Protect the Website and Services from abuse, fraud and malicious users"],
            ["Respond to legal requests, comply with applicable laws and prevent harm"],
          ],
        },
        {
          type: "p",
          content: [
            "We may also combine or aggregate some of your Personal Information in order to better serve you and to improve and update our Website and Services.",
          ],
        },
      ],
    },

    {
      id: "legal-basis",
      heading: "Legal basis for processing",
      blocks: [
        {
          type: "p",
          content: [
            "We process your Personal Information only where we have a lawful basis to do so. Under the DPDP Act, we rely on (i) your consent, which you give through a clear affirmative action such as submitting a form, booking a demo or accepting non-essential cookies; and (ii) the legitimate uses permitted under Section 7 of the DPDP Act, such as where you have voluntarily provided your Personal Information for a specified purpose, or where processing is necessary to comply with the law or an order of a court or authority.",
          ],
        },
        {
          type: "p",
          content: ["Where the GDPR applies, we rely on the following legal bases:"],
        },
        {
          type: "list",
          items: [
            ["Your consent"],
            [
              "Performance of a contract with you or with the Customer you represent, or steps taken at your request before entering into a contract",
            ],
            ["Compliance with our legal obligations"],
            [
              "Our legitimate interests, such as securing our Services, improving our products and communicating with business contacts, where those interests are not overridden by your rights",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "Where we rely on consent, you may withdraw it at any time, as easily as you gave it. Withdrawal will not affect the lawfulness of processing carried out before the withdrawal. We will be happy to clarify the specific legal basis that applies to any processing, and whether the provision of Personal Information is a statutory or contractual requirement.",
          ],
        },
      ],
    },

    {
      id: "ai-features",
      heading: "AI-assisted features and Expy AI",
      blocks: [
        {
          type: "p",
          content: [
            "Expendesk uses artificial intelligence and automation to make expense management faster, for example to read and extract information from receipts, suggest expense categories, flag possible duplicates or policy violations, and power Expy AI, the assistant available on our Website. To provide these features, the relevant information, such as receipt images or the messages you type into Expy AI, may be processed by our systems and by carefully selected third-party AI and cloud service providers acting on our behalf.",
          ],
        },
        {
          type: "p",
          content: [
            "We do not sell Customer Data, and we do not use Customer Data to train AI models that are made available to other customers. AI-generated outputs can be inaccurate, so final decisions on claims, approvals and reimbursements are made by the Customer and its authorized Users. Please do not share passwords, financial account details or other sensitive personal information in conversations with Expy AI.",
          ],
        },
      ],
    },

    {
      id: "payment-processing",
      heading: "Payment processing",
      blocks: [
        {
          type: "p",
          content: [
            "Subscription fees for our Services are invoiced to Customers and may be paid by bank transfer or through third-party payment gateways (“Payment Processors”). Where you pay through a Payment Processor, your card or bank account details are collected and processed directly by that Payment Processor, and we do not store full card numbers on our systems.",
          ],
        },
        {
          type: "p",
          content: [
            "We work with Payment Processors that adhere to industry security standards, such as those managed by the PCI Security Standards Council, and payment information is exchanged over encrypted connections. We will share payment data with the Payment Processors only to the extent necessary for the purposes of processing your payments, refunding such payments, and dealing with complaints and queries related to such payments and refunds.",
          ],
        },
        {
          type: "p",
          content: [
            "Please note that the Payment Processors may collect some Personal Information from you, such as your email address, address, card details and bank account number, which allows them to process your payments and handle all the steps in the payment process through their systems, including data collection and data processing. The Payment Processors’ use of your Personal Information is governed by their respective privacy policies, which may or may not contain privacy protections as protective as this Policy. We suggest that you review their respective privacy policies.",
          ],
        },
      ],
    },

    {
      id: "managing-information",
      heading: "Managing information",
      blocks: [
        {
          type: "p",
          content: [
            "You are able to update, correct or delete certain Personal Information we have about you. Platform Users can update certain profile information from within the Platform, while other changes may need to be made by your organization’s administrator. When you delete Personal Information, however, we may maintain a copy of the unrevised Personal Information in our records for the duration necessary to comply with our legal obligations and for the purposes described in this Policy. If you would like to delete your Personal Information or account, please contact your organization’s administrator or contact us.",
          ],
        },
      ],
    },

    {
      id: "disclosure",
      heading: "Disclosure of information",
      blocks: [
        {
          type: "p",
          content: [
            "We do not sell or rent your Personal Information. Depending on the requested Services or as necessary to complete any transaction or provide any Service you have requested, we may share your information with our group companies, contracted companies and service providers (collectively, “Service Providers”) we rely upon to assist in the operation of the Website and Services and whose privacy practices are consistent with ours or who agree to abide by our policies with respect to Personal Information.",
          ],
        },
        {
          type: "p",
          content: [
            "Service Providers are not authorized to use or disclose your information except as necessary to perform services on our behalf or comply with legal requirements. Service Providers are given the information they need only in order to perform their designated functions, and we do not authorize them to use or disclose any of the provided information for their own marketing or other purposes. We will share and disclose your information only with the following categories of Service Providers:",
          ],
        },
        {
          type: "list",
          items: [
            ["Cloud computing, hosting and data storage providers"],
            ["Customer relationship management, form and appointment scheduling providers"],
            ["Email, calendar, video meeting and other communication and collaboration services"],
            ["Analytics and performance monitoring services"],
            ["AI, optical character recognition and automation service providers"],
            ["Advertising and marketing platforms, subject to your consent where required"],
            ["Payment gateways and financial services providers"],
            ["Accounting, ERP and payroll systems that a Customer chooses to integrate with the Platform"],
            ["User authentication and security services"],
            ["Professional advisors, such as auditors, lawyers and chartered accountants"],
            ["Government agencies, regulators and law enforcement authorities, where required by law"],
          ],
        },
        {
          type: "p",
          content: [
            "Within the Platform, information you submit is visible to other Users in your organization according to the roles and permissions configured by your organization, for example to your approving manager and finance team.",
          ],
        },
        {
          type: "p",
          content: [
            "We may also disclose any Personal Information we collect, use or receive if required or permitted by law, such as to comply with a summons, court order or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.",
          ],
        },
        {
          type: "p",
          content: [
            "In the event we go through a business transition, such as a merger or acquisition by another company, or sale of all or a portion of our assets, your user account and your Personal Information will likely be among the assets transferred, and will remain subject to the commitments made in this Policy.",
          ],
        },
      ],
    },

    {
      id: "retention",
      heading: "Retention of information",
      blocks: [
        {
          type: "p",
          content: [
            "We retain Personal Information only for as long as it is necessary for the purposes for which it was collected, including to comply with our legal obligations, enforce our agreements and resolve disputes. In general:",
          ],
        },
        {
          type: "list",
          items: [
            [
              "Website and sales inquiry information is retained for as long as needed to respond to you and maintain our business relationship, and generally for no longer than 3 years from your last interaction with us",
            ],
            [
              "Customer Data is retained for the duration of the Customer’s subscription and is deleted or returned within 90 days after the subscription ends, unless the Customer instructs us otherwise or a longer period is required by law",
            ],
            [
              "Billing, tax and accounting records are retained for the periods required under applicable laws, such as the Companies Act, 2013 and goods and services tax laws, which is currently up to 8 years",
            ],
            ["Backup copies are overwritten on a rolling basis in accordance with our backup cycles"],
          ],
        },
        {
          type: "p",
          content: [
            "We may use aggregated or de-identified data derived from your Personal Information after you update or delete it, but not in a manner that would identify you personally. Once the applicable retention period expires, Personal Information shall be deleted or anonymized. Therefore, the right to access, the right to erasure, the right to correction, and the right to data portability cannot be enforced after the expiration of the retention period.",
          ],
        },
      ],
    },

    {
      id: "transfer",
      heading: "Transfer of information",
      blocks: [
        {
          type: "p",
          content: [
            "We are based in India. Depending on your location and the Service Providers we use, your information may be transferred to, stored in and processed in countries other than your own. Where we transfer Personal Information outside India, we will do so in compliance with the DPDP Act, including any restrictions notified by the Government of India. Where the GDPR applies, transfers outside the European Economic Area or the United Kingdom will be made only on the basis of an adequacy decision, appropriate safeguards such as standard contractual clauses, or your explicit consent.",
          ],
        },
        {
          type: "p",
          content: [
            "You are entitled to learn about the legal basis of information transfers to a country outside your own and about the security measures taken by us to safeguard your information. If you would like to know more, please contact us using the information provided in the contact section.",
          ],
        },
      ],
    },

    {
      id: "dpdp-rights",
      heading: "Your rights under the DPDP Act",
      blocks: [
        {
          type: "p",
          content: [
            "If you are in India, you have the following rights, subject to the DPDP Act and the rules made under it:",
          ],
        },
        {
          type: "list",
          items: [
            [
              { text: "Right to access information:", bold: true },
              " to obtain a summary of the Personal Information we process about you, the processing activities undertaken, and the identities of other Data Fiduciaries and Data Processors with whom it has been shared",
            ],
            [
              { text: "Right to correction and erasure:", bold: true },
              " to have inaccurate or misleading Personal Information corrected, incomplete information completed, information updated, and information that is no longer necessary erased, unless its retention is required by law",
            ],
            [
              { text: "Right to withdraw consent:", bold: true },
              " to withdraw your consent at any time, as easily as you gave it",
            ],
            [
              { text: "Right of grievance redressal:", bold: true },
              " to have your grievances addressed by our Grievance Officer",
            ],
            [
              { text: "Right to nominate:", bold: true },
              " to nominate another individual to exercise your rights in the event of your death or incapacity",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "If you are not satisfied with the resolution of your grievance, you may file a complaint with the Data Protection Board of India after exhausting our grievance redressal process.",
          ],
        },
      ],
    },

    {
      id: "gdpr-rights",
      heading: "Data protection rights under the GDPR",
      blocks: [
        {
          type: "p",
          content: [
            "If you are a resident of the European Economic Area (“EEA”) or the United Kingdom, you have certain data protection rights, and we aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Information. In certain circumstances, you have the right to:",
          ],
        },
        {
          type: "list",
          items: [
            ["Withdraw your consent at any time, where processing is based on consent"],
            ["Learn whether your Personal Information is being processed by us and obtain a copy of it"],
            ["Verify the accuracy of your information and ask for it to be updated, corrected or completed"],
            [
              "Object to processing carried out on the basis of our legitimate interests, and object at any time, without giving a reason, to processing for direct marketing purposes",
            ],
            ["Restrict the processing of your Personal Information, for example while its accuracy is being verified"],
            [
              "Obtain the erasure of your Personal Information, subject to exceptions such as compliance with a legal obligation or the establishment, exercise or defense of legal claims",
            ],
            [
              "Receive the Personal Information you have provided to us in a structured, commonly used and machine-readable format and have it transmitted to another controller, where technically feasible",
            ],
            ["Lodge a complaint with your local data protection authority"],
          ],
        },
      ],
    },

    {
      id: "california-rights",
      heading: "Privacy rights of California residents",
      blocks: [
        {
          type: "p",
          content: [
            "If you are a California resident, you may have rights under the California Consumer Privacy Act, as amended, to know what Personal Information we collect, use and disclose, to request its deletion or correction, and to opt out of its sale or sharing. We do not sell Personal Information, and we do not share it for cross-context behavioral advertising except where you have agreed to advertising cookies. We will not discriminate against you if you exercise your rights.",
          ],
        },
      ],
    },

    {
      id: "exercise-your-rights",
      heading: "How to exercise your rights",
      blocks: [
        {
          type: "p",
          content: [
            "Any requests to exercise your rights can be directed to us through the contact details provided in this document. Please note that we may ask you to verify your identity before responding to such requests. Your request must provide sufficient information that allows us to verify that you are the person you are claiming to be or that you are the authorized representative of such person. If we receive your request from an authorized representative, we may request evidence that you have provided such an authorized representative with power of attorney or that the authorized representative otherwise has valid written authority to submit requests on your behalf.",
          ],
        },
        {
          type: "p",
          content: [
            "You must include sufficient details to allow us to properly understand the request and respond to it. We cannot respond to your request or provide you with Personal Information unless we first verify your identity or authority to make such a request and confirm that the Personal Information relates to you. Where your request concerns Customer Data, we may forward it to the relevant Customer, which is responsible for deciding on it. We aim to respond within 30 days and, in any event, within the time prescribed by applicable law.",
          ],
        },
      ],
    },

    {
      id: "cookies",
      heading: "Cookies",
      blocks: [
        {
          type: "p",
          content: [
            "Our Website and Services use “cookies” and similar technologies to help personalize your online experience. A cookie is a small text file that is placed on your device by a web server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you.",
          ],
        },
        {
          type: "p",
          content: [
            "We may use cookies to collect, store, and track information for security and personalization, and for statistical and marketing purposes. For further information on the cookies we use and their purpose, see our ",
            { text: "Cookie Policy", href: LEGAL_ROUTES.cookies },
            ". Where required by law, we will ask for your consent before placing non-essential cookies. Most web browsers automatically accept cookies by default, but you can modify your browser settings to decline cookies if you prefer.",
          ],
        },
      ],
    },

    {
      id: "data-analytics",
      heading: "Data analytics",
      blocks: [
        {
          type: "p",
          content: [
            "Our Website uses third-party analytics tools, such as Google Analytics deployed through Google Tag Manager, that use cookies, web beacons, or other similar information-gathering technologies to collect standard internet activity and usage information. The information gathered is used to compile statistical reports on User activity, such as how often Users visit our Website and Services, what pages they visit and for how long. We use the information obtained from these analytics tools to monitor the performance of and improve our Website and Services. You can prevent Google Analytics from collecting your data by installing the ",
            { text: "Google Analytics opt-out browser add-on", href: GA_OPT_OUT, external: true },
            ".",
          ],
        },
      ],
    },

    {
      id: "do-not-track",
      heading: "Do Not Track signals",
      blocks: [
        {
          type: "p",
          content: [
            "Some browsers incorporate a Do Not Track feature that signals to websites you visit that you do not want to have your online activity tracked. Tracking is not the same as using or collecting information in connection with a website. For these purposes, tracking refers to collecting personally identifiable information from consumers who use or visit a website or online service as they move across different websites over time. How browsers communicate the Do Not Track signal is not yet uniform. As a result, the Website and Services are not yet set up to interpret or respond to Do Not Track signals communicated by your browser. Even so, as described in more detail throughout this Policy, we limit our use and collection of your Personal Information.",
          ],
        },
      ],
    },

    {
      id: "marketing-and-advertising",
      heading: "Marketing and advertising",
      blocks: [
        {
          type: "p",
          content: [
            "We do not display third-party advertisements on our Website. We may advertise Expendesk on third-party platforms, such as Google, LinkedIn, Meta’s Facebook and Instagram and YouTube, and may use their conversion tracking and remarketing tools to measure the effectiveness of our campaigns and to show relevant ads to people who have visited our Website. These tools may place cookies or similar technologies and are used only where permitted by law and, where required, with your consent. We do not share Customer Data with advertisers.",
          ],
        },
      ],
    },

    {
      id: "social-media-features",
      heading: "Social media features",
      blocks: [
        {
          type: "p",
          content: [
            "Our Website includes links to our official pages on LinkedIn, Facebook, Instagram and YouTube and may include embedded content, such as videos (collectively, “Social Media Features”). These Social Media Features may collect your IP address and what page you are visiting on our Website and Services, and may set a cookie to enable the Social Media Features to function properly. Social Media Features are hosted either by their respective providers or directly on our Website and Services. Your interactions with these Social Media Features are governed by the privacy policy of their respective providers.",
          ],
        },
      ],
    },

    {
      id: "email-marketing",
      heading: "Email and other marketing communications",
      blocks: [
        {
          type: "p",
          content: [
            "We may send you emails about Expendesk, such as product updates, industry insights, guides and event invitations, where you have subscribed or requested information from us, or as otherwise permitted by law. We are committed to keeping your email address confidential and will not disclose it to any third parties except as described in this Policy, including to service providers that send emails on our behalf.",
          ],
        },
        {
          type: "p",
          content: [
            "All marketing emails sent by us clearly state who the email is from and provide clear information on how to contact the sender, in accordance with applicable laws, including the U.S. CAN-SPAM Act. Commercial calls and SMS messages to Indian numbers are made in accordance with the Telecom Commercial Communications Customer Preference Regulations, 2018. You may choose to stop receiving our marketing communications by following the unsubscribe instructions included in them or by contacting us. However, you will continue to receive essential service and transactional communications, such as approval notifications and account and billing messages.",
          ],
        },
      ],
    },

    {
      id: "push-notifications",
      heading: "Push notifications",
      blocks: [
        {
          type: "p",
          content: [
            "If you use an Expendesk mobile application, we may send push notifications, for example to alert you about pending approvals, claim status or reimbursements. To make sure push notifications reach the correct devices, we use a third-party push notification provider that relies on a device token unique to your device, which is issued by the operating system of your device. While it is possible to access a list of device tokens, they will not reveal your identity, your unique device ID, or your contact information to us or our third-party push notification provider. If, at any time, you wish to stop receiving push notifications, simply adjust your device settings accordingly.",
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
            "The Website and Services contain links to other resources that are not owned or controlled by us. Please be aware that we are not responsible for the privacy practices of such other resources or third parties. We encourage you to be aware when you leave the Website and Services and to read the privacy statements of each and every resource that may collect Personal Information.",
          ],
        },
      ],
    },

    {
      id: "information-security",
      heading: "Information security",
      blocks: [
        {
          type: "p",
          content: [
            "We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We maintain reasonable administrative, technical, and physical safeguards in an effort to protect against unauthorized access, use, modification, and disclosure of Personal Information in our control and custody. These safeguards include encryption of data in transit using TLS/HTTPS, role-based access controls, audit trails and access to Personal Information on a need-to-know basis, and are intended to constitute reasonable security safeguards under the DPDP Act and reasonable security practices and procedures under the Information Technology Act, 2000. However, no data transmission over the Internet or wireless network can be guaranteed.",
          ],
        },
        {
          type: "p",
          content: [
            "Therefore, while we strive to protect your Personal Information, you acknowledge that (i) there are security and privacy limitations of the Internet which are beyond our control; (ii) the security, integrity, and privacy of any and all information and data exchanged between you and the Website and Services cannot be guaranteed; and (iii) any such information and data may be viewed or tampered with in transit by a third party, despite best efforts.",
          ],
        },
        {
          type: "p",
          content: [
            "As the security of Personal Information depends in part on the security of the device you use to communicate with us and the security you use to protect your credentials, please take appropriate measures to protect this information.",
          ],
        },
      ],
    },

    {
      id: "data-breach",
      heading: "Data breach",
      blocks: [
        {
          type: "p",
          content: [
            "In the event we become aware that the security of the Website and Services has been compromised or Users’ Personal Information has been disclosed to unrelated third parties as a result of external activity, including, but not limited to, security attacks or fraud, we will take reasonably appropriate measures, including investigation, containment and reporting. Where required by applicable law, we will notify affected individuals, the relevant Customers, the Data Protection Board of India and the Indian Computer Emergency Response Team within the prescribed timelines. Where a breach affects Customer Data, we will inform the affected Customer without undue delay so that it can meet its own obligations. When we notify you, we will do so by email or through the Platform.",
          ],
        },
      ],
    },

    {
      id: "grievance-officer",
      heading: "Grievance Officer",
      blocks: [
        {
          type: "p",
          content: [
            "In accordance with the Information Technology Act, 2000, the rules made under it and the DPDP Act, the details of our Grievance Officer are as follows:",
          ],
        },
        {
          type: "definitions",
          items: [
            { term: "Name", description: [GRIEVANCE_OFFICER.name] },
            { term: "Designation", description: [GRIEVANCE_OFFICER.designation] },
            {
              term: "Email",
              description: [
                { text: LEGAL_ENTITY.email, href: MAILTO },
                ` with the subject line “${GRIEVANCE_OFFICER.emailSubject}”`,
              ],
            },
            { term: "Address", description: [LEGAL_ENTITY.addressInline] },
          ],
        },
        {
          type: "p",
          content: [
            "We will acknowledge your grievance within 24 hours and endeavor to resolve it within 15 days of receipt, or within such other period as may be prescribed under applicable law.",
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
            "An updated version of this Policy will be effective immediately upon the posting of the revised Policy unless otherwise specified. Your continued use of the Website and Services after the effective date of the revised Policy, or such other act specified at that time, will constitute your consent to those changes. However, we will not, without your consent, use your Personal Information in a manner materially different than what was stated at the time your Personal Information was collected.",
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
            "You acknowledge that you have read this Policy and agree to all its terms and conditions. By accessing and using the Website and Services and submitting your information you agree to be bound by this Policy. If you do not agree to abide by the terms of this Policy, you are not authorized to access or use the Website and Services.",
          ],
        },
      ],
    },
  ],

  contact: legalContact(
    "If you have any questions, concerns, or complaints regarding this Policy, the information we hold about you, or if you wish to exercise your rights, we encourage you to contact us using the details below:",
    undefined,
    "We will attempt to resolve complaints and disputes and make every reasonable effort to honor your wish to exercise your rights as quickly as possible and, in any event, within the timescales provided by applicable data protection laws."
  ),
};
