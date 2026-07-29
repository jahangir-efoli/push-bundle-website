"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Contact form (docs/PLAN.md §5.4).
 *
 * Client-side validation + accessible inline errors today; the real submit
 * handler (email/CRM backend) is wired in Phase 9 (§9 #12). Currently shows a
 * success state without sending. Includes a honeypot for basic spam defence.
 */

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

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
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({
  content = DEFAULT_CONTENT,
}: {
  content?: ContactFormContent;
} = {}) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users leave it empty.
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

    // Phase 9: POST to the real handler here.
    setSent(true);
    form.reset();
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
            required
          />
          <Input
            label={content.emailLabel}
            name="email"
            type="email"
            placeholder={content.emailPlaceholder}
            error={errors.email}
            required
          />
        </div>
        <Input
          label={content.subjectLabel}
          name="subject"
          placeholder={content.subjectPlaceholder}
          error={errors.subject}
          required
        />
        <Textarea
          label={content.messageLabel}
          name="message"
          placeholder={content.messagePlaceholder}
          error={errors.message}
          required
        />
        <div>
          <Button type="submit" size="lg">
            {content.submit}
          </Button>
        </div>
      </div>
    </form>
  );
}
