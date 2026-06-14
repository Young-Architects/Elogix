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
