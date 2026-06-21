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
  visitorId: string;
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
    body: string;
    prompt: string;
    button: string;
    trustPoints: string[];
    note: string;
  };
}
