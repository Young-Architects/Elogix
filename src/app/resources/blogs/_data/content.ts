/**
 * All copy for the /resources/blogs routes. Nothing inline in components,
 * per the project convention (see the solutions pages' _data/content.ts).
 */

export interface BlogListingContent {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  featuredLabel: string;
  latestLabel: string;
  categoryLabel: string;
  clearFilter: string;
  errorState: { heading: string; body: string };
  emptyState: { heading: string; body: string };
}

export interface BlogSidebarContent {
  cta: {
    heading: string;
    body: string;
    button: string;
    buttonHref: string;
    secondary: string;
    secondaryHref: string;
  };
  recentHeading: string;
  categoriesHeading: string;
}

export interface BlogPostContent {
  backLink: string;
  updatedPrefix: string;
  readTimeSuffix: string;
  tagsLabel: string;
  shareLabel: string;
  fallbackAuthor: string;
  notFound: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: string;
  };
}

export const listing: BlogListingContent = {
  eyebrow: 'Resources',
  heading: 'Insights for smarter',
  headingAccent: 'expense management',
  intro:
    'Guides, playbooks and product updates from the Expendesk team — everything finance teams need to automate spend, speed up approvals and stay in control.',
  metaTitle: 'Blog',
  metaDescription:
    'Insights, guides, and product updates on expense management from the Expendesk team.',
  featuredLabel: 'Featured',
  latestLabel: 'Latest articles',
  categoryLabel: 'Category',
  clearFilter: 'View all posts',
  errorState: {
    heading: 'Posts are temporarily unavailable',
    body: "We couldn't reach the blog service. Refresh the page to try again.",
  },
  emptyState: {
    heading: 'No posts yet',
    body: "New articles will appear here as soon as they're published.",
  },
};

export const sidebar: BlogSidebarContent = {
  cta: {
    heading: 'Ready to take control of your expenses?',
    body: 'See how Expendesk automates approvals, reimbursements and reporting for growing finance teams.',
    button: 'Book a Demo',
    buttonHref: '/contact-us',
    secondary: 'Talk to our team',
    secondaryHref: '/contact-sales',
  },
  recentHeading: 'Recent Posts',
  categoriesHeading: 'Categories',
};

export const post: BlogPostContent = {
  backLink: 'Back to all posts',
  updatedPrefix: 'Updated',
  readTimeSuffix: 'min read',
  tagsLabel: 'Tags:',
  shareLabel: 'Share this:',
  fallbackAuthor: 'Expendesk Team',
  notFound: {
    eyebrow: '404',
    heading: 'Post not found',
    body: 'This article may have been unpublished or moved.',
    cta: 'Browse all posts',
  },
};

export const content = { listing, sidebar, post };
