import "server-only";
import { CMS_BASE, CMS_SITE, CMS_ENABLED } from "./http/client";

/**
 * Contact-form CMS integration (docs/cmd.md — Site config + Contact form).
 *
 * Two calls: `getContactConfig()` reads the hCaptcha config the widget needs
 * (public site key only — the secret stays server-side in the CMS), and
 * `submitContact()` POSTs the message. The browser never hits the CMS directly;
 * it goes through `/api/contact`, which adds throttling + a honeypot first.
 */

export type ContactConfig = {
  hcaptchaSiteKey: string | null;
  hcaptchaEnabled: boolean;
};

/**
 * hCaptcha config for the contact form. Fails safe: if the CMS is unconfigured
 * or unreachable we return "disabled" so the page still renders — the CMS is
 * still the authority and will reject a token-less POST if it truly requires one.
 */
export async function getContactConfig(): Promise<ContactConfig> {
  if (!CMS_ENABLED) return { hcaptchaSiteKey: null, hcaptchaEnabled: false };
  try {
    const res = await fetch(
      `${CMS_BASE}/api/public/site-config?site=${encodeURIComponent(CMS_SITE)}`,
      {
        // Config rarely changes; cache an hour and share the "cms" tag so an
        // on-demand revalidation clears it too.
        next: { revalidate: 3600, tags: ["cms"] },
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) throw new Error(`site-config ${res.status}`);
    const data = (await res.json()) as Partial<ContactConfig>;
    const siteKey = data.hcaptchaSiteKey ?? null;
    return {
      hcaptchaSiteKey: siteKey,
      // Only enable when both the flag AND a key are present.
      hcaptchaEnabled: Boolean(data.hcaptchaEnabled && siteKey),
    };
  } catch {
    return { hcaptchaSiteKey: null, hcaptchaEnabled: false };
  }
}

export type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  hcaptchaToken?: string;
};

export type ContactResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

/**
 * Submit the message to the CMS. Surfaces the CMS's own `{ error }` message
 * (e.g. "hCaptcha verification failed") with its status so the caller can relay
 * it, and maps network/config failures to sensible statuses.
 */
export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResult> {
  if (!CMS_ENABLED) {
    return { ok: false, status: 503, error: "Contact form is not configured." };
  }

  let res: Response;
  try {
    res = await fetch(`${CMS_BASE}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ site: CMS_SITE, ...payload }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 502, error: "Could not reach the mail service." };
  }

  if (res.ok) return { ok: true };

  let error = "Submission failed. Please try again.";
  try {
    const body = (await res.json()) as { error?: string };
    if (body?.error) error = body.error;
  } catch {
    // non-JSON error body — keep the generic message
  }
  return { ok: false, status: res.status, error };
}
