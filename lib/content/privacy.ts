/**
 * Privacy Policy content (docs/PLAN.md §5.10). Section structure matches the
 * extracted old site (§3 Page 9).
 *
 * ⚠️ DRAFT LEGAL COPY — the body text below is a reasonable rendering of a
 * standard policy for build purposes. It must be reviewed and approved by the
 * client's legal team, and reconciled with the exact live-site wording, before
 * launch. The "last updated" date must also be set to the real effective date.
 */

export const privacyMeta = {
  title: "Privacy Policy",
  lastUpdated: "July 2026", // PLACEHOLDER — set the real effective date
  entity: "WhenLab F.Z.C",
  contactEmail: "support@pushbundle.com",
  intro:
    "This Privacy Policy explains how PushBundle, operated by WhenLab F.Z.C, collects, uses, protects, and shares information when you use our website and Shopify application.",
} as const;

export type PolicySection = {
  id: string;
  heading: string;
  body: string[];
};

export const privacySections: PolicySection[] = [
  {
    id: "information-collected",
    heading: "Information Collected",
    body: [
      "We collect information you provide directly, such as your name, email address, and store details when you contact us or install the app. We also collect information automatically, including device, usage, and location data, and information from cookies and similar technologies.",
      "When you connect our Shopify app, we access store data necessary to provide bundling features, in line with the permissions you grant during installation.",
    ],
  },
  {
    id: "use-of-information",
    heading: "Use of Information",
    body: [
      "We use collected information to deliver and improve our services, provide support, detect and prevent fraud, communicate with you, and publish anonymized, aggregated statistics.",
      "We do not sell your personal information.",
    ],
  },
  {
    id: "protecting-and-sharing",
    heading: "Protecting, Securing, and Sharing of Information",
    body: [
      "We apply appropriate technical and organizational measures to protect your information. We may share information with your consent, with trusted third-party processors who act on our behalf, when required by law or legal process, with internal staff who need it to operate the service, and as non-personal, aggregated data.",
      "Any third-party processors are bound by obligations consistent with this policy.",
    ],
  },
  {
    id: "storing-and-deleting",
    heading: "Storing and Deleting of Information",
    body: [
      "We retain information only as long as necessary for the purposes described here or as required by law. You may request to access, transfer, rectify, erase, or restrict the processing of your personal information.",
    ],
  },
  {
    id: "business-ownership",
    heading: "Changes in Business Ownership and Control",
    body: [
      "If our business is sold or merges with another organization, your information may be transferred to the new owners so the service can continue. Any such transfer will remain subject to protections consistent with this policy.",
    ],
  },
  {
    id: "changes-to-policy",
    heading: "Changes to this Privacy Policy",
    body: [
      "We may modify this policy from time to time. Updates take effect when posted, and your continued use of the service constitutes acceptance of the revised policy.",
    ],
  },
  {
    id: "gdpr-rights",
    heading: "DPA and GDPR Subject Rights",
    body: [
      "If you are located in the EU, EEA, or Switzerland, you have rights under the GDPR, including the rights to access, rectify, erase, restrict, and port your data, and to object to processing. We process personal data on lawful bases including performance of a contract, legitimate business interest, and consent.",
      "This policy is administered in accordance with applicable data protection law.",
    ],
  },
  {
    id: "childrens-privacy",
    heading: "Children's Privacy",
    body: [
      "Our services are not directed to children. We do not knowingly collect personally identifiable information from anyone under 13. If you believe a child has provided us personal information, please contact us and we will take steps to delete it.",
    ],
  },
  {
    id: "updates",
    heading: "Updates to this Privacy Policy",
    body: [
      "We are committed to notifying users of significant changes through a prominent notice on our website. For questions about this policy, contact us at support@pushbundle.com.",
    ],
  },
];
