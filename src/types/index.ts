/**
 * Shared TypeScript interfaces used across components and JSON data.
 *
 *  - `Testimonial`         — shape of each entry in testimonials.json (+ the
 *                            display-only `avatarGradient` injected at runtime).
 *  - `Chat*`               — request/response contract for the ChatWidget's
 *                            webhook, plus the in-memory message model.
 *  - `WhyComparison` /
 *    `WhyExpendeskData`    — shape of why-expendesk.json consumed by WhyExpendesk.
 *
 * Most other sections type their data inline; these are the types reused in
 * more than one place or worth pinning down explicitly.
 */
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  companyType: string;
  avatar: string;
  avatarImage?: string;
  avatarGradient: string;
  rating: number;
  metric?: {
    value: string;
    label: string;
  };
}

export type ChatRole = "user" | "bot" | "error";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

export interface ChatWebhookRequest {
  sessionId: string;
  message: string;
}

export interface ChatWebhookResponse {
  reply: string;
  sessionId: string;
}

export interface WhyComparison {
  id: string;
  aspect: string;
  before: string;
  after: string;
  icon: string;
  detail: string;
  metric: string;
  metricLabel: string;
}

export interface WhyExpendeskData {
  badge: string;
  heading: { lead: string; highlight: string };
  subheading: string;
  columns: {
    aspect: string;
    before: { label: string; caption: string };
    after: { label: string; caption: string; tag: string };
  };
  comparisons: WhyComparison[];
  cta: {
    heading: string;
    subheading: string;
    body: string;
    highlights: string[];
    prompt: string;
    button: string;
    buttonHref: string;
    secondaryButton: { label: string; href: string };
    trustPoints: string[];
    note: string;
  };
}
