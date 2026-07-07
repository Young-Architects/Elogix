/**
 * Renders the Blog to JSON `content` block array as real React elements.
 * No dangerouslySetInnerHTML for regular content — every block type maps to
 * semantic HTML, so any structure an author creates in WordPress renders here.
 *
 * Security hardening on top of the raw API output:
 *  - inline styling passes through a small denylist (no position/fixed hacks)
 *  - embeds only render from an allowlist of trusted iframe hosts
 *  - links get safe rel attributes; javascript: URLs are dropped
 */

import { Fragment, type CSSProperties, type ReactNode } from 'react';
import type {
  BlockStyling,
  ContentBlock,
  ListItem,
  TextRun,
} from '@/types/blog';

/* ------------------------------------------------------------------ */
/* Styling helpers                                                     */
/* ------------------------------------------------------------------ */

/** CSS properties an author should never be able to inject from post HTML.
 *  min-width/min-height are blocked because they beat the max-width clamp in
 *  globals.css that keeps CMS-sized blocks from overflowing small screens. */
const BLOCKED_STYLE_PROPS = new Set([
  'position',
  'z-index',
  'top',
  'left',
  'right',
  'bottom',
  'content',
  'behavior',
  'expression',
  'min-width',
  'min-height',
]);

function kebabToCamel(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function toReactStyle(styling?: BlockStyling): CSSProperties | undefined {
  if (!styling) return undefined;
  const style: Record<string, string> = {};
  for (const [prop, value] of Object.entries(styling)) {
    const key = prop.trim().toLowerCase();
    if (BLOCKED_STYLE_PROPS.has(key)) continue;
    if (/url\s*\(|expression\s*\(/i.test(value)) continue;
    // Negative margins can drag content outside the column on phones.
    if (key.startsWith('margin') && value.includes('-')) continue;
    style[kebabToCamel(key)] = value;
  }
  return Object.keys(style).length ? (style as CSSProperties) : undefined;
}

/* ------------------------------------------------------------------ */
/* Link / embed safety                                                 */
/* ------------------------------------------------------------------ */

function safeHref(href?: string): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return undefined;
  return trimmed;
}

/** Hosts allowed to render as <iframe> embeds. Extend as needed. */
const EMBED_ALLOWLIST = [
  'youtube.com',
  'youtube-nocookie.com',
  'youtu.be',
  'player.vimeo.com',
  'open.spotify.com',
  'w.soundcloud.com',
  'codepen.io',
  'codesandbox.io',
  'google.com', // maps
];

function isAllowedEmbed(src: string): boolean {
  try {
    const host = new URL(src).hostname.replace(/^www\./, '');
    return EMBED_ALLOWLIST.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Run rendering (inline formatting)                                   */
/* ------------------------------------------------------------------ */

function renderRun(run: TextRun, key: number): ReactNode {
  // Preserve intentional line breaks produced by <br> in WordPress.
  let node: ReactNode = run.text.includes('\n')
    ? run.text.split('\n').map((part, i, arr) => (
        <Fragment key={i}>
          {part}
          {i < arr.length - 1 && <br />}
        </Fragment>
      ))
    : run.text;

  if (run.superscript) node = <sup>{node}</sup>;
  if (run.subscript) node = <sub>{node}</sub>;
  if (run.code) node = <code>{node}</code>;
  if (run.highlight) node = <mark>{node}</mark>;
  if (run.strike) node = <s>{node}</s>;
  if (run.underline) node = <u>{node}</u>;
  if (run.italic) node = <em>{node}</em>;
  if (run.bold) node = <strong>{node}</strong>;

  const href = safeHref(run.link);
  if (href) {
    const external = /^https?:\/\//i.test(href);
    node = (
      <a
        href={href}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {node}
      </a>
    );
  }

  const style = toReactStyle(run.styling);
  if (style) node = <span style={style}>{node}</span>;

  return <Fragment key={key}>{node}</Fragment>;
}

function renderRuns(runs: TextRun[] | undefined, fallback?: string): ReactNode {
  if (!Array.isArray(runs) || runs.length === 0) return fallback ?? '';
  return runs.map((run, i) => renderRun(run, i));
}

/* ------------------------------------------------------------------ */
/* Block rendering                                                     */
/* ------------------------------------------------------------------ */

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function renderListItems(items: ListItem[]): ReactNode {
  return items.map((item, i) => (
    <li key={i} style={toReactStyle(item.styling)}>
      {renderRuns(item.runs, item.text)}
    </li>
  ));
}

function renderBlock(block: ContentBlock, key: number): ReactNode {
  const style = toReactStyle(block.styling);

  switch (block.type) {
    case 'heading': {
      // Post title is the page's h1 — demote in-content h1s to h2 for SEO/a11y.
      const level = Math.min(6, Math.max(2, block.level)) as 2 | 3 | 4 | 5 | 6;
      const Tag = HEADING_TAGS[level - 1];
      return (
        <Tag key={key} id={slugifyHeading(block.text)} style={style}>
          {renderRuns(block.runs, block.text)}
        </Tag>
      );
    }

    case 'paragraph':
      return (
        <p key={key} style={style}>
          {renderRuns(block.runs, block.text)}
        </p>
      );

    case 'quote':
      return (
        <blockquote key={key} style={style}>
          <p>{renderRuns(block.runs, block.text)}</p>
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      );

    case 'list': {
      const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={key} style={style}>
          {renderListItems(block.items)}
        </ListTag>
      );
    }

    case 'image': {
      const src = safeHref(block.src);
      if (!src) return null;
      return (
        <figure key={key} style={style}>
          {/* Content images come with unknown dimensions from WP, so a plain
              img with lazy loading is the pragmatic choice here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={block.alt || ''} loading="lazy" decoding="async" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    }

    case 'code':
      return (
        <pre key={key} style={style} data-language={block.language || undefined}>
          <code
            className={
              block.language ? `language-${block.language}` : undefined
            }
          >
            {block.text}
          </code>
        </pre>
      );

    case 'table':
      return (
        <div key={key} className="blog-table-scroll">
          <table style={style}>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    r === 0 ? <th key={c}>{cell}</th> : <td key={c}>{cell}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'embed': {
      const src = safeHref(block.src);
      if (!src || !isAllowedEmbed(src)) return null;
      return (
        <div key={key} className="blog-embed">
          <iframe
            src={src}
            style={style}
            allowFullScreen
            loading="lazy"
            title="Embedded content"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          />
        </div>
      );
    }

    case 'separator':
      return <hr key={key} style={style} />;

    case 'unknown':
    default: {
      const text = 'text' in block ? block.text : undefined;
      // Render unknown elements as plain text — never inject their raw HTML.
      return text ? (
        <p key={key} style={style}>
          {text}
        </p>
      ) : null;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

export default function BlogContent({ content }: { content: ContentBlock[] }) {
  if (!Array.isArray(content)) return null;
  return (
    <div className="blog-content">
      {content.map((block, i) => renderBlock(block, i))}
    </div>
  );
}
