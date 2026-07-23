/**
 * Contact content (docs/PLAN.md §5.4) — copy verbatim from the extracted site.
 * Phone + address values are still pending from the client (§9 #6a); the
 * placeholders below are clearly marked and must be replaced before launch.
 */

export const contactCopy = {
  eyebrow: "Contact us",
  title: "Let's talk bundling",
  subtitle:
    "Ran into a bundling challenge or have an idea to improve your store? We'd love to hear from you. Let's chat and explore how we can turn smart ideas into powerful solutions.",
  tagline: "Reach Out Anytime",
  taglineBody:
    "Call us, book a meeting, or drop your project details below. We'll get back to you within 24 hours. Promise!",
} as const;

/** ⚠️ Placeholder values — replace with real details before launch (§9 #6a). */
export const contactDetails = {
  email: "support@pushbundle.com",
  phone: "+971 00 000 0000", // PLACEHOLDER
  address: "Dubai, United Arab Emirates", // PLACEHOLDER (WhenLab F.Z.C)
  hours: "Monday–Friday",
} as const;

export const contactMethods = [
  {
    icon: "cart",
    title: "Send an Email",
    body: "Got something on your mind or facing any issues? Drop us an email. We are all ears and happy to help you.",
    action: "Email us",
    kind: "email",
  },
  {
    icon: "sparkles",
    title: "Let's Chat",
    body: "Have questions? Our team is here for you Monday to Friday, almost around the clock.",
    action: "Start live chat",
    kind: "chat", // Tawk.to — wired in Phase 9
  },
  {
    icon: "calendar",
    title: "Set a Meeting",
    body: "Prefer a face-to-screen? Book a meeting and let's talk about bundling, your way.",
    action: "Book a meeting",
    kind: "meeting", // Calendly — wired in Phase 9
  },
] as const;
