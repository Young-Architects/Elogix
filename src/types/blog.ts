/**
 * Type definitions for the Blog to JSON WordPress REST API.
 * Mirrors the schema produced by Blog_To_Json_Serializer / Blog_To_Json_Parser.
 *
 * API base: {WORDPRESS_URL}/wp-json/blog-to-json/v1
 */

/** Inline CSS captured from style="" attributes, kebab-case keys. */
export type BlockStyling = Record<string, string>;

/** A contiguous span of text with the formatting that applies to it. */
export interface TextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  highlight?: boolean;
  link?: string;
  styling?: BlockStyling;
}

interface BaseBlock {
  styling?: BlockStyling;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  runs?: TextRun[];
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
  runs?: TextRun[];
  /** Present when the paragraph was a bare top-level <a>. */
  link?: string;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  runs?: TextRun[];
  cite?: string;
}

export interface ListItem {
  text: string;
  runs?: TextRun[];
  styling?: BlockStyling;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  style: 'ordered' | 'unordered';
  items: ListItem[];
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt?: string;
  caption?: string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  text: string;
  language?: string;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  rows: string[][];
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed';
  src: string;
}

export interface SeparatorBlock extends BaseBlock {
  type: 'separator';
}

/** Fallback for anything the parser didn't recognise — content is never dropped. */
export interface UnknownBlock extends BaseBlock {
  type: 'unknown';
  tag?: string;
  text?: string;
  html?: string;
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | QuoteBlock
  | ListBlock
  | ImageBlock
  | CodeBlock
  | TableBlock
  | EmbedBlock
  | SeparatorBlock
  | UnknownBlock;

export interface BlogAuthor {
  id: number;
  name: string;
}

export interface FeaturedImage {
  url: string | null;
  alt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  link: string;
  status: string;
  date: string; // ISO 8601
  modified: string; // ISO 8601
  excerpt: string;
  content: ContentBlock[];
  author: BlogAuthor;
  categories: string[];
  tags: string[];
  featured_image: FeaturedImage | null;
  meta: Record<string, unknown>;
}

export interface BlogListResponse {
  total: number;
  total_pages: number;
  page: number;
  per_page: number;
  posts: BlogPost[];
}
