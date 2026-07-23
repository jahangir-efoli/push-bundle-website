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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users leave it empty.
    if (data.get("company")) return;

    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Please enter your name.";
    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email)) next.email = "Please enter a valid email.";
    if (!String(data.get("subject") ?? "").trim())
      next.subject = "Please enter a subject.";
    if (!String(data.get("message") ?? "").trim())
      next.message = "Please enter a message.";

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
          Thanks — message received!
        </p>
        <p className="mt-2 text-muted">
          We&rsquo;ll get back to you within 24 hours.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setSent(false)}
        >
          Send another message
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
          <Input label="Full Name" name="name" error={errors.name} required />
          <Input
            label="Email"
            name="email"
            type="email"
            error={errors.email}
            required
          />
        </div>
        <Input label="Subject" name="subject" error={errors.subject} required />
        <Textarea
          label="Your Message"
          name="message"
          error={errors.message}
          required
        />
        <div>
          <Button type="submit" size="lg">
            Submit Form
          </Button>
        </div>
      </div>
    </form>
  );
}
