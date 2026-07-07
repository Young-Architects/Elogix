<?php
/**
 * Plugin Name: Blog to JSON — Next.js Revalidation Webhook
 * Description: Pings the Next.js site's /api/revalidate endpoint whenever a post is published, updated, trashed or deleted, so the website reflects blog changes instantly.
 * Version:     1.0.0
 * Author:      Expendesk
 *
 * INSTALL
 *   1. Edit the two constants below (site URL + secret).
 *   2. Upload this file to wp-content/plugins/ (or wp-content/mu-plugins/ to
 *      make it always-on) and activate it in WP Admin → Plugins.
 *
 * The secret must match REVALIDATE_SECRET in the Next.js environment.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** ── Configuration ─────────────────────────────────────────────────────── */

/** Public origin of the Next.js site (no trailing slash). */
const BTJ_NEXTJS_ORIGIN = 'https://your-nextjs-site.com';

/** Must equal the REVALIDATE_SECRET env var on the Next.js side. */
const BTJ_REVALIDATE_SECRET = 'change-me';

/** ── Implementation ────────────────────────────────────────────────────── */

/**
 * Notify Next.js that a post changed.
 *
 * @param string $slug Post slug whose cached page should be purged.
 */
function btj_notify_nextjs($slug)
{
    $response = wp_remote_post(BTJ_NEXTJS_ORIGIN . '/api/revalidate', array(
        'timeout' => 5,
        'headers' => array(
            'Content-Type'        => 'application/json',
            'x-revalidate-secret' => BTJ_REVALIDATE_SECRET,
        ),
        'body' => wp_json_encode(array('slug' => $slug)),
    ));

    if (is_wp_error($response)) {
        error_log('[blog-to-json-webhook] revalidate failed: ' . $response->get_error_message());
    }
}

/**
 * Fires on every post status transition (publish, update, trash, restore…).
 * Only standard posts trigger revalidation; drafts moving between non-public
 * states are ignored because the public site never showed them.
 */
function btj_on_transition($new_status, $old_status, $post)
{
    if ($post->post_type !== 'post') {
        return;
    }
    if ($new_status !== 'publish' && $old_status !== 'publish') {
        return; // never was public and still isn't — nothing cached to purge
    }
    btj_notify_nextjs($post->post_name);
}
add_action('transition_post_status', 'btj_on_transition', 10, 3);

/** Permanent deletion doesn't always fire a status transition — cover it too. */
function btj_on_delete($post_id)
{
    $post = get_post($post_id);
    if ($post && $post->post_type === 'post') {
        btj_notify_nextjs($post->post_name);
    }
}
add_action('before_delete_post', 'btj_on_delete');
