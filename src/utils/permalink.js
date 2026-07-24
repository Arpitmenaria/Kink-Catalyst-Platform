/**
 * Public permalink for a post.
 *
 * /p/:id is served by the Vercel function in api/p.js, which renders Open Graph
 * tags so WhatsApp/Facebook/Telegram show the post's photo and caption, then
 * bounces real browsers into the app at /?post=<id>.
 *
 * Built off window.location.origin so it follows whichever environment it runs
 * in. Note that link previews only render for publicly reachable origins —
 * on localhost the link still works, but WhatsApp can't crawl it.
 */
export function postPermalink(postId) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/p/${postId}`;
}

/** Reads the post id out of /?post=<id>, used to auto-open the detail modal. */
export function readSharedPostId() {
  if (typeof window === 'undefined') return null;
  const id = new URLSearchParams(window.location.search).get('post');
  return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
}

/** Drops ?post= from the URL bar without a reload, once the modal has opened. */
export function clearSharedPostId() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('post');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

/**
 * Keeps ?post= mirrored to whichever post detail modal is currently open —
 * set when opened (from a notification click, not just a shared link),
 * cleared when closed — so refreshing while the modal is open reopens the
 * same post instead of losing it.
 */
export function syncSharedPostId(postId) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (postId) url.searchParams.set('post', postId);
  else url.searchParams.delete('post');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}
