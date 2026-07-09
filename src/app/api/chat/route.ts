/**
 * POST /api/chat — server-side proxy to the n8n chat workflow.
 *
 * The browser never sees N8N_CHAT_WEBHOOK_URL or N8N_CHAT_SECRET. Both are
 * server-only env vars (no NEXT_PUBLIC_ prefix), so the shared secret is never
 * inlined into the client bundle and the n8n webhook can safely reject any
 * request that doesn't carry it.
 *
 * Request:  POST /api/chat
 *           Body: { "sessionId": "…", "message": "…" }
 * Response: { "reply": "…", "sessionId": "…" }
 */

import { NextResponse, type NextRequest } from 'next/server';
import type { ChatWebhookResponse } from '@/types';

/**
 * The n8n agent regularly takes 20s+ to answer, which blows past the 10s that
 * serverless platforms allow a function by default. Raise the ceiling, and keep
 * the upstream timeout below it so a slow workflow yields our own 502 instead of
 * the platform killing the function and returning an opaque error page.
 */
export const maxDuration = 60;
const UPSTREAM_TIMEOUT_MS = 45_000;

const MAX_MESSAGE_LENGTH = 2_000;

/**
 * n8n's "Respond to Webhook" node returns different shapes depending on how the
 * workflow is wired: a bare object, a single-element array, and a payload keyed
 * `reply`, `output` (AI Agent default), or `text`. Accept all of them so a
 * workflow tweak doesn't silently break the widget.
 */
function extractReply(data: unknown): string | null {
  const node = Array.isArray(data) ? data[0] : data;
  if (typeof node === 'string') return node.trim() || null;
  if (!node || typeof node !== 'object') return null;

  for (const key of ['reply', 'output', 'text', 'message'] as const) {
    const value = (node as Record<string, unknown>)[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
  const secret = process.env.N8N_CHAT_SECRET;

  if (!webhookUrl || !secret) {
    console.error(
      '[api/chat] N8N_CHAT_WEBHOOK_URL and/or N8N_CHAT_SECRET are not configured.'
    );
    return NextResponse.json(
      { error: 'Chat is not configured.' },
      { status: 500 }
    );
  }

  let body: { sessionId?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!sessionId || !message) {
    return NextResponse.json(
      { error: '`sessionId` and `message` are required.' },
      { status: 400 }
    );
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 413 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-chat-secret': secret,
      },
      body: JSON.stringify({ sessionId, message }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    console.error('[api/chat] Upstream request failed:', error);
    return NextResponse.json(
      { error: 'The assistant is unreachable.' },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    console.error(`[api/chat] Upstream responded ${upstream.status}.`);
    return NextResponse.json(
      { error: 'The assistant returned an error.' },
      { status: 502 }
    );
  }

  let reply: string | null;
  try {
    reply = extractReply(await upstream.json());
  } catch {
    reply = null;
  }

  if (!reply) {
    console.error('[api/chat] Upstream returned no usable reply.');
    return NextResponse.json(
      { error: 'The assistant returned an empty reply.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ reply, sessionId } satisfies ChatWebhookResponse);
}
