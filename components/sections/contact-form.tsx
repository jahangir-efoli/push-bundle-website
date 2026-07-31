"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Contact form (docs/PLAN.md §5.4; backend per docs/cmd.md).
 *
 * Client-side validation + accessible inline errors, then a real async submit
 * to `/api/contact` (which throttles, checks the honeypot, and forwards to the
 * CMS). Bot defence is layered: a hidden honeypot field + an hCaptcha widget
 * rendered when the CMS reports `hcaptchaEnabled` (its site key arrives as a
 * prop from the server). Shows submitting / success / error states.
 */

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

/** hCaptcha config resolved on the server (from the CMS site-config endpoint). */
export type ContactHcaptcha = {
  enabled: boolean;
  siteKey: string | null;
};

/** Localized form copy (defaults are English). */
export type ContactFormContent = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  errors: {
    name: string;
    emailRequired: string;
    emailInvalid: string;
    subject: string;
    message: string;
  };
  successTitle: string;
  successBody: string;
  sendAnother: string;
  // Optional (English fallbacks used when a locale hasn't added them yet).
  sending?: string;
  submitError?: string;
  captchaRequired?: string;
};

const DEFAULT_CONTENT: ContactFormContent = {
  nameLabel: "Full Name",
  namePlaceholder: "Enter your name",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  subjectLabel: "Subject",
  subjectPlaceholder: "Enter a subject",
  messageLabel: "Your Message",
  messagePlaceholder: "Enter your message",
  submit: "Submit Form",
  errors: {
    name: "Please enter your name.",
    emailRequired: "Please enter your email.",
    emailInvalid: "Please enter a valid email.",
    subject: "Please enter a subject.",
    message: "Please enter a message.",
  },
  successTitle: "Thanks — message received!",
  successBody: "We'll get back to you within 24 hours.",
  sendAnother: "Send another message",
  sending: "Sending…",
  submitError: "Something went wrong. Please try again.",
  captchaRequired: "Please complete the anti-bot check.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- hCaptcha loader (explicit render, injected once, only when needed) ------

type Hcaptcha = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove?: (id: string) => void;
};
declare global {
  interface Window {
    hcaptcha?: Hcaptcha;
  }
}

let hcaptchaLoader: Promise<void> | null = null;
function loadHcaptcha(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.hcaptcha) return Promise.resolve();
  if (hcaptchaLoader) return hcaptchaLoader;
  hcaptchaLoader = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      hcaptchaLoader = null; // allow a later retry
      reject(new Error("hCaptcha failed to load"));
    };
    document.head.appendChild(s);
  });
  return hcaptchaLoader;
}

export function ContactForm({
  content = DEFAULT_CONTENT,
  hcaptcha,
}: {
  content?: ContactFormContent;
  hcaptcha?: ContactHcaptcha;
} = {}) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const captchaOn = Boolean(hcaptcha?.enabled && hcaptcha.siteKey);

  // Render the hCaptcha widget when enabled and the form is visible. Re-runs
  // after "send another" (sent → false) remounts a fresh, empty container.
  useEffect(() => {
    if (sent || !captchaOn || !hcaptcha?.siteKey) return;
    let cancelled = false;
    loadHcaptcha()
      .then(() => {
        const el = captchaRef.current;
        // Guard against a double render (Strict Mode) into a populated box.
        if (cancelled || !el || !window.hcaptcha || el.childElementCount > 0)
          return;
        widgetIdRef.current = window.hcaptcha.render(el, {
          sitekey: hcaptcha.siteKey,
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(null),
          "error-callback": () => setToken(null),
        });
      })
      .catch(() => {
        // Widget couldn't load (offline / blocked). Leave it absent; the CMS
        // remains the authority and will reject a token-less submit if required.
      });
    return () => {
      cancelled = true;
    };
  }, [sent, captchaOn, hcaptcha?.siteKey]);

  const resetCaptcha = () => {
    setToken(null);
    if (window.hcaptcha && widgetIdRef.current !== null) {
      window.hcaptcha.reset(widgetIdRef.current);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users leave it empty (server also enforces this).
    if (data.get("company")) return;

    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = content.errors.name;
    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = content.errors.emailRequired;
    else if (!EMAIL_RE.test(email)) next.email = content.errors.emailInvalid;
    if (!String(data.get("subject") ?? "").trim())
      next.subject = content.errors.subject;
    if (!String(data.get("message") ?? "").trim())
      next.message = content.errors.message;

    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    // Require a solved captcha when enabled.
    if (captchaOn && !token) {
      setFormError(content.captchaRequired ?? DEFAULT_CONTENT.captchaRequired!);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          company: data.get("company"), // honeypot (server re-checks)
          hcaptchaToken: token ?? undefined,
        }),
      });

      if (res.ok) {
        setSent(true);
        form.reset();
        resetCaptcha();
        return;
      }

      const err = (await res.json().catch(() => ({}))) as { error?: string };
      setFormError(
        err.error ?? content.submitError ?? DEFAULT_CONTENT.submitError!,
      );
      resetCaptcha(); // a spent/expired token can't be reused
    } catch {
      setFormError(content.submitError ?? DEFAULT_CONTENT.submitError!);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center"
      >
        <p className="font-display text-xl font-bold text-foreground">
          {content.successTitle}
        </p>
        <p className="mt-2 text-muted">{content.successBody}</p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setSent(false)}
        >
          {content.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
    >
      {/* Honeypot — visually hidden, off the tab order */}
      <div aria-hidden="true" className="hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label={content.nameLabel}
            name="name"
            placeholder={content.namePlaceholder}
            error={errors.name}
            maxLength={200}
            required
          />
          <Input
            label={content.emailLabel}
            name="email"
            type="email"
            placeholder={content.emailPlaceholder}
            error={errors.email}
            maxLength={320}
            required
          />
        </div>
        <Input
          label={content.subjectLabel}
          name="subject"
          placeholder={content.subjectPlaceholder}
          error={errors.subject}
          maxLength={300}
          required
        />
        <Textarea
          label={content.messageLabel}
          name="message"
          placeholder={content.messagePlaceholder}
          error={errors.message}
          maxLength={5000}
          required
        />

        {/* hCaptcha widget — only when the CMS enables it. */}
        {captchaOn && <div ref={captchaRef} className="min-h-19.5" />}

        {/* Server / network error (validation errors show inline per-field). */}
        {formError && (
          <p role="alert" className="text-sm font-medium text-error-foreground">
            {formError}
          </p>
        )}

        <div>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting
              ? (content.sending ?? DEFAULT_CONTENT.sending!)
              : content.submit}
          </Button>
        </div>
      </div>
    </form>
  );
}
