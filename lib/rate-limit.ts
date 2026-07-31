import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter — the first layer of brute-force /
 * spam defence in front of the contact endpoint.
 *
 * Best-effort by design: serverless instances don't share memory and a cold
 * start clears the map, so this throttles a burst per running instance rather
 * than guaranteeing a global cap. That's enough to blunt scripted floods;
 * hCaptcha + the honeypot are the primary bot defences. Swap in a shared store
 * (e.g. Upstash Redis) if you need a distributed, durable guarantee.
 */

type Window = { count: number; reset: number };

const buckets = new Map<string, Window>();

// Bound the map so a flood of unique keys (spoofed IPs) can't grow memory
// without limit. When full we prune expired entries, then the oldest half.
const MAX_KEYS = 10_000;

export type RateLimitResult = {
  /** false → over the limit for this window. */
  ok: boolean;
  /** Requests left in the current window (0 when blocked). */
  remaining: number;
  /** Seconds until the window resets (for a `Retry-After` header). */
  retryAfter: number;
};

/**
 * Count one hit against `key` and report whether it's within `limit` per
 * `windowMs`. Each call increments the counter, so call once per request.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  let win = buckets.get(key);

  if (!win || win.reset <= now) {
    if (buckets.size >= MAX_KEYS) prune(now);
    win = { count: 0, reset: now + windowMs };
    buckets.set(key, win);
  }

  win.count += 1;
  const retryAfter = Math.max(0, Math.ceil((win.reset - now) / 1000));
  return {
    ok: win.count <= limit,
    remaining: Math.max(0, limit - win.count),
    retryAfter,
  };
}

function prune(now: number) {
  for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
  if (buckets.size < MAX_KEYS) return;
  // All still live — evict the oldest-resetting half to bound memory.
  const byAge = [...buckets.entries()].sort((a, b) => a[1].reset - b[1].reset);
  for (let i = 0; i < Math.ceil(byAge.length / 2); i++) buckets.delete(byAge[i][0]);
}
