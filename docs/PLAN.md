# PushBundle Website — Build Plan

> Living planning document for the new PushBundle app website.
> Built on Next.js 16 (App Router, React 19) + Tailwind 4. **Planning only — no implementation code yet.**

_Last updated: 2026-07-14_

---

## 1. Overview

- **Product:** PushBundle — a **Shopify bundle app** that increases Average Order Value (AOV) via mix & match bundles, volume discounts, upsells, and B2B bundle tools.
- **Goal:** Drive Shopify app installs; educate merchants on bundling to boost AOV/conversions.
- **Primary audience:** Shopify merchants — both **retail (B2C)** and **wholesale (B2B)** stores; Shopify Plus supported.
- **Primary CTA:** **Install Free on Shopify** (secondary: View Demo / Start 14-Day Free Trial).
- **Company:** WhenLab F.Z.C. Sibling apps: MultiVariants, DiscountRay, Order Rules, Quotway, Embedup.
- **Support:** support@pushbundle.com
- **Shopify App Store:** https://apps.shopify.com/push-bundle — Install CTAs link here.
  - **Rating: 4.9 / 5 (16 reviews)** — 94% 5-star, 6% 4-star. **"Built for Shopify"** badge.
  - Store name/tagline: "Push Bundle ‑ Build a Box App" — "BYOB Mix and Match Bundle Builder with discounts & free gifts". Launched **Jun 23 2025**.
  - Compatibility (proof points for new site): Checkout, Shopify POS, Admin, **Markets/multi-currency**, PageFly, GemPages.
  - Categories: Product bundles · Discounts · Marketing and conversion.
  - Real review quotes: "Support is quick. It covers basic bundle functions at a relatively low price." — バイオガイアヨーグルト工房 (JP) · "Great support team. Answers fast and always correct." — oatme (BG) · "Wonderful experience with excellent customer service." — PAWsitively Organic Dog Bakery (US).

## 2. Requirements

> Consolidated from the user across the planning conversation (2026-07-10 → 07-14). Details live in the referenced sections.

**Functional**
- Rebuild the PushBundle marketing website on **Next.js 16 + Tailwind 4** (content re-used from old site; design/code fresh). (§3, §5)
- **7-language** site: English default (no URL prefix), others prefixed; UI/marketing manual, dynamic content from CMS. (§8)
- All dynamic content (**Blog, Docs, FAQ, Changelog, Partners, Reviews**) from the **existing headless CMS via API**, wired later; build API-agnostic with demo data now. (§7)
- **Auto-updating `sitemap.xml`** generated from CMS. (§4.3)
- **FAQ** is a net-new page. (§5.5)
- Contact via **Tawk.to chat + Calendly + phone/address**; form to a real handler. (§5.4)
- URL scheme: **no trailing slash**, preserve old slugs, 301-redirect legacy URLs. (§8)

**Non-functional (quality bars)**
- **Nice, smooth animations** (Motion) + **"super smooth" scroll** (Lenis), reduced-motion safe. (§6)
- **Lightweight & loads first** — Lighthouse mobile ≥95, LCP <2s, ~≤100KB first-load JS; progressive enhancement. (§7)
- **Responsive** — mobile-first, fluid, tested 320→1920px. (§6)
- **Accessible** — WCAG 2.1 AA, axe/Lighthouse gate in CI. (§6)
- **Great-looking** — typography system, design-system kit, dark mode, signature moments. (§6)
- **One-place rebrand** — two-layer design tokens; change ~10 primitives to re-skin. (§6)
- **Playwright + Chromium** for automated responsive/a11y/visual/perf checks. (§7)

**Brand**
- Color scheme derived from the logo (indigo→cyan gradient). Primary `#2C5BF0`. (§6)
- **Shopify App Store is the source of truth** for pricing/dates/features/rating. (§1, §9)

## 3. Old Site — Content Inventory

> Content extracted page-by-page from the existing site. Design/code is NOT carried over — content only.

| # | Old URL | Page | Status | Notes |
|---|---------|------|--------|-------|
| 1 | https://pushbundle.com/ | Homepage | ✅ Extracted | See below |
| 2 | https://pushbundle.com/pricing/ | Pricing | ✅ Extracted | 2 tiers, monthly/yearly toggle |
| 3 | https://pushbundle.com/about-us/ | About us | ✅ Extracted | No team/stats; mission/vision |
| 4 | https://pushbundle.com/contact-us/ | Contact us | ✅ Extracted | Form + 3 contact methods |
| 5 | https://pushbundle.com/partner/ | Partners | ✅ Extracted | Singular `/partner/`; showcase, not a program |
| 6 | https://pushbundle.com/docs/ | Docs | ✅ Extracted | Small docs (2 categories, ~7 articles) |
| 7 | https://pushbundle.com/blog/ | Blog | ✅ Extracted | ~54 posts, 6 pages, 7 categories, archives |
| 8 | _(none yet)_ | FAQ | 🆕 To build | **Does not exist on old site** — build new |
| 9 | https://pushbundle.com/privacy-policy/ | Privacy Policy | ✅ Extracted | 9 sections; GDPR |
| 10 | https://pushbundle.com/changelog/ | Changelog | ✅ Extracted | 17 entries, badge categories |

_All 10 old-site pages fetched & extracted (exact URLs confirmed). FAQ is the only net-new page._

### Extracted content

#### Page 1 — Homepage (`https://pushbundle.com/`) — extracted 2026-07-14

**Nav:** Home · Pricing · About us · Contact us · Resources (Partners, Docs, Blog) · CTA: **Try the app on Shopify**

**Hero**
- H1: *"Boost Your AOV and Sell More With the Best Shopify Bundle App"*
- Body: *"Whether selling to retail shoppers or wholesale buyers, Push Bundle gives you mix & match, volume discounts, upsells, and B2B bundle tools. All designed to convert."*
- CTAs: **Install Free on Shopify** · **View Demo**

**Features (3-up)**
1. **Multiple Bundling Options** — "A complete toolkit to create mix & match bundles, multi-product packs, and volume discount deals that drive higher order values."
2. **Dynamic Bundle Previews with One-Click Customization** — "Watch bundles come to life in the user's preferred style using flexible bundle previews and advanced customization to match the store's feel."
3. **Powerful Bundle Scheduling** — "Launch perfectly timed promotions for holidays, flash sales, or campaigns with automated start/end dates that maximize urgency and conversions."

**"Bigger Orders with Smart Bundling" (3 blocks, each CTA "Explore More")**
1. **Personalized Bundles That Grow Your AOV & Revenue** — "Let customers build custom packs with their favorite variants, unlocking exclusive deals that drive repeat sales and bigger orders."
2. **Mix and Match Bundles to Boost AOV on Your B2B Shopify Store** — "PushBundle's customizable product packs let your customers mix and match across variants or products, unlocking exclusive volume discounts and encouraging larger orders."
3. **Fixed Product Bundles with Bulk Discounts** — "Create simple, irresistible deals by setting custom product packs at fixed prices. Ideal for B2B stores looking to boost AOV and conversions with no-code bundle builder ease."

**"Next-Level Bundling: Dynamic Storefront Personalization"** — subhead: "Maximize Profits with Smart Bundle Displays"
- **Frictionless Checkout Integration:** Advanced discount logic via Shopify Scripts · No manual adjustments needed · Works seamlessly with Shopify Plus
- **High-Converting Visual Experience:** Stunning, intuitive bundle displays · Mobile-optimized interface · One-click add-to-cart for bundles
- **Proven Sales Impact:** Lift AOV by 20–30% with smart upsells · Reduce cart abandonment by 15%+ · Boost conversions with decision-simplifying bundles

**"Seamless Mobile Bundling Experience"** (CTA "See More")
- **Flawless Mobile Responsiveness:** "Every bundle display auto-adapts to all screen sizes for a pixel-perfect shopping experience on any device."
- **Intuitive Tap-to-Select Design:** Browse with thumb-friendly navigation · Customize packs in 2–3 taps · Check out in seconds
- **Lightning-Fast Performance:** Instant bundle loading (under 2s) · Zero lag when switching variants · Smooth scrolling

**Features Coming Soon:** Mix n match bundle (Same Product) · Customized bundle (step-by-step from multiple products) · Mixed product bundle · Fixed bundle · Variant fixed quantity bundle (same product) · Limited edition bundle (limited quantity)

**"Expert Reads" (Blog teaser)** — intro: "Discover B2B strategies in our latest articles… your roadmap to higher conversions and smarter bundling on Shopify." (CTA "View All"). Recent posts:
- Jul 9, 2026 — "Fixed vs Mix and Match Bundle: What Shopify's Spring 2026 Update Means for Your Store"
- Jun 30, 2026 — "PushBundle vs Bundler: Which Shopify Bundle App Is Worth It in 2026?"
- Jun 29, 2026 — "Best Cross-Sell Apps on Shopify in 2026 to Boost AOV Without More Ads"
- Jun 29, 2026 — "5 Best Shopify Bundle Apps for Jeans and Bottoms: Sell More in 2026"
- Jun 18, 2026 — "Shopify Native Bundles Limitations: Mix and Match, BOGO, and Build-a-Box Explained"
- Jun 16, 2026 — "Best Shopify Volume Bundle Apps for B2B and Wholesale Stores in 2026"

**Trial CTA band** — H: "Unlock PushBundle's Full Potential – Risk-Free!" / body: "Get started with one click and discover how smarter bundling can transform your sales." / CTA: **Start 14 Days Free Trial**

**FAQ** — H: "Have you got any questions?" (link "More Faq"). Questions: What types of bundles can I create? · Can shoppers choose their own product variants? · Does PushBundle support discounts for bundles? · Is PushBundle easy to set up? · Can I limit bundle discounts to specific collections/products? _(Note: live answers are placeholder-duplicated — need real answers.)_ Footer line: "Didn't find the answer… Contact Our Support"

**Footer**
- Description: "Create high-converting Mix & Match bundles and custom product packs that shoppers love while automatically increasing your average order value"
- Useful Links: Contact us · FAQ · Privacy Policy · Changelog
- Other apps by WhenLab: MultiVariants – Bulk Order · DiscountRay – B2B Discounts · Order Rules · Quotway · Embedup
- Newsletter: "Subscribe to our Newsletter" — "Get the latest strategies, deals, and bundle optimization tips…" (Subscribe)
- Contact: support@pushbundle.com
- Social: Facebook · LinkedIn · Twitter · YouTube
- Copyright: "Copyright @WhenLab F.Z.C 2026. All Rights Reserved."
- Languages: English · 日本語 · Français · Deutsch · Español · 简体中文 · Italiano

#### Page 2 — Pricing (`https://pushbundle.com/pricing/`) — extracted 2026-07-14

- **Page title/meta:** "PushBundle Pricing | Flexible Shopify Bundle Plans"
- **Intro:** "At PushBundle, we offer flexible pricing plans to fit your unique business needs."
- **Billing toggle:** Monthly ↔ Yearly ("Save 20% yearly")

**Tier 1 — Starter** — **Free Forever**
- Tagline: "Basic features for new businesses" · CTA: **Get it on Shopify**
- Features: Volume Bundle · Percentage discount · Fixed discount on total · Discount on Fixed Quantity · Discount on custom quantity range · Customer tag based discount · Discount on specific customers · Different display style · Live preview

**Tier 2 — Growth** *(Most Popular)* — **$14.00/month** or **$148.00/year** · "Get 14 Days Free Trial"
- Tagline: "Advanced tools to boost sales and AOV" · CTA: **Get it on Shopify**
- Features: All Starter features + Mix and Match – Build a box · Sell Mix and match in different pack size · Multipack discount · Variant restriction · Limit quantity per variant · Customer tag-based bundle · Specific client based bundle · Custom bundle icon upload · Basic customization · Custom CSS

**Trial CTA band** (reused from homepage): "Unlock PushBundle's Full Potential – Risk-Free!" / "Get started with one click…" / CTA: **Start 14 Days Free Trial**

_Note: only 2 tiers currently. No pricing FAQ or comparison table on the live page._
_⚠️ Correction (Shopify = source of truth): Growth yearly price is **$134.40/yr** ($14×12×20% off), not the $148/yr shown on the old site. Use $134.40 on the new Pricing page._

#### Page 3 — About us (`https://pushbundle.com/about-us/`) — extracted 2026-07-14

- **Page title/meta:** "Meet the Team Behind PushBundle | Shopify Bundle App"
- **Intro (About Us):** "Get to know PushBundle - why we built it, who we built it for, and how we're helping merchants around the world unlock smarter, more scalable bundling in Shopify."

**Who We Are** — "We kept hearing it: 'I want customers to build their own packs, but I can't control pack sizes or variants.' Most apps didn't get the complexity of B2B bundling. So we built PushBundle, a no-code Shopify app with full control over mix-and-match bundles, MOQs, volume discounts, and multi-pack pricing. No workarounds, just smart bundling that scales. **Built in Dubai, made for global merchants.** If you've ever felt boxed in by bundle apps, we built PushBundle for you."

**Our Mission** — "At WhenLab, We're on a mission to redefine e-commerce success for merchants who've outgrown 'simple bundles.' PushBundle was built from real Shopify pain points…"
- "Turn pack sizes, variant rules, and MOQs into growth tools, not roadblocks."
- "Help you boost AOV with powerful volume discounts and multi-pack pricing."
- "Be the go-to bundle discount app for merchants who need control, creativity, and results."

**Our Vision** — "We believe bundling should be a growth strategy, not a technical hurdle." / "Our vision is to lead a new era of bundling on Shopify… without limitations, without code, and without guesswork. We're building the most trusted, powerful bundling app for serious merchants…"

**The Smarter Way to Bundle on Shopify** — "PushBundle helps you build bundles your way. Set your own rules, offer bulk deals, and let shoppers mix and match what they love. More sales, less stress."

**Feature grid (6):**
1. **Effortless Bundle Creation** — "Easily build, edit, and manage bundles with a dashboard designed for busy merchants."
2. **Sell More with Smart Bundles** — "Boost your average order value with flexible discounts that match how customers shop."
3. **Create Bundles They'll Love** — "Offer eye-catching, mix-and-match bundles that keep customers engaged and coming back."
4. **Built to Grow With You** — "Whether you're selling locally or going global, PushBundle scales with your store at every stage."
5. **Smart Pricing, Always On** — "Set it and forget it. PushBundle adjusts bundle pricing based on stock or customer behavior."
6. **Schedule Sales in Advance** — "Plan flash deals or seasonal promos ahead of time. PushBundle takes care of the timing for you."

**Trial CTA band + FAQ + Footer:** same shared blocks as homepage (§ Page 1).

_Note: despite the meta title "Meet the Team," there are **no team member names/photos, no stats/milestones** on the live page — opportunity to add real team/company proof on the new site._

#### Page 4 — Contact us (`https://pushbundle.com/contact-us/`) — extracted 2026-07-14

- **H1:** "Contact Us"
- **Intro:** "Ran into a bundling challenge or have an idea to improve your store? We'd love to hear from you. Let's chat and explore how we can turn smart ideas into powerful solutions."
- **Tagline:** "Reach Out Anytime" — "Call us, book a meeting, or drop your project details below. We'll get back to you within 24 hours. Promise!"

**Contact form** — fields: Full Name · Email · Subject · Your Message · CTA: **Submit Form**

**Three contact-method cards:**
1. **Send an Email** — "Got something on your mind or facing any issues? Drop us an email. We are all ears and happy to help you." → support@pushbundle.com
2. **Let's Chat** — "Have questions? Our team is here for you Monday to Friday, almost around the clock." → CTA **Live Chat**
3. **Set a Meeting** — "Prefer a face-to-screen? Book a meeting and let's talk about bundling, your way." → CTA **Google Meet**

**FAQ + Trial CTA band + Footer:** same shared blocks as homepage (§ Page 1).

_New-site decisions (2026-07-14): wire **Tawk.to** live chat (replaces "Live Chat"), **Calendly** for "Set a Meeting" (replaces raw Google Meet), and **add a real phone number + physical (Dubai) address** on Contact + footer. **→ Need the actual phone number + address from client.** Contact form posts to a real handler (accessible labels/inline errors per §6)._

#### Page 5 — Partners (`https://pushbundle.com/partner/`) — extracted 2026-07-14

- **URL is singular** `/partner/` (not `/partners`). **Page title:** "PushBundle Partners | Shopify Bundle Discount App Partners"
- **H1:** "Our Partners" — "We love working with the best in the Shopify ecosystem. By partnering with leading apps and services, we deliver powerful, scalable bundling solutions…"
- **Subhead:** "EXPLORE OUR PARTNERS"

**Featured partners (4 cards, each CTA "Visit"):**
1. **MultiVariants – Bulk Order** — "Multivariants lets customers easily select multiple product variants, order in bulk, and speed up checkout with a single click…"
2. **DiscountRay – Custom Price** — "Maximize your store's sales and (AOV) with powerful, flexible, and automatic discount features."
3. **EmbedUp – Affiliate Buy Button** — "Turn any website, landing page, or blog into a powerful headless sales channel."
4. **Transtore: Language & Currency Solution** — "Auto-translate in 20+ languages, 163+ currency switcher, geolocation redirects, multilingual SEO, glossary consistency & image localization - no coding needed."

**Trial CTA band + Footer:** shared blocks (§ Page 1).

_Note: this is a **partner/integration showcase**, NOT a partner *program* — no tiers, commissions, benefits, or application form. Decision for new site: keep as a showcase, or build a real affiliate/agency partner program?_

#### Page 6 — Docs (`https://pushbundle.com/docs/`) — extracted 2026-07-14

**Documentation IA (2 categories, ~7 articles):**

- **Getting Started** (2)
  - Installation
  - "How to Add the PushBundle App Block to Your Shopify Theme?"
- **Setup Process** (5)
  - Mix and Match Single Product
  - "How to setup volume bundle?"
  - "How to apply quantity restriction on each variants?"
  - "How to offer discount for Mix and Match bundle?"
  - "What is 'Number of Variants' and 'Quantity per Variants' limit?"

**Docs FAQ topics:** Discount Types (Flat Discount vs. Discount on Each Variant) · Box Icon & Pack Size Configuration (number of variants, quantity per variant) · Multiple Bundle Purchases · Mix and Match definition · Bundle Visibility troubleshooting (activation status, theme integration, cache clearing).

_Note: docs are **small** right now. New-site decision: keep a lightweight docs section, or plan a scalable docs IA (categories + search) fed from CMS/MDX for growth (ties to §7 CMS decision + `nextjs-seo-website` docs pattern)._

#### Page 7 — Blog index (`https://pushbundle.com/blog/`) — extracted 2026-07-14

- **Page title:** "PushBundle Blog | Shopify Bundling A-Z, Tips, Best Practices"
- **H1:** "Articles" — intro: "We're committed to empowering Shopify merchants with actionable insights. Dive into our expert-curated articles filled with bundling strategies, AOV-boosting tips, and the latest e-commerce trends…"
- **Scale:** ~**54 posts**, **6 pages**, **10 per page**, `[1][2][3][4][5]…[6] Next »`
- **Author model:** e.g. "Written by: Syeda Rehnoma Tanzom | Reviewed by: Technical Support Team" → posts have **author + reviewer**.
- **Post URL pattern:** `/blog/{slug}/`

**Categories (7):** Case Studies · Holiday Season · Product Bundle · Shopify Bundle · Top Shopify Apps for Merchants · Updates · Use Case

**Monthly archive counts:** 2026 — Jul(1) Jun(6) May(4) Apr(4) Mar(3) Feb(4) Jan(3); 2025 — Dec(2) Nov(5) Oct(4) Sep(3) Aug(3) Jul(3) Jun(3) May(3) Apr(3). _(≈54 total.)_

**Page-1 posts (title · date · slug):**
1. Fixed vs Mix and Match Bundle: What Shopify's Spring 2026 Update Means for Your Store · Jul 9 2026 · `/blog/fixed-vs-mix-and-match-bundle/`
2. PushBundle vs Bundler: Which Shopify Bundle App Is Worth It in 2026? · Jun 30 2026 · `/blog/pushbundle-vs-bundler/`
3. Best Cross-Sell Apps on Shopify in 2026 to Boost AOV Without More Ads · Jun 29 2026 · `/blog/best-cross-sell-apps-on-shopify/`
4. 5 Best Shopify Bundle Apps for Jeans and Bottoms: Sell More in 2026 · Jun 29 2026 · `/blog/shopify-bundle-apps-for-jeans-and-bottoms/`
5. Shopify Native Bundles Limitations: Mix and Match, BOGO, and Build-a-Box Explained · Jun 18 2026 · `/blog/shopify-native-bundles-limitations/`
6. Best Shopify Volume Bundle Apps for B2B and Wholesale Stores in 2026 · Jun 16 2026 · `/blog/shopify-volume-bundle-apps/`
7. The Best BYOB Shopify Apps for Merchants Who Want a Real Build-Your-Own Bundle Experience · Jun 4 2026 · `/blog/best-byob-shopify-apps/`
8. How to Increase Shopify AOV with Bundle Apps: Top 5 Compared (No-Code Setup) · May 26 2026 · `/blog/increase-shopify-aov-with-bundle-apps/`
9. What is Mix and Match on Shopify? (And Why Shoppers Keep Coming Back for It) · May 21 2026 · `/blog/what-is-mix-and-match-on-shopify/`
10. Chameleon Colors Made $21,946 Letting Customers Build Their Own Color Bundle — Here's Exactly How · May 13 2026 · `/blog/chameleon-colors-with-pushbundle/`

**Sidebar:** category filter · monthly archive · newsletter. Mid-page Trial CTA band + shared footer.

_Blog implications for new site: needs a real content model (**index + pagination + category pages + monthly archives + single post with author/reviewer**), SEO (per-post metadata, JSON-LD `BlogPosting`/`Article`, breadcrumbs), and localization (§8). Strongly favors a **CMS + ISR + on-demand revalidation** (§7 CMS decision) — ~54 posts is too many for hardcoding. **Legacy URL preservation:** keep `/blog/{slug}/` slugs to avoid losing SEO (ties to `nextjs-seo-website` legacy-redirect pattern)._

#### Page 10 — Changelog (`https://pushbundle.com/changelog/`) — extracted 2026-07-14

- **Page title:** "PushBundle Changelog | Shopify Bundle App Updates, Evaluation"
- **Structure:** reverse-chronological entries, each with **date · title · category badge · description**. Badge categories used: **New Feature · Improved · Fixed · Recognition · Launch**.
- **17 entries, Jun 2025 → Mar 2026:**

| Date | Category | Title |
|---|---|---|
| Mar 26 2026 | Improved | Images Can be Added to Volume Bundle Packs |
| Mar 22 2026 | New Feature | Enhanced Volume Bundles with Advanced Offer Options (Free Shipping, Free Gifts, discounts) |
| Mar 18 2026 | New Feature | New Volume Bundle Selection Methods (Conventional & Modern) |
| Mar 15 2026 | Improved | Redesigned Volume Bundle Creation Flow |
| Mar 5 2026 | Fixed | Cross-Sell Bundle Stability Improvements |
| Feb 17 2026 | Improved | Improved Installation & Free Trial Experience (auto 14-day trial, max plan) |
| Jan 28 2026 | Recognition | PushBundle is Now **Built for Shopify** (badge) |
| Jan 15 2026 | New Feature | Guided Setup for Faster Onboarding |
| Jan 8 2026 | Improved | Dashboard Improvements for App Embed & App Blocks |
| Dec 30 2025 | Improved | Performance Optimization Improvements |
| Dec 5 2025 | Fixed | Volume Bundles Now Support Quantity Starting at 1 |
| Dec 1 2025 | Improved | Cleaner Price Display on Product Pages |
| Nov 10 2025 | Improved | Improved Bundle Price Calculation for Fixed Pricing |
| Sep 25 2025 | New Feature | 🎁 Cross-Sell Bundles – Recommend. Pair. Convert. |
| Jul 30 2025 | New Feature | 🎁 Mix & Match Multi-Product Bundles |
| Jun 20 2025 | Launch | First version of Push Bundle app for Shopify released |

_Key facts surfaced: launched **Jun 20 2025**; earned **"Built for Shopify"** badge Jan 28 2026 (trust signal — use on new site). New-site decision: changelog is another **content-collection** (CMS/MDX) with badge filters + optional "subscribe to updates". No subscribe/notify CTA on current page._

#### Page 9 — Privacy Policy (`https://pushbundle.com/privacy-policy/`) — extracted 2026-07-14

- **Page title:** "PushBundle Privacy Policy | Data Protection and Security"
- **Legal entity:** WhenLab F.Z.C · **Privacy contact:** support@pushbundle.com · **Last-updated date:** not shown (policy says updates take effect immediately) → **add an explicit "Last updated" date on the new site.**
- **Sections (9, ordered):** 1) Information Collected · 2) Use of Information · 3) Protecting, Securing, and Sharing of Information · 4) Storing and Deleting of Information · 5) Changes in Business Ownership and Control · 6) Changes to this Privacy Policy · 7) DPA and GDPR Subject Rights · 8) Children's Privacy (under-13) · 9) Updates to this Privacy Policy
- **Compliance:** GDPR (EU/Swiss rights, lawful grounds) · Data Protection Act 1998 · cookies consent-based (browser toggle) · third-party data processors bound by same standards.

_New-site notes: this is a **legal/static long-form page** (single-column, TOC anchor nav, "last updated" stamp). Localize per §8. Likely siblings needed: **Terms of Service**, **Cookie Policy**, **GDPR/DPA** — confirm which exist. Ties into the §7 cookie-consent / analytics gating._

#### Page 8 — FAQ (NEW — to be built) — 2026-07-14

- **Does NOT exist on the old site** — the footer/inline "More Faq" links have no dedicated page. **We will build a dedicated FAQ page on the new site.**
- **Seed questions** (currently repeated inline across Home/About/Contact, with placeholder answers): 
  1. What types of bundles can I create with PushBundle?
  2. Can shoppers choose their own product variants for a bundle?
  3. Does PushBundle support discounts for bundles?
  4. Is PushBundle easy to set up on my Shopify store?
  5. Can I limit bundle discounts to specific collections or products?
- **⚠️ Need real answers** — live answers are all placeholder-duplicated ("You can create various bundles…"). Requires proper copy per question.
- **Plan:** dedicated `/faq` page with categorized Q&A (accordions), **`FAQPage` JSON-LD** for SEO/AEO (helps AI answer engines per skills), searchable, localized (§8). Inline homepage FAQ pulls from the same single source (one data file → §6 single-source discipline). More questions to be gathered (pricing, billing, B2B, install, troubleshooting).

## 4. Sitemap (New Site)

> Proposed page structure. URLs shown for **English (default, no prefix)**. Every route also exists under each locale prefix: `/de`, `/fr`, `/es`, `/it`, `/ja`, `/zh` (§8). No trailing slash; old trailing-slash URLs 301-redirect (§8).

### 4.1 Route map

**Static / marketing pages** — code + `next-intl` message files (manual translation)

| Path | Page | Notes |
|---|---|---|
| `/` | Home | Hero → features → AOV blocks → storefront → mobile → coming-soon → blog teaser → trial CTA → FAQ teaser |
| `/pricing` | Pricing | 2 tiers + monthly/yearly toggle |
| `/about-us` | About us | Story, mission, vision, feature grid (+ real team/proof — new) |
| `/contact-us` | Contact us | Form + Tawk.to chat + Calendly + phone/address |
| `/faq` | FAQ | **NEW** — categorized accordions + `FAQPage` JSON-LD |
| `/privacy-policy` | Privacy Policy | Legal long-form + TOC + "last updated" (only legal page) |

**Dynamic pages** — from the headless CMS via API (demo/fixture data until API wired)

| Path | Page | Notes |
|---|---|---|
| `/partner` | Partners | CMS-driven showcase (singular slug preserved) |
| `/blog` | Blog index | Paginated |
| `/blog/page/[n]` | Blog pagination | SEO-friendly numbered pages (rel prev/next metadata) |
| `/blog/[slug]` | Blog post | Author + reviewer, `Article` JSON-LD, breadcrumbs, related |
| `/blog/category/[category]` | Category archive | 7 categories (paginated) |
| ~~`/blog/[year]/[month]`~~ | Monthly archive | **Not built** — old monthly-archive URLs **301-redirect → `/blog`** (see §8) |
| `/docs` | Docs home | Categories (Getting Started, Setup Process, …) + search |
| `/docs/[slug]` | Doc article | `Article`/`TechArticle` JSON-LD, prev/next, sidebar |
| `/changelog` | Changelog | Entries + badge-category filter (New/Improved/Fixed/…) |

**System / SEO routes** (not in nav)

| Path | Purpose |
|---|---|
| `/sitemap.xml` | **Auto-generated** sitemap (see §4.3) |
| `/robots.txt` | Env-gated robots + AI-bot allowlist |
| `/llms.txt` | AEO/GEO answer surface |
| `/opengraph-image` | Generated OG image (+ per-page variants) |
| `/not-found` (404) | Branded 404 |

### 4.2 Navigation & footer (from extracted content)

- **Header nav:** Home · Pricing · About us · Contact us · **Resources** ▾ (Partners, Docs, Blog, **Changelog**) · **CTA: Install Free on Shopify** · language switcher · theme toggle. _(Changelog lives under Resources dropdown + footer, matching old-site footer placement — not a standalone top-level nav item.)_
- **Footer:** brand blurb · Useful Links (Contact, FAQ, Privacy Policy, Changelog) · Other WhenLab apps (MultiVariants, DiscountRay, Order Rules, Quotway, Embedup) · Newsletter signup · support@pushbundle.com · social (Facebook, LinkedIn, Twitter, YouTube) · language switcher · "Built for Shopify" badge · copyright.

### 4.3 Auto-updating `sitemap.xml` (decided 2026-07-14)

The sitemap **regenerates itself from the CMS** — no manual editing when content changes.

- **Implementation:** Next.js `app/sitemap.ts` (async). It combines:
  1. **Static routes** — a hardcoded list of marketing/legal pages.
  2. **Dynamic routes** — fetched at build/revalidate time from the CMS adapter: all blog slugs, categories, doc slugs, changelog, partners. New CMS content ⇒ new sitemap entries automatically.
- **Localized:** every entry emits `alternates.languages` (`hreflang`) for all 7 locales + `x-default` → English, generated from `i18n/config.ts` (one source).
- **`lastModified`:** taken from each item's CMS `updatedAt` so search engines see accurate freshness.
- **Stays fresh automatically:** the sitemap route is revalidated via **ISR + on-demand revalidation** — the CMS publish webhook that revalidates content also revalidates `/sitemap.xml`. So publishing a post updates the live sitemap within seconds, untouched by hand.
- **Scale:** ~54 posts × 7 locales ≈ 380 URLs + others — well under the 50k/50MB limit, so a single sitemap works now. If it ever grows past the limit, switch to Next's `generateSitemaps()` to emit a **sitemap index** + chunked children (noted, not needed yet).
- **Resilience:** if the CMS API is unavailable at generation time, fall back to the last-known/static routes so the sitemap never 500s (per `nextjs-seo-website` resilient-sitemap pattern).
- **`robots.txt`** references the sitemap URL; production-gated (staging stays noindex, §7/skills).

## 5. Per-Page Content Outline

> Section-by-section outline for each new page. Copy in quotes is from the extracted old site (§3); _italic bracketed notes_ are new/needs-copy. Every section respects §6 (motion, color, a11y, responsive) and §7 (perf).

### 5.1 Home (`/`)

**Goal:** convert Shopify merchants (retail + B2B) to install the app. **Primary CTA everywhere:** Install Free on Shopify. **Secondary:** View Demo / Start 14-Day Free Trial.

**Section order (top → bottom):**

1. **Header / Nav** (global) — logo · Home · Pricing · About us · Contact us · Resources ▾ (Partners, Docs, Blog, Changelog) · language switcher · theme toggle · **CTA: Install Free on Shopify**. Sticky, condenses on scroll. Mobile → accessible drawer. Skip-to-content link.

2. **Hero** — *LCP section; CSS-first, no animation dependency for first paint.*
   - H1: "Boost Your AOV and Sell More With the Best Shopify Bundle App"
   - Sub: "Whether selling to retail shoppers or wholesale buyers, Push Bundle gives you mix & match, volume discounts, upsells, and B2B bundle tools. All designed to convert."
   - CTAs: **Install Free on Shopify** (primary, gradient) · **View Demo** (secondary, outline)
   - Trust strip: **"Built for Shopify" badge** + **4.9★ (16 reviews)** on the Shopify App Store + compatibility marks (Checkout, POS, Markets). _(Rating/count ideally pulled live/periodically; static fallback 4.9/16.)_
   - Visual: animated product/bundle mockup (`next/image`, priority) with subtle aurora gradient bg.

3. **Feature trio (3-up)** — heading _[needs short intro]_; scroll-reveal cards:
   1. **Multiple Bundling Options** — "A complete toolkit to create mix & match bundles, multi-product packs, and volume discount deals that drive higher order values."
   2. **Dynamic Bundle Previews with One-Click Customization** — "Watch bundles come to life in the user's preferred style using flexible bundle previews and advanced customization to match the store's feel."
   3. **Powerful Bundle Scheduling** — "Launch perfectly timed promotions for holidays, flash sales, or campaigns with automated start/end dates that maximize urgency and conversions."

4. **"Bigger Orders with Smart Bundling"** — 3 alternating image/text rows, each CTA **Explore More**:
   1. **Personalized Bundles That Grow Your AOV & Revenue** — "Let customers build custom packs with their favorite variants, unlocking exclusive deals that drive repeat sales and bigger orders."
   2. **Mix and Match Bundles to Boost AOV on Your B2B Shopify Store** — "PushBundle's customizable product packs let your customers mix and match across variants or products, unlocking exclusive volume discounts and encouraging larger orders."
   3. **Fixed Product Bundles with Bulk Discounts** — "Create simple, irresistible deals by setting custom product packs at fixed prices. Ideal for B2B stores looking to boost AOV and conversions with no-code bundle builder ease."

5. **"Next-Level Bundling: Dynamic Storefront Personalization"** — subhead "Maximize Profits with Smart Bundle Displays". 3 columns:
   - **Frictionless Checkout Integration:** Advanced discount logic via Shopify Scripts · No manual adjustments needed · Works seamlessly with Shopify Plus
   - **High-Converting Visual Experience:** Stunning, intuitive bundle displays · Mobile-optimized interface · One-click add-to-cart for bundles
   - **Proven Sales Impact:** "Lift AOV by 20–30% with smart upsells" · "Reduce cart abandonment by 15%+" · "Boost conversions with decision-simplifying bundles"
   - _Emphasis/dark or gradient section (§6). Stats can animate count-up on reveal (reduced-motion safe)._

6. **"Seamless Mobile Bundling Experience"** — CTA **See More**. 3 blocks:
   - **Flawless Mobile Responsiveness** — "Every bundle display auto-adapts to all screen sizes for a pixel-perfect shopping experience on any device."
   - **Intuitive Tap-to-Select Design** — Browse with thumb-friendly navigation · Customize packs in 2–3 taps · Check out in seconds
   - **Lightning-Fast Performance** — Instant bundle loading (under 2s) · Zero lag when switching variants · Smooth scrolling
   - Visual: phone mockup, optional device-frame animation.

7. **Features Coming Soon** — badge list (roadmap teaser): Mix n match bundle (Same Product) · Customized bundle (step-by-step from multiple products) · Mixed product bundle · Fixed bundle · Variant fixed quantity bundle · Limited edition bundle.

8. **Reviews / Social proof** _[NEW]_ — **CMS-driven** reviews section. Pulls merchant reviews from the CMS (`Review` model): reviewer name, store/company, avatar/logo, star rating, quote, optional source (Shopify App Store). Layout: **rating summary (4.9★ · 16 reviews)** + review cards (carousel/grid, scroll-reveal). Optional case-study highlight (e.g. "Chameleon Colors Made $21,946…"). Powers `Review`/`AggregateRating` JSON-LD. Seed demo data from the 3 real Shopify reviews (§1); real set from CMS. Link out to the Shopify App Store reviews.

9. **"Expert Reads" (Blog teaser)** — intro: "Discover B2B strategies in our latest articles… your roadmap to higher conversions and smarter bundling on Shopify." Pull **latest 3 posts from CMS** (title, date, image, link). CTA **View All** → `/blog`.

10. **Trial CTA band** — H: "Unlock PushBundle's Full Potential – Risk-Free!" / body: "Get started with one click and discover how smarter bundling can transform your sales." / CTA: **Start 14 Days Free Trial**. (Gradient emphasis band.)

11. **FAQ teaser** — H: "Have you got any questions?" + short intro. Show **top 5 questions from CMS** (accordions). Link **More FAQ** → `/faq`. _Real answers needed (§9 #3)._

12. **Footer** (global) — brand blurb · Useful Links (Contact us, FAQ, Privacy Policy, Changelog) · Other WhenLab apps (MultiVariants, DiscountRay, Order Rules, Quotway, Embedup) · Newsletter signup ("Subscribe to our Newsletter" …) · support@pushbundle.com · social (Facebook, LinkedIn, Twitter, YouTube) · language switcher · "Built for Shopify" badge · "Copyright @WhenLab F.Z.C 2026. All Rights Reserved."

**SEO/structured data:** `SoftwareApplication`/`Product` JSON-LD (app + **`AggregateRating` from the CMS reviews**), `Review`, `Organization`, `FAQPage` (from the FAQ teaser), `BreadcrumbList`. Localized metadata + OG. **Reused global components:** Header, Footer, TrialCTA band, FAQ block, Newsletter — shared across pages, single source each.

### 5.2 Pricing (`/pricing`)

**Goal:** convert to install by making the free tier obvious and the Growth upgrade compelling. **Meta:** "PushBundle Pricing | Flexible Shopify Bundle Plans".

**Section order:**

1. **Header / Nav** (global).

2. **Pricing hero** — H1: _[e.g. "Simple, flexible pricing that scales with your store"]_ · intro: "At PushBundle, we offer flexible pricing plans to fit your unique business needs." · **billing toggle: Monthly ↔ Yearly (Save 20%)**.

3. **Plan cards (2 tiers, toggle-driven):**
   - **Starter — Free Forever** — "Basic features for new businesses" · CTA **Get it on Shopify** (→ Shopify App Store).
     - Volume Bundle · Percentage discount · Fixed discount on total · Discount on Fixed Quantity · Discount on custom quantity range · Customer tag based discount · Discount on specific customers · Different display style · Live preview · _(+ from listing: scheduled bundles, customer eligibility rules, built-in layouts, 24/7 support)_
   - **Growth — $14/month** _or_ **$134.40/year** *(Most Popular badge · gradient border)* — "Advanced tools to boost sales and AOV" · "Get 14 Days Free Trial" · CTA **Get it on Shopify**.
     - Everything in Starter, **plus**: Mix and Match – Build a box · Sell Mix and match in different pack size · Multipack discount · Variant restriction · Limit quantity per variant · Customer tag-based bundle · Specific client based bundle · Custom bundle icon upload · Basic customization · Custom CSS · _(+ from listing: cross-sell bundles, advanced rules)_
   - Toggle behavior: Yearly shows **$134.40/yr** with a "**Save 20%**" chip (was $148 on old site → use $134.40). Monthly shows **$14/mo**.

4. **Feature comparison table** _[NEW — recommended]_ — Starter vs Growth across all capabilities (rows grouped: Bundle types, Discounts, Targeting, Customization, Support). Clearer than two bullet lists; good for SEO/AEO. Sticky header row on scroll; horizontal-scroll container on mobile (§6 responsive).

5. **Trust band** — Built for Shopify · **4.9★ (16 reviews)** · compatibility (Checkout, POS, Markets, PageFly, GemPages). Reassures before upgrade.

6. **Pricing FAQ** _[NEW]_ — billing-specific Q&A from CMS (`FaqItem` filtered to "pricing"): "Is there a free plan?" · "How does the 14-day trial work?" · "Can I switch plans?" · "What happens after the trial?" · "Do you offer refunds?" _(needs real answers — §9 #3)._ `FAQPage` JSON-LD.

7. **Trial CTA band** (shared) — "Unlock PushBundle's Full Potential – Risk-Free!" → **Start 14 Days Free Trial**.

8. **Footer** (global).

**SEO/structured data:** `Product`/`SoftwareApplication` with `Offer`s (Free + $14/mo), `AggregateRating` (4.9/16), `FAQPage`, `BreadcrumbList`. Localized metadata + OG. Prices localized/formatted via `Intl` (§8), but plan amounts sourced from Shopify (USD).

### 5.3 About us (`/about-us`)

**Goal:** build trust and brand story; convert curiosity → install. **Meta:** "Meet the Team Behind PushBundle | Shopify Bundle App".

**Section order:**

1. **Header / Nav** (global).

2. **About hero** — H1: "About Us" · intro: "Get to know PushBundle - why we built it, who we built it for, and how we're helping merchants around the world unlock smarter, more scalable bundling in Shopify." · subtle gradient bg + optional stat row _(from listing/CMS: 4.9★, Built for Shopify, launched Jun 2025, merchants served — needs number)_.

3. **Who We Are** — "We kept hearing it: 'I want customers to build their own packs, but I can't control pack sizes or variants.' Most apps didn't get the complexity of B2B bundling. So we built PushBundle, a no-code Shopify app with full control over mix-and-match bundles, MOQs, volume discounts, and multi-pack pricing. No workarounds, just smart bundling that scales. **Built in Dubai, made for global merchants.** If you've ever felt boxed in by bundle apps, we built PushBundle for you." — paired with an image/illustration.

4. **Our Mission** — "At WhenLab, We're on a mission to redefine e-commerce success for merchants who've outgrown 'simple bundles.' PushBundle was built from real Shopify pain points…" + 3 points: "Turn pack sizes, variant rules, and MOQs into growth tools, not roadblocks." · "Help you boost AOV with powerful volume discounts and multi-pack pricing." · "Be the go-to bundle discount app for merchants who need control, creativity, and results."

5. **Our Vision** — "We believe bundling should be a growth strategy, not a technical hurdle." / "Our vision is to lead a new era of bundling on Shopify… without limitations, without code, and without guesswork. We're building the most trusted, powerful bundling app for serious merchants…"

6. **The Smarter Way to Bundle on Shopify** — "PushBundle helps you build bundles your way. Set your own rules, offer bulk deals, and let shoppers mix and match what they love. More sales, less stress."

7. **Feature grid (6, scroll-reveal):**
   1. **Effortless Bundle Creation** — "Easily build, edit, and manage bundles with a dashboard designed for busy merchants."
   2. **Sell More with Smart Bundles** — "Boost your average order value with flexible discounts that match how customers shop."
   3. **Create Bundles They'll Love** — "Offer eye-catching, mix-and-match bundles that keep customers engaged and coming back."
   4. **Built to Grow With You** — "Whether you're selling locally or going global, PushBundle scales with your store at every stage."
   5. **Smart Pricing, Always On** — "Set it and forget it. PushBundle adjusts bundle pricing based on stock or customer behavior."
   6. **Schedule Sales in Advance** — "Plan flash deals or seasonal promos ahead of time. PushBundle takes care of the timing for you."

8. **Team / Company** _[NEW — recommended]_ — the meta title promises "Meet the Team" but the old page has none. Add: WhenLab F.Z.C intro, optional team cards (photo, name, role), Dubai location, "Built for Shopify" badge, other WhenLab apps strip. _Needs team info/photos (§9 assets)._ Could be CMS-driven (`TeamMember`) or static.

9. **Reviews strip** _(reuse CMS reviews block from Home, §5.1)_ — social proof.

10. **Trial CTA band** (shared) → **Start 14 Days Free Trial**.

11. **FAQ teaser** (shared, from CMS) → More FAQ.

12. **Footer** (global).

**SEO/structured data:** `Organization` / `AboutPage` JSON-LD (WhenLab F.Z.C, Dubai, logo, sameAs socials), `BreadcrumbList`. Localized metadata + OG.

### 5.4 Contact us (`/contact-us`)

**Goal:** make it effortless to reach support/sales via the channel the visitor prefers. **Reply promise:** within 24 hours.

**Section order:**

1. **Header / Nav** (global).

2. **Contact hero** — H1: "Contact Us" · intro: "Ran into a bundling challenge or have an idea to improve your store? We'd love to hear from you. Let's chat and explore how we can turn smart ideas into powerful solutions." · tagline "Reach Out Anytime" — "Call us, book a meeting, or drop your project details below. We'll get back to you within 24 hours. Promise!"

3. **Contact form + info (two-column):**
   - **Form** fields: Full Name · Email · Subject · Your Message · CTA **Submit Form**. Accessible labels + inline errors via `aria-describedby` (§6). Anti-spam (honeypot/CAPTCHA). Posts to a real handler → email + optional CRM. Success/error states.
   - **Info column:** support@pushbundle.com · **phone number** _[needs value, §9 6a]_ · **physical (Dubai) address** _[needs value]_ · support hours (Mon–Fri) · social links.

4. **Three contact-method cards:**
   1. **Send an Email** — "Got something on your mind or facing any issues? Drop us an email…" → support@pushbundle.com
   2. **Let's Chat** — "Have questions? Our team is here for you Monday to Friday, almost around the clock." → **Tawk.to live chat** (opens widget; lazy, prod-gated §7).
   3. **Set a Meeting** — "Prefer a face-to-screen? Book a meeting and let's talk about bundling, your way." → **Calendly** popup (lazy-loaded).

5. **FAQ** (shared, from CMS) — "Frequently Asked any questions?" + link More FAQ.

6. **Trial CTA band** (shared) → **Start 14 Days Free Trial**.

7. **Footer** (global).

_No map section (per decision 2026-07-14)._

**Interactive/tech notes:** Tawk.to + Calendly load lazily off the critical path (§7 perf); reduced-motion safe; keyboard-operable + focus-trapped popups (§6 a11y). Form submission handled server-side (Route Handler) with validation.

**SEO/structured data:** `ContactPage` + `Organization` (with `ContactPoint`: email, phone, `contactType: customer support`, hours, `areaServed`) JSON-LD, `BreadcrumbList`. Localized metadata + OG.

### 5.5 FAQ (`/faq`) — NEW PAGE

**Goal:** answer objections at scale, deflect support load, and win AEO/GEO (AI answer engines) via `FAQPage` structured data. **Does not exist on old site.** Content from CMS (`FaqItem`); single source also feeds the FAQ teasers on Home/Pricing/Contact/About.

**Section order:**

1. **Header / Nav** (global).

2. **FAQ hero** — H1: "Frequently Asked Questions" · intro: "Get expert answers to all your PushBundle questions. From setting up custom bundles to maximizing discounts and seamless integrations…" · **search/filter box** (client-side filter over questions).

3. **Categorized Q&A (accordions)** — grouped by CMS `category`. Proposed categories + seed questions _(answers needed — §9 #3)_:
   - **Getting Started:** Is PushBundle easy to set up on my Shopify store? · How do I add the app block to my theme?
   - **Bundles & Features:** What types of bundles can I create? · Can shoppers choose their own product variants? · What is Mix & Match / Build-a-Box?
   - **Discounts & Pricing (app):** Does PushBundle support discounts for bundles? · Can I limit bundle discounts to specific collections or products? · Flat vs per-variant discount?
   - **Billing & Plans:** Is there a free plan? · How does the 14-day trial work? · Can I switch plans? _(shared with Pricing FAQ)_
   - **Compatibility & Support:** Works with Shopify Plus / POS / Markets? · What support do you offer?
   - Accordion a11y: `button` + `aria-expanded`/`aria-controls`, keyboard operable (§6). One open at a time or multi — TBD.

4. **Still-need-help CTA** — "Didn't find the answer you are looking for? **Contact Our Support**" → `/contact-us` (+ Tawk.to chat trigger).

5. **Trial CTA band** (shared) → **Start 14 Days Free Trial**.

6. **Footer** (global).

**SEO/AEO/structured data:** **`FAQPage` JSON-LD** built from the CMS items (big AEO/GEO win — surfaces in Google + AI answers). Deep-linkable questions (anchor per Q). Localized metadata + OG. Also referenced from `llms.txt` for AI answer engines (§8).

### 5.6 Partners (`/partner`)

**Goal:** showcase the Shopify-ecosystem apps PushBundle integrates/partners with; drive cross-app discovery. **CMS-driven** (`Partner` model). Slug kept singular `/partner`. **Meta:** "PushBundle Partners | Shopify Bundle Discount App Partners".

**Section order:**

1. **Header / Nav** (global).

2. **Partners hero** — H1: "Our Partners" · intro: "We love working with the best in the Shopify ecosystem. By partnering with leading apps and services, we deliver powerful, scalable bundling solutions that keep your store ahead as you grow." · subhead "EXPLORE OUR PARTNERS".

3. **Partner grid (from CMS)** — cards, each: logo/icon, name, one-line description, category/tag, **CTA "Visit"** (external, `rel="noopener"`). Seed/demo data from current 4 partners:
   - **MultiVariants – Bulk Order** — "Multivariants lets customers easily select multiple product variants, order in bulk, and speed up checkout with a single click…"
   - **DiscountRay – Custom Price** — "Maximize your store's sales and (AOV) with powerful, flexible, and automatic discount features."
   - **EmbedUp – Affiliate Buy Button** — "Turn any website, landing page, or blog into a powerful headless sales channel."
   - **Transtore: Language & Currency Solution** — "Auto-translate in 20+ languages, 163+ currency switcher, geolocation redirects, multilingual SEO…"
   - _Grid scales as CMS partners are added; optional grouping by category (integrations vs sibling apps)._

4. **Become a partner** _[optional/NEW]_ — light CTA band: "Want to partner with us?" → email/contact link. _(Not a full program — decision was showcase-only; keep as a simple contact prompt.)_

5. **Trial CTA band** (shared) → **Start 14 Days Free Trial**.

6. **Footer** (global).

**SEO/structured data:** `CollectionPage` + `ItemList` (partners) JSON-LD, `BreadcrumbList`. Localized metadata + OG. Partner cards are dynamic → included in ISR revalidation.

### 5.7 Blog (`/blog`, `/blog/page/[n]`, `/blog/[slug]`, `/blog/category/[category]`)

**Goal:** SEO/AEO engine — rank for bundling/AOV queries, educate merchants, funnel to install. **CMS-driven** (`Post` model). ~54 posts, 7 categories. Keep `/blog/{slug}` slugs (SEO). Old monthly archives 301→`/blog`.

**`Post` model (fields):** title, slug, excerpt, body (rich text/MDX-from-CMS), coverImage, category, tags, **author + reviewer**, publishedAt, updatedAt, readingTime, locale, SEO overrides (metaTitle/Desc/OG).

#### 5.7a Blog index (`/blog`, paginated `/blog/page/[n]`)

1. **Header / Nav** (global).
2. **Blog hero** — H1: "Articles" · intro: "We're committed to empowering Shopify merchants with actionable insights. Dive into our expert-curated articles filled with bundling strategies, AOV-boosting tips, and the latest e-commerce trends…" · optional search.
3. **Featured post** _[optional]_ — latest/pinned post, larger card.
4. **Category filter** — 7 chips: Case Studies · Holiday Season · Product Bundle · Shopify Bundle · Top Shopify Apps for Merchants · Updates · Use Case → link to `/blog/category/[category]`.
5. **Post grid** — cards: cover image, category, title, excerpt, date, author, reading time. 10 per page.
6. **Pagination** — numbered `/blog/page/2`… with `rel=prev/next` metadata; SEO-friendly (not infinite-scroll-only).
7. **Newsletter band** (shared) → Subscribe.
8. **Footer** (global).

- **SEO:** `Blog`/`CollectionPage` + `ItemList` JSON-LD, `BreadcrumbList`, canonical per page, `rel=prev/next`. Localized.

#### 5.7b Category archive (`/blog/category/[category]`)

- Same grid/pagination as index, filtered to one category. H1 = category name + short intro. Canonical to page 1; paginated. `CollectionPage` JSON-LD. Generated for all 7 categories from CMS.

#### 5.7c Single post (`/blog/[slug]`)

1. **Header / Nav** (global).
2. **Post header** — breadcrumb (Home › Blog › Category › Title) · category chip · H1 title · meta row: **author + "Reviewed by"** · publishedAt (+ "Updated" if newer) · reading time · share buttons.
3. **Cover image** — `next/image`, priority (LCP), responsive.
4. **Body + TOC** — rich content from CMS (headings, images, code, callouts, tables). Sticky **table of contents** (desktop) from H2/H3. Content images lazy, sized (no CLS).
5. **Author/reviewer bio** _[optional]_ — small card (name, role, avatar) for E-E-A-T.
6. **Related posts** — 3 by shared category/tags (from CMS).
7. **Inline CTA** — mid/end-of-article "Install Free on Shopify" / trial band.
8. **Newsletter band** (shared).
9. **Footer** (global).

- **SEO/AEO (critical for blog):** **`Article`/`BlogPosting` JSON-LD** (headline, author `Person`, `reviewedBy`, datePublished/Modified, image, publisher `Organization`), `BreadcrumbList`, per-post metadata + OG (from CMS SEO fields, fallback generated), canonical, `hreflang` alternates. E-E-A-T via author+reviewer. Feeds `llms.txt`/AEO.
- **Perf:** RSC-rendered from CMS, ISR + on-demand revalidate on publish. Body ships as HTML (fast LCP); interactive bits (share, TOC scroll-spy) are small client islands.

### 5.8 Docs (`/docs`, `/docs/[slug]`)

**Goal:** help merchants install & configure the app → reduce support load, improve retention. **CMS-driven** (`DocArticle` model). Currently small (2 categories, ~7 articles) but built to scale.

**`DocArticle` model:** title, slug, category, order, body (rich text/MDX-from-CMS), updatedAt, locale, related/prev-next, SEO fields.

#### 5.8a Docs home (`/docs`)

1. **Header / Nav** (global).
2. **Docs hero** — H1: "Documentation" / "Help Center" · short intro · **search box** (client-side filter, scalable to server search later).
3. **Category sections** — grouped article links from CMS:
   - **Getting Started:** Installation · "How to Add the PushBundle App Block to Your Shopify Theme?"
   - **Setup Process:** Mix and Match Single Product · "How to setup volume bundle?" · "How to apply quantity restriction on each variants?" · "How to offer discount for Mix and Match bundle?" · "What is 'Number of Variants' and 'Quantity per Variants' limit?"
   - _(categories/articles expand from CMS)_
4. **Popular / quick links** _[optional]_ — top articles, "Contact support" fallback.
5. **Footer** (global).

#### 5.8b Doc article (`/docs/[slug]`)

1. **Header / Nav** (global).
2. **Layout: left sidebar (category tree) + content + right TOC** — sidebar shows all categories/articles (collapsible); highlights current. Mobile → collapsible drawer.
3. **Article** — breadcrumb (Home › Docs › Category › Title) · H1 · "Last updated" · body (steps, screenshots, callouts, code). Content images `next/image`, sized.
4. **Prev/Next** article nav + "Was this helpful?" feedback _[optional]_.
5. **Still stuck? Contact support** CTA → `/contact-us` / Tawk.to.
6. **Footer** (global).

- **SEO/structured data:** `TechArticle`/`Article` JSON-LD, `BreadcrumbList`, per-article metadata + OG, canonical, `hreflang`. Docs FAQ topics (discount types, pack-size config, troubleshooting) can also emit `FAQPage`. Localized.
- **Perf:** RSC + ISR, revalidate on CMS publish. Sidebar/search are light client islands.

### 5.9 Changelog (`/changelog`)

**Goal:** show product velocity & trust; give merchants a reason to return. **CMS-driven** (`ChangelogEntry` model). 17 entries today, reverse-chronological.

**`ChangelogEntry` model:** title, date, category/badge (New Feature · Improved · Fixed · Recognition · Launch), body (rich text), optional image, locale, slug (for deep-link/anchor).

**Section order:**

1. **Header / Nav** (global).
2. **Changelog hero** — H1: "Changelog" / "What's New" · intro (product updates & releases) · **badge-category filter** (All · New Feature · Improved · Fixed · Recognition · Launch).
3. **Timeline / entry list** (from CMS, reverse-chron) — each entry: date · **category badge** (color-coded) · title · description · optional image. Anchor per entry for deep-linking. Scroll-reveal. Grouped by month/year headers _[optional]_.
   - Seed data = the 17 extracted entries (§3 Page 10), incl. **"Built for Shopify" (Jan 28 2026)** and **Launch (Jun 23 2025** — corrected per Shopify**)**.
4. **Subscribe to updates** _[NEW — recommended]_ — newsletter/RSS opt-in for release notes (old page had none).
5. **Trial CTA band** (shared) → **Start 14 Days Free Trial**.
6. **Footer** (global).

- **SEO/structured data:** `CollectionPage` + `ItemList` JSON-LD; optional RSS/Atom feed at `/changelog/rss`. Per-entry anchors. Localized. RSS/feed + `updatedAt` also help the auto-sitemap (§4.3).
- **Perf:** RSC + ISR, revalidate on publish. Filter is a light client island.

### 5.10 Privacy Policy (`/privacy-policy`)

**Goal:** legal compliance + trust. Static long-form (code + `next-intl`, not CMS). Only legal page (per decision). Content = the 9 sections from §3 Page 9.

**Section order:**

1. **Header / Nav** (global).
2. **Header block** — H1: "Privacy Policy" · **"Last updated: [date]"** _(add explicit date — old page lacked one, §3 note)_ · legal entity **WhenLab F.Z.C** · privacy contact support@pushbundle.com.
3. **Table of contents (anchor nav)** — sticky on desktop; jump-links to the 9 sections.
4. **Policy body (9 sections):** 1) Information Collected · 2) Use of Information · 3) Protecting, Securing, and Sharing of Information · 4) Storing and Deleting of Information · 5) Changes in Business Ownership and Control · 6) Changes to this Privacy Policy · 7) DPA and GDPR Subject Rights · 8) Children's Privacy (under-13) · 9) Updates to this Privacy Policy.
   - Readable measure (max-width), clear headings, anchor links. Mentions GDPR · Data Protection Act 1998 · cookies (consent) · third-party processors.
5. **Contact for privacy** — support@pushbundle.com.
6. **Footer** (global).

- **Cookie consent tie-in:** page pairs with the cookie-consent banner + analytics gating (§7). _(No separate Cookie Policy page — legal = Privacy only.)_
- **SEO:** standard metadata; typically `noindex`? → **keep indexable** (trust signal) but low priority in sitemap. Localized. `BreadcrumbList`.

_All 10 pages outlined (§5.1–5.10). §5 complete._

## 6. Design Direction

### Animation & Motion (decided 2026-07-10)

- **Library:** [`motion`](https://motion.dev) (Motion, the successor to `framer-motion`), imported as `motion/react`. Chosen for React 19 / Next.js 16 compatibility, spring physics, and scroll-linked reveals.
- **Smooth scroll:** [`lenis`](https://github.com/darkroomengineering/lenis) for "super smooth" inertial/eased scrolling across the site. Wraps the app once at the root; pairs with Motion's `useScroll` for scroll-linked effects.
- **Reusable `AnimateIn` wrapper:** small client component using Motion's `whileInView` for consistent scroll-triggered entrance reveals (matches the `seo-marketing-site` skill pattern).
- **Micro-interactions:** plain CSS transitions for trivial hover/focus states; reserve Motion for meaningful motion (reveals, page transitions, gestures).

**Guardrails (non-negotiable):**
1. **Respect `prefers-reduced-motion`** — disable/soften Lenis smooth scroll and Motion animations when the OS "reduce motion" setting is on (required for WCAG 2.1 AA per the `seo-marketing-site` skill).
2. **Animate only `transform` + `opacity`** (GPU-friendly) — no layout-thrashing properties — to protect the Lighthouse mobile ≥95 target.
3. **Isolate animation to client components** (`"use client"`) so the rest of the site stays server-rendered for SEO/performance.
4. **Lenis must not break in-page anchor links / accessibility focus** — wire `scrollTo` for anchors and keep keyboard navigation intact.

### Color Scheme (decided 2026-07-10)

Derived from the PushBundle logo — a deep indigo→cyan gradient with white marks.

**Signature brand gradient:** `linear-gradient(135deg, #1E27D6 0%, #2F6BFF 45%, #3AD9EE 100%)`

**Brand ramp**
| Token | Hex | Use |
|---|---|---|
| `indigo-900` | `#171C8F` | Darkest gradient corner, deep accents |
| `indigo-700` | `#1E27D6` | Gradient start |
| `blue-500` (Primary) | `#2C5BF0` | Buttons, links, primary actions |
| `sky-400` | `#2F6BFF` | Gradient mid, hovers |
| `cyan-400` (Accent) | `#3AD9EE` | Gradient end, highlights — **large/graphic elements only** |
| `cyan-600` (Accent-text) | `#0E9CB5` | Readable cyan for links/labels on white |

**Neutrals — light**
| Token | Hex |
|---|---|
| `ink-900` (text) | `#0B1020` |
| `slate-500` (muted) | `#5B6473` |
| `border-300` | `#D8DEE9` |
| `surface-100` | `#F1F4F9` |
| `page-50` | `#F7F9FC` |
| `white` | `#FFFFFF` |

**Neutrals — dark**
| Token | Hex |
|---|---|
| `bg-950` | `#070B18` |
| `surface-900` | `#0E1424` |
| `elevated-800` | `#161E33` |
| `border-dark` | `#24304B` |
| `text-dark` | `#E7ECF5` |
| `muted-dark` | `#9AA6BD` |

**Semantic:** success `#22C55E` · warning `#F5A524` · error `#EF4444` · info `#2F6BFF`

**Warm accent (added 2026-07-22):** a coral/amber secondary for commerce energy alongside the cool blue brand — `warm #FF6B4A` (fills/icon tiles/large), `warm-foreground #B23C0C` (readable warm text on light, `#FF8A6B` on dark), `warm-subtle #FFE9E2` (tint). Plus `--gradient-warm`. Used for section eyebrows, "save" badges, and the highlighted "Proven Sales Impact" card. Secondary to blue — never the primary CTA colour.

**A11y rules (WCAG 2.1 AA):**
1. Bright cyan `#3AD9EE` fails contrast as text on white — use only for gradients/graphics/large fills; use `cyan-600 #0E9CB5` when cyan must be readable text.
2. Verify every text/background pair against AA (≥4.5:1 body, ≥3:1 large) before shipping; primary blue `#2C5BF0` + white text is button-safe.

### Semantic UI Roles & Theming Architecture (decided 2026-07-10)

**Buttons**
| Role | Background | Text | Hover |
|---|---|---|---|
| Primary | `blue-500 #2C5BF0` | white | `blue-600 #234BD6` |
| Primary (hero CTA) | brand gradient | white | subtle lift / gradient shift |
| Secondary | transparent, 1px `blue-500` border | `blue-500` | fill `blue-50 #EAF0FE` |
| Tertiary / ghost | transparent | `ink-900` | `surface-100 #F1F4F9` |
| Disabled | `border-300 #D8DEE9` | `slate-500` | — |

Focus ring (all interactive): `blue-500` @ 40% opacity.

**Section backgrounds** (alternate for vertical rhythm)
| Section role | Light | Dark |
|---|---|---|
| Page / default | `page-50 #F7F9FC` | `bg-950 #070B18` |
| Alt / zebra | `white` | `surface-900 #0E1424` |
| Subtle band | `surface-100 #F1F4F9` | `elevated-800 #161E33` |
| Emphasis / feature | brand gradient **or** `ink-900 #0B1020` (white text) | brand gradient |
| Footer | `ink-900 #0B1020` | `bg-950 #070B18` |

**Content roles:** card `white` / border `border-300` · body text `ink-900` · muted `slate-500` · link `blue-500` · readable accent `cyan-600 #0E9CB5`.

**Theming architecture — one-place rebrand (single source of truth):**

Two token layers, both in `app/globals.css` (Tailwind 4 `@theme`):
1. **Primitives** — the raw brand palette; the ONLY place hex values live (`--color-blue-500: #2C5BF0`, etc.).
2. **Semantic roles** — map roles → primitives (`--color-primary: var(--color-blue-500)`, `--color-background`, `--color-foreground`, `--color-border`, `--color-ring`, …).

**Rule:** components reference **semantic tokens only** (`bg-primary`, `text-foreground`, `border-border`) — never raw hex like `bg-[#2C5BF0]`. Dark mode re-points semantic vars; primitives unchanged.

**Rebrand path:** new logo → edit the ~10 primitive values once → entire site (buttons, sections, gradients, dark mode) updates. No per-file edits. Brand gradient is also a single token: `--gradient-brand`.

### Visual Polish — "make it look great" (decided 2026-07-10)

- **Typography system (decided 2026-07-15):**
  - **Single family: Plus Jakarta Sans** for both display and body (variable, `next/font/google`, self-hosted). _Revised 2026-07-15:_ the original Jakarta + Inter pairing put two variable families on the critical path and held Lighthouse mobile at **94 (LCP ~3.0s)**, under the ≥95 gate. Dropping to one family moved it to **96–98 (LCP ~2.5s)**. Jakarta is UI-grade, so body copy still reads well. _(Inter can be reinstated for body if the design is preferred over ~3 Lighthouse points.)_
  - **CJK:** **Noto Sans JP** (`ja`) + **Noto Sans SC** (`zh`), loaded **only on those locales** (per-locale dynamic `next/font`) to protect the font/JS budget (§7).
  - Exposed as tokens: `--font-display` (Jakarta), `--font-sans` (Inter) → Tailwind `font-display` / `font-sans`. `display: swap`, subset Latin, `preload` the LCP-critical faces only.
  - Modular type scale + generous line-height; fluid sizing via `clamp()` (§ Responsive).
- **Spacing & rhythm:** 8px spacing scale, max content width ~1200px, consistent section padding, deliberate vertical rhythm / whitespace.
- **Depth:** soft layered shadows + subtle borders (no heavy drops); tuned radii per component; subtle glows on dark/gradient sections.
- **Signature moments:** gradient hero + animated product visual, scroll-reveal sections, subtle animated aurora/gradient background, lively hover states (where Motion earns its weight).
- **Real imagery:** actual product screenshots/mockups via `next/image` (AVIF) over stock; consider bento-grid / isometric feature layouts.
- **Design-system kit:** shared Button, Card, Badge, Section, Container, Input components so every page reads as one system.
- **Dark mode:** first-class (tokens already defined in §6), not bolted on.
- **Micro-polish:** custom focus rings, smooth theme toggle, skeleton/loading + empty states, branded 404.

### Responsive Design (decided 2026-07-14)

- **Mobile-first:** build base styles for small screens, layer up with Tailwind breakpoints (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`). Design and test phone → tablet → desktop → large desktop.
- **Fluid, not just breakpoints:** fluid type/spacing with `clamp()` and CSS `min/max/clamp` so layouts scale smoothly *between* breakpoints, not just at them.
- **Layout primitives:** CSS Grid / Flexbox with `Container` (max ~1200px, responsive gutters) and `Section` components; multi-column feature/bento grids collapse to single column on mobile.
- **Responsive navigation:** desktop nav → hamburger/drawer on mobile (accessible, keyboard-operable, focus-trapped); language switcher (§8) and theme toggle reachable on all sizes.
- **Media:** `next/image` with correct `sizes`/`srcset`, responsive art direction where needed; no fixed-width overflow; images never exceed viewport.
- **Touch & input:** ≥44px touch targets, hover effects have touch/focus equivalents, no hover-only interactions.
- **Tables/wide content:** horizontal scroll containers so nothing breaks the layout on narrow screens.
- **Test matrix:** verify at 320px (small phone), 375/390 (phone), 768 (tablet), 1024, 1440, and 1920; also landscape + 200% zoom (ties to §6 a11y).
- **No horizontal scroll** at any breakpoint (except intentional scroll containers).

### Accessibility Standard — WCAG 2.1 AA (decided 2026-07-10)

- **Semantic HTML first:** real landmarks (`header/nav/main/footer`), one `<h1>`/page, ordered headings, correct `<button>` vs `<a>`.
- **Keyboard operable:** visible focus everywhere, logical tab order, **"Skip to content"** link, no keyboard traps (menus/modals/Calendly).
- **Motion safety:** honor `prefers-reduced-motion` (§6) — soften Lenis + Motion, no forced parallax/autoplay.
- **Color & contrast:** AA on every text/bg pair; never convey state by color alone (pair with icon/text). Bright-cyan-as-text rule from §6.
- **Names & roles:** `alt` on meaningful images, labels on all fields, accessible names on icon-only buttons, `aria-*` only to fill semantic gaps.
- **Forms:** visible labels, inline errors via `aria-describedby`, error summary, no placeholder-as-label.
- **Responsive/media:** usable at 200% zoom, ≥44px touch targets, respects `prefers-color-scheme`.
- **Gate:** axe + Lighthouse a11y in CI (skill's automated audits) + manual keyboard & screen-reader smoke pass before ship.

_Type scale steps + spacing values to be finalized during design (font families decided: Plus Jakarta Sans + Inter, above)._

## 7. Technical & SEO Approach

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4
- **Animation:** `motion` (Motion / framer-motion successor) — see §6
- **Smooth scroll:** `lenis` — see §6
- **SEO/AEO/GEO:** metadata, JSON-LD, sitemap, robots, OG images, `hreflang`, `llms.txt` (per skills). **URL scheme:** no trailing slash; preserve old slugs; redirect old trailing-slash URLs (see §8).
- **Analytics / Chat:** GA4 + Meta Pixel (lazy, prod-gated) · **Tawk.to** live chat · **Calendly** for "Set a Meeting" — all lazy-loaded off the critical path (§7 perf budget).
- **Cookie consent (GDPR):** a **consent banner gates GA4 + Meta Pixel** — analytics/marketing scripts do **not** fire until the EU visitor consents (privacy policy §5.10 promises this; legally required for GDPR). Consent stored (cookie), respected across the session, revocable. Essential/functional cookies exempt. Ties analytics loading to consent state.
- **CMS / content source:** **External headless CMS (existing), consumed via API** — connected later. See below.
- **Testing / verification:** Playwright + Chromium (dev dependency) — see below

### Content / CMS architecture (decided 2026-07-14)

- **Client already has a CMS.** The site consumes it via **API** for all dynamic collections: **Blog, Docs, FAQ, Changelog, Partners, Reviews** (and anything else content-driven). API to be wired in later.
- **Build API-agnostic now:** create a **content adapter layer** (`lib/cms/*`) with typed models (`Post`, `DocArticle`, `FaqItem`, `ChangelogEntry`, `Partner`, `Review`) and **mock/fixture ("demo") data**, so pages, routing, SEO, and layouts are built and testable **before** the real API is connected. Swapping in the real endpoints = implement the adapter, no page rewrites.
- **Rendering:** Server Components fetch from the CMS; **ISR + on-demand revalidation** (webhook from CMS on publish) per the `nextjs-seo-website` skill — fast, cacheable, fresh.
- **Dynamic SEO from CMS fields:** per-item metadata, `Article`/`BlogPosting`/`FAQPage` JSON-LD, breadcrumbs, sitemap entries all generated from CMS data.
- **Static/marketing pages** (Home, Pricing, About, Contact, Partners, legal) are **code + `next-intl` message files**, not CMS-driven.

### Testing & QA tooling (decided 2026-07-14)

- **Playwright with Chromium** as a **dev dependency** — the single tool for automated checking/verification of the site. _(Installed 2026-07-14: `@playwright/test@1.61.1`, `@axe-core/playwright@4.12.1`, Chromium binary. `playwright.config.ts` to be added at build time.)_
- **Responsive checks:** drive the §6 device matrix (320 / 375 / 768 / 1024 / 1440 / 1920) and capture screenshots to confirm no overflow / correct breakpoint behavior.
- **Accessibility gate:** run `axe-core` via Playwright (`@axe-core/playwright`) against key pages → fails the build on WCAG 2.1 AA violations (satisfies §6 a11y gate + skills' automated a11y audits).
- **Visual verification:** screenshot key pages/sections in light + dark themes and across locales (§8) to catch regressions.
- **Functional smoke:** navigation, language switcher (path preservation), theme toggle, forms, keyboard operability.
- **Performance:** Lighthouse (mobile) check against the §7 budget, run in CI.
- **Scope note:** Chromium-only for local/dev checks by default; add WebKit/Firefox projects later only if cross-browser coverage is needed.

### Performance budget — "lightweight & loads first" (decided 2026-07-10)

Targets:
- **Lighthouse mobile ≥ 95** (Performance) — same bar as the `seo-marketing-site` skill.
- **LCP < 2.0s**, **CLS < 0.1**, **INP < 200ms** on mid-tier mobile.
- **First-load JS budget: ~≤ 100 KB gzipped** for the landing route.

How we stay light despite Motion + Lenis:
1. **Server-first rendering.** Pages are React Server Components by default; only interactive/animated leaves are `"use client"`. Hero HTML/CSS ships and paints before any animation JS is needed.
2. **Above-the-fold is CSS-first.** The hero renders and reaches LCP with plain HTML + Tailwind — no dependency on Motion/Lenis for first paint. Motion/Lenis hydrate progressively after.
3. **Defer/lazy the heavy bits.** Lenis, below-the-fold animated sections, demos, and any charts load via `next/dynamic` / lazy import so they don't block first load.
4. **Images:** `next/image`, AVIF/WebP, correct `sizes`, `priority` only on the LCP image; everything else lazy. No oversized hero assets.
5. **Fonts:** `next/font` (self-hosted, `display: swap`, subset) — no render-blocking external font requests.
6. **Third-party scripts stay out of the critical path.** Analytics (GA4/Pixel) + chat (Tawk.to) load lazily, production-gated, after interaction/idle — per the `nextjs-seo-website` skill.
7. **Ship less CSS/JS.** Tailwind 4 purges unused CSS; tree-shake Motion (import only what's used); avoid heavy UI libraries.
8. **Measure, don't guess.** Track `@next/bundle-analyzer` output and a Lighthouse CI check against the budget above.

> Trade-off noted: "super smooth" (Lenis) and "loads first" pull against each other. Resolution — the **first paint never waits on Lenis/Motion**; smoothness enhances *after* the page is already usable (progressive enhancement).

## 8. Internationalization (i18n & Localization)

> Decided 2026-07-14. The **entire site content** is translated into 7 languages. English is default with **no URL prefix**; other locales are path-prefixed.

### Locales (7 — the website ships 7 languages)
| Language | Locale code | `hreflang` | URL |
|---|---|---|---|
| English (**default**) | `en` | `en` | `https://pushbundle.com/*` (no prefix) |
| German | `de` | `de` | `https://pushbundle.com/de/*` |
| French | `fr` | `fr` | `https://pushbundle.com/fr/*` |
| Spanish | `es` | `es` | `https://pushbundle.com/es/*` |
| Italian | `it` | `it` | `https://pushbundle.com/it/*` |
| Japanese | `ja` | `ja` | `https://pushbundle.com/ja/*` |
| Simplified Chinese | `zh` | `zh-Hans` | `https://pushbundle.com/zh/*` |

Plus `x-default` → English. (None of the 7 are RTL, so no RTL layout work needed.) _Note: the Shopify **app** additionally supports Portuguese (Portugal), but the **website ships 7 languages** (no `/pt`). If Portuguese is wanted later, it's a one-line add in `i18n/config.ts` (§8 architecture)._

**URL scheme (decided 2026-07-14):**
- **No trailing slash** (`trailingSlash: false`), e.g. `/blog/{slug}` (old site used `/blog/{slug}/`).
- **Preserve existing slugs** for SEO continuity.
- **Redirect old trailing-slash URLs → non-trailing** (301) so existing links/SEO don't break — a middleware/`next.config` redirect covering all old paths (`/pricing/` → `/pricing`, `/blog/{slug}/` → `/blog/{slug}`, etc.). Ties to `nextjs-seo-website` legacy-redirect pattern.
- **Old monthly blog archives → `/blog`** (301). No dedicated archive pages are built; any legacy `/blog/{year}/{month}(/)` URL redirects to the blog index. Kept slugs: `/about-us`, `/contact-us`, `/partner`, `/privacy-policy` (unchanged from old site).
- Chinese path = **`/zh`** (hreflang `zh-Hans`).

### Routing & library
- **Library: NONE — native Next.js 16 i18n** _(revised 2026-07-22, was `next-intl`)._ Next 16 renamed `middleware`→`proxy` and **dropped edge runtime** there; `next-intl` relies on edge middleware, so it's a compatibility risk. Next 16's **official i18n guide uses the native pattern** (proxy + `app/[lang]` + server dictionaries), which gives the same result with no third-party edge dependency. Config lives in `i18n/config.ts` (one-file source of truth).
- **Routing:** `app/[lang]/...` segment + `proxy.ts`. Proxy **rewrites** unprefixed paths to the default locale internally (so `en` serves at `/pricing`, not `/en/pricing`) and lets prefixed paths (`/de/pricing`) through; `/en/*` 301s to the unprefixed form. Detects `Accept-Language`, honours a locale cookie, but does not force-redirect from the unprefixed default.
- `<html lang={lang}>` set per request from the route param.

### Content architecture — split by content type (decided 2026-07-14)

Two translation sources, by page type:
- **Static / marketing pages (manual translation):** Home, Pricing, About, Contact, Partners, legal, and all UI chrome. Strings live in **`/messages/{locale}.json`** — one file per language, shared keys. `en.json` is the **source of truth**; other locales mirror it. Read via `next-intl` (`getTranslations`) — **no hardcoded copy in components**.
- **Dynamic content (from CMS):** Blog, Docs, FAQ, Changelog come **already-localized from the CMS** — the current locale is passed to the CMS API, which returns that locale's content. Not in the message files.

- A single **`i18n/config.ts`** lists the locale set → adding/removing a language is a one-file change (locales, labels, flags, hreflang map all derive from it), and is the locale value passed to the CMS API.
- Numbers/dates/currency via `Intl` (locale-aware formatting).
- **Fallback:** if the CMS lacks a translation for a given locale, fall back to English (`en`) content + correct `hreflang` handling (avoid duplicate-content penalties).

### SEO for i18n (from both skills)
- **`hreflang` alternates** for all 7 locales + `x-default`, generated from `i18n/config.ts` (one source) on every page's `<head>`.
- **Per-locale canonical** URLs.
- **Localized metadata** — title/description/OG translated per locale (via `generateMetadata` reading messages).
- **Sitemap** emits every locale URL with `alternates.languages` entries; `robots`/`llms.txt` account for locales.

### Language switcher (matches provided UI)
- Dropdown with flag + native language name (日本語, Français, Deutsch, Español, 简体中文, Italiano, English).
- **Preserves the current path** when switching locale (e.g. `/de/pricing` → `/fr/pricing`) and stores choice in a cookie.
- **Accessible:** real `<button>` + listbox semantics, full keyboard operation, visible focus (ties to §6 a11y standard).

### Fonts / performance note
- Japanese (`ja`) and Simplified Chinese (`zh`) need **CJK glyph coverage**. Load CJK font subsets **only on those locales** (dynamic `next/font`) so Latin-locale pages stay within the JS/font budget (§7).

## 9. Open Questions

Gathered while inventorying the old site (2026-07-14).

**✅ Resolved:**
1. Blog source / CMS → **Existing headless CMS via API** (connect later); build API-agnostic adapter now. (§7)
2. Translation scope → **marketing pages manual** (`next-intl`); **dynamic content localized by CMS**. (§8)
4. Partner page → **CMS-driven** too; build with demo/fixture partner data. (§7)
5. Docs scale → CMS-driven, scalable (index + categories + search). (§7)
6. Contact channels → **Tawk.to chat + Calendly booking + real phone/address**. (Page 4, §7)
7. Legal → **Privacy Policy only** for now (no ToS/Cookie/GDPR pages). (§4)
8. URL scheme → **no trailing slash**, preserve slugs, 301-redirect old trailing-slash URLs, Chinese = `/zh`. (§8)
9. CMS decision → resolved by #1.

**✅ Data discrepancies resolved — Shopify App Store is the source of truth (2026-07-14):**
- **Yearly price:** use **$134.40/yr** ($14×12×20% off), NOT $148. → correct the Pricing page.
- **Launch date:** use **Jun 23 2025** (store), not Jun 20.
- **Features:** take feature set/positioning from the Shopify listing (see §1 + Pricing).
- **Languages:** **website ships 7 locales** ("locally rely on 7") — Portuguese stays Shopify-app-only, not on the site.
- **App name:** store brand "Push Bundle ‑ Build a Box App"; site uses "PushBundle" — keep as-is.

**🟡 Still open (content/asset supply from client — not blocking design):**
3. **FAQ authoring** — CMS delivers FAQ, but someone must **write real answers** for the 5 seed questions + more (Page 8). Who/when?
6a. **Contact info values** — need the actual **phone number + Dubai address** to display.
10. **Assets** — brand fonts, product screenshots, full logo set (SVG + favicons): supplied or generate?
11. **CMS API details** — endpoint/base URL, auth, schema/fields, locale param, revalidation webhook (needed when wiring the adapter).
12. **Form/newsletter backend** — where do the **contact form** and **newsletter signups** post? (email inbox, CRM, Mailchimp/Klaviyo, or CMS API?) Provider + spam protection.
13. ~~"View Demo" CTA target~~ → **resolved**: live demo storefront (see §5.1 revisions).
14. **Cookie-consent provider** — build a lightweight custom banner, or use a service (e.g. Cookiebot/Osano)? (§7 cookie-consent)

## 10. Build Phases (Roadmap)

> Added 2026-07-15. Ordered so that **nothing is blocked by the outstanding §9 supply items** — the CMS adapter runs on demo data until the real API lands, and integrations come last.

### ⚠️ Next.js 16 breaking changes that affect this plan (verified in `node_modules/next/dist/docs/`)

1. **`middleware` → `proxy`** — the `middleware.ts` convention is deprecated; use **`proxy.ts`** exporting `proxy()`. **Edge runtime is NOT supported in `proxy`** (nodejs only). → affects the i18n routing plan (§8, Phase 8).
2. **Async request APIs** — `params`, `searchParams`, `cookies()`, `headers()` are **Promises**; must `await`. → affects every `[locale]`/`[slug]` page (Phases 6, 8).
3. **`revalidateTag(tag)` now requires a 2nd arg** (cacheLife profile), e.g. `revalidateTag('posts', 'max')`; `updateTag()` for read-your-writes. → affects CMS on-demand revalidation (§7, Phase 9).
4. **`sitemap` `id` from `generateSitemaps()` is now a Promise** → only matters if we ever chunk the sitemap (§4.3).
5. **Next no longer overrides `scroll-behavior`** on navigation — add `data-scroll-behavior="smooth"` to `<html>` if that override is wanted. → relevant to Lenis (§6).
6. **PPR** is now via top-level `cacheComponents: true` (no `experimental_ppr`).
7. **`next lint` removed** (use ESLint directly); **Turbopack is default**; `next dev` outputs to `.next/dev`.
8. **`next/image` defaults changed** — `qualities: [75]` only, `minimumCacheTTL` 4h, `16` removed from `imageSizes`, local IPs blocked. → configure if we need other qualities.

### Phase 0 — Foundation / scaffolding ✅ **COMPLETE (2026-07-15)**
**Goal:** the design system exists before any page is built.
- Tailwind 4 `@theme`: **primitive + semantic token layers** (§6), brand gradient token, dark-mode mapping
- Fonts: Plus Jakarta Sans + Inter via `next/font`; `--font-display` / `--font-sans`
- Type scale + spacing scale; `Container` / `Section` primitives
- Motion + Lenis providers (reduced-motion aware), `AnimateIn` wrapper
- `playwright.config.ts` + first smoke test
**Exit:** a blank page renders with correct tokens/fonts in light + dark; Playwright runs green.

**Delivered:**
- `app/globals.css` — 2-layer tokens (primitives `--pb-*` → semantic → `@theme inline`), `.dark` via `@custom-variant`, fluid display type scale, spacing/radius/shadow tokens, `bg-brand-gradient`/`text-brand-gradient` utilities, global reduced-motion block
- `app/layout.tsx` — Inter (`--font-inter`) + Plus Jakarta Sans (`--font-jakarta`) via `next/font/google`
- `components/ui/container.tsx` (`max-w-site px-gutter`), `components/ui/section.tsx` (tones: default/alt/subtle/inverse/gradient)
- `components/providers/smooth-scroll.tsx` — Lenis, disabled under `prefers-reduced-motion`, reacts to live changes
- `components/motion/animate-in.tsx` — Motion `whileInView`, transform/opacity only, `useReducedMotion` short-circuit
- `lib/utils.ts` (`cn`), `app/page.tsx` — temporary foundation preview (replaced in Phase 4)
- `playwright.config.ts` (desktop + mobile projects) + `tests/foundation.spec.ts`
- Deps: `motion@12.42.2`, `lenis@1.3.25`. Scripts: `typecheck`, `test`, `test:ui`

**Verified:** `npm run build` ✅ · `tsc --noEmit` ✅ · Playwright **5/5 passing on desktop + mobile** (tokens applied, both fonts loaded, dark theme re-points tokens, no horizontal scroll at 320→1920, **zero axe WCAG 2.1 AA violations**).

_Naming note: `--container-site` (not `--container-max`) to avoid colliding with Tailwind's built-in `max-w-max`._

### Phase 1 — Core UI kit ✅ **COMPLETE (2026-07-15)**
**Goal:** one consistent component system.
- Button (primary/secondary/tertiary/disabled), Card, Badge, Input, Accordion, Tabs, Dropdown
- Focus rings, hover/touch states, ≥44px targets
**Exit:** components pass axe; render correctly at all breakpoints.

**Delivered:**
- `button.tsx` — variants primary/gradient/secondary/tertiary × sizes sm/md/lg (all ≥44px tall), `disabled:` styles, plus exported `buttonStyles()` so `<Link>`/`<a>` reuse the same styling. Server Component.
- `card.tsx` — `Card` (+ optional hover lift), `CardTitle`, `CardDescription`
- `badge.tsx` — tones brand/success/warning/error/info/neutral + `CHANGELOG_TONE` map for the §5.9 categories
- `input.tsx` — `Input` + `Textarea` with **visible label, `aria-invalid`, inline error via `aria-describedby`**, hint support
- `accordion.tsx` (client) — `aria-expanded`/`aria-controls`, labelled `role="region"` panels, deep-linkable `slug` anchors; **CSS-only** height animation (grid `0fr→1fr`) so it adds no animation JS
- `tabs.tsx` (client) — WAI-ARIA tabs: roving tabindex, Arrow/Home/End keys
- `dropdown.tsx` (client) — `aria-haspopup`/`aria-expanded`, Arrow/Home/End, **Escape closes + returns focus**, outside-click close; used by Resources nav + language switcher in Phase 2
- New tokens: `--pb-success-800 / warning-800 / error-800` → `--*-foreground` roles for **AA-compliant badge text on tints** (light + dark)

**Verified:** build ✅ · typecheck ✅ · **Playwright 20/20 on desktop + mobile** — incl. zero axe AA violations, accordion/tabs/dropdown keyboard + ARIA behaviour, form error wiring, and every in-page control ≥44px.

**Bugs caught & fixed during verification:**
1. **Badge contrast failed AA** (success 4.31:1, warning below threshold on their tints) → darkened status text to the 800 shades.
2. **Dropdown Escape didn't close** — focus stays on the trigger after a click, so the menu's `onKeyDown` never fired → moved Escape to a document-level listener.

_Known gap for Phase 2: dark mode currently requires the `.dark` class; the **theme toggle + `prefers-color-scheme` default + no-flash script** are Phase 2 work._

### Phase 2 — Global chrome ✅ **COMPLETE (2026-07-15)**
- **Header** (sticky, Resources ▾ dropdown, mobile drawer, theme toggle, Install CTA)
- **Footer** (links, WhenLab apps, newsletter, social, badge)
- Skip-to-content, branded **404**, cookie-consent banner shell
**Exit:** navigation fully keyboard-operable; a11y gate passes.

**Delivered:**
- `lib/site-config.ts` — single source for nav, footer links, WhenLab apps, socials, Shopify URL, rating (labels move to message files in Phase 8)
- `layout/header.tsx` — sticky, condenses on scroll, `aria-current="page"`, Resources dropdown, mobile hamburger
- `layout/mobile-nav.tsx` — `role="dialog"` `aria-modal`, **focus trap**, Escape to close, focus restored to trigger, background scroll lock
- `layout/footer.tsx` — brand blurb, Useful Links, WhenLab apps, newsletter form, socials (labelled SVGs), copyright
- `layout/theme-script.tsx` + `theme-toggle.tsx` — **closes the Phase 1 dark-mode gap**: no-flash pre-paint script, `prefers-color-scheme` default, persisted choice, `useSyncExternalStore` (DOM class as external store)
- `layout/skip-link.tsx`, `layout/cookie-consent.tsx` (consent shell + `getConsent()` + `pb-consent-change` event for Phase 9 analytics gating), `app/not-found.tsx` (branded 404)
- Root layout wires SkipLink → Header → `<main id="main">` → Footer → CookieConsent

**Verified:** lint ✅ · typecheck ✅ · build ✅ · **Playwright 35 passed / 1 intentionally skipped** (desktop + mobile), incl. zero axe AA violations **in both light and dark**. Visually confirmed via screenshots (light, dark, mobile drawer).

**Bugs caught & fixed during verification:**
1. **`hidden sm:inline-flex` never hid the Install CTA** — `buttonStyles()` sets `inline-flex`, and Tailwind's CSS source order beat the `hidden` utility → caused **horizontal scroll at 320px**. Fixed by hiding a wrapper element instead of overriding `display`. _(Lesson: don't override `display` on `buttonStyles()` output.)_
2. **Dark-mode primary failed AA** — `#2F6BFF` was 4.36:1 as text on `bg-950` and 4.2:1 behind ink text. Added `--pb-blue-300/200`; dark `primary` now ~8:1 both ways.
3. **`--inverse` wrongly flipped to white in dark**, making the footer white with light text (1.18:1). Corrected: `inverse` is the *always-dark* emphasis surface in both themes, matching the §6 table.
4. **Error red 4.4:1** on `elevated-800` → added `--pb-error-400` for dark.
5. **`link-in-text-block`** — inline links relied on colour alone → underlined them.
6. React 19 lint: `setState` in effect (theme toggle, consent) → refactored to `useSyncExternalStore`; stale-ref cleanup warning in the drawer → captured ref in-effect.

_Deferred to Phase 8: the **language switcher** (needs locale routing before it can link anywhere real)._

### Phase 3 — CMS adapter + demo data ✅ **COMPLETE (2026-07-15)**
- `lib/cms/*` typed models: `Post`, `DocArticle`, `FaqItem`, `ChangelogEntry`, `Partner`, `Review`
- Fixture/demo dataset (seeded from §3 extracted content + 3 real Shopify reviews)
- Adapter interface designed so real API swaps in with **no page rewrites**
**Exit:** pages can consume content without the real API existing.

**Delivered:**
- `lib/cms/types.ts` — `Locale`, `Seo`, `Person`, `Category`, `Post`, `DocArticle`, `FaqItem`, `ChangelogEntry`, `Partner`, `Review`, `AggregateRating`, `Paginated<T>`, `ContentRef`
- `lib/cms/adapter.ts` — the **`CmsAdapter` contract**: `listPosts` (paginated + category filter), `getPost`, `listRelatedPosts`, `listCategories`, `listDocs`, `getDoc`, `listFaqs` (category + limit → powers every FAQ teaser), `listChangelog`, `listPartners`, `listReviews`, `getAggregateRating`, and `listAllContentRefs` for the self-updating sitemap (§4.3). Every method takes `locale`.
- `lib/cms/fixtures/` — demo data seeded from real extracted content: **10 blog posts** (real titles/slugs/dates, author + reviewer), **7 doc articles** in 2 categories, **8 FAQ items** across 5 categories (`needsRealAnswer` flags the ones still awaiting client copy, §9 #3), **16 changelog entries** (launch date corrected to Jun 23 2025 per §9), **4 partners**, **3 real Shopify reviews**, aggregate **4.9 / 16**
- `lib/cms/fixture-adapter.ts` — implements the contract; async by design so call sites don't change when HTTP replaces it. Pagination, newest-first sorting, related-post top-up, and the §8 **locale fallback to English**.
- `lib/cms/index.ts` — the **single import surface** (`cms`, types, `DEFAULT_LOCALE`). Phase 9 swaps the adapter here in one line.

**Verified:** lint ✅ · typecheck ✅ · build ✅ · **Playwright 47 passed / 1 skipped** (desktop + mobile). New `tests/cms.spec.ts` asserts posts render with author/reading-time, newest-first ordering, pagination metadata, FAQ deep-link anchors from `slug`, aggregate rating matching the Shopify listing, and changelog category badges — all through **rendered output**, the same path real pages take.

**Architecture guarantee (checked, not assumed):** `grep` confirms nothing under `app/` or `components/` imports `fixture-adapter` or `fixtures/` — the only CMS import anywhere is `@/lib/cms`. That is what makes the Phase 9 swap a one-line change.

**Issue caught during verification:** TypeScript widened literal unions (`ChangelogCategory`, `Review.source`) to `string` through the trailing `.map()`, silently defeating the type check → introduced typed seed arrays (`Omit<T, "locale">[]`) so invalid categories now fail the build.

### Phase 4 — Home page ✅ **COMPLETE (2026-07-15)**
- All 12 sections (§5.1), hero LCP-optimized, scroll reveals, CMS-driven Reviews + blog teaser + FAQ teaser
**Exit:** Lighthouse mobile ≥95 on `/`; axe clean; responsive matrix passes.

**Delivered:** `lib/content/home.ts` (all copy in one module — mechanical to move to message files in Phase 8) · 10 section components (`Hero`, `FeatureTrio`, `BiggerOrders`, `StorefrontPersonalization`, `MobileExperience`, `ComingSoon`, `Reviews`, `BlogTeaser`, `TrialCta`, `FaqTeaser`) · `components/visuals/bundle-mockup.tsx` (pure CSS/SVG placeholder — zero image bytes until real screenshots land, §9 #10) · `lib/seo/structured-data.ts` + `JsonLd` (Organization, SoftwareApplication w/ Offers + AggregateRating + Review, FAQPage, Breadcrumb) · `app/ui-preview` internal style guide (noindexed) so the UI kit stays test-covered.

**Verified:** lint ✅ · typecheck ✅ · build ✅ · **Playwright 57 passed / 1 skipped** (desktop + mobile) · **Lighthouse mobile: Performance 96, Accessibility 100, Best Practices 96, SEO 100** (repeat runs 95–96).

**⚠️ Known gap — LCP:** simulated mobile LCP is **~2.5–2.8s**, above the §7 target of **<2.0s** (observed/unthrottled LCP is ~0.5s; CLS 0). The LCP element is the hero `<h1>`, so the remaining cost is webfont swap under slow-4G simulation. Revisit in Phase 10 (candidate levers: tighter subsetting, `size-adjust` fallback tuning, or a system-font hero). **Performance gate (≥95) is met; the LCP sub-target is not.**

#### Home revisions after user review (2026-07-15)
1. **Scroll shake near the top** — the sticky header animated its *height* (80→64px). Because a sticky header sits in layout flow, that changed the **document height by 16px** at scrollY 0, shifting every element; with Lenis inertia it read as a shake. Fixed: constant header height, only **paint** properties transition. Regression test added (`header height is stable while scrolling`).
2. **Hero too tall / content below the fold** — H1 was 72px wrapping to 5 lines; hero measured **968px**, pushing CTAs and compatibility chips off-screen on 655–800px-tall viewports. Fixed: `--text-display-xl` capped at **3rem**, tighter rhythm, microcopy + chips merged onto one row.
3. **Hero redesign** — replaced the flat bright-blue gradient with a **light, airy treatment**: near-white surface, soft brand radial washes, faded grid overlay, glass trust pill (badge + live rating), gradient-framed mockup with floating stat chips. Uses semantic tokens so it flips correctly in dark mode. _(An intermediate deep-navy version was tried and rejected as too dark.)_
4. **Hero is now full-height** — `min-h-[calc(100svh-5rem)]` with vertically centred content: `svh` avoids the mobile browser-chrome `100vh` bug, `min-h` lets it grow on short screens/long translations (on mobile the stacked layout exceeds one screen by design).
5. **Font pairing → single family** (see §6 typography) to clear the ≥95 perf gate.
6. **Hero visual → animated Build-a-Box demo** (`components/visuals/bundle-demo.tsx`), modelled on the client's real bundle UI: choose a pack → add variants → selection panel fills → Add to Cart → reset, on a ~5.7s loop.
   - Built with plain state + CSS transitions (no animation library), **pauses when off-screen or the tab is hidden**, and renders a settled static state under `prefers-reduced-motion`.
   - `aria-hidden` with **no interactive controls**: it's a decorative demo, and a looping live region would be hostile to screen readers. The hero copy carries the meaning.
   - Fixed panel/list heights so stepping never shifts layout — **CLS stays 0**.
   - **Internal coherence fix:** the first pass showed "Pack of 10" but checked out at 3 items. Pack sizes are now 3/5/10 with the loop actually *filling* the pack; the button reads "Add N more" until complete, and the pack discount only applies at 3/3 ($72 → **$60**, "Save $12").
   - Demo data (names/prices) is invented, not a real catalogue.
7. **"View Demo" CTA resolved** (§9 #13) — points at the live demo storefront `pushbundle.myshopify.com` (password-bypass link), `target="_blank"` + `rel="noopener noreferrer"`, with an sr-only "(opens in a new tab)" and an external-link icon.

8. **Feature trio redesigned** — the first pass was flat text-only cards (the old site at least had icons). Now: a **gradient icon tile**, clear title/description hierarchy, and three capability chips per card, so it scans icon → headline → specifics. Added `components/ui/icon.tsx` — **inline stroke SVGs** (zero extra requests, inherits `currentColor`, follows the tokens) rather than an icon package.
   - Fixed **uneven card heights**: `h-full` now threads through `li` → `AnimateIn` → `article`, with the chip row pinned via `mt-auto` so bottom edges align regardless of copy length.
   - `text-balance` + `hyphens-none` stop the awkward mid-word break ("One-​Click") seen in the first pass.

**Bugs caught during these revisions:** the pack chip's "Save $X" used `text-primary-foreground/80` on `bg-primary` — **4.06:1, below AA** (fixed to full opacity); the selected-items list clipped its third row; and a React 19 lint error (`setState` in effect for the reduced-motion path) → moved to `useSyncExternalStore`.

9. **Icon polish across the homepage** (2026-07-22) — extended the icon system to the remaining text-only sections: **Storefront Personalization** columns get glass icon tiles (cyan accent, suited to the dark inverse surface), and **Mobile Experience** blocks get gradient tiles beside each heading. Icons drawn from `components/ui/icon.tsx` (inline SVG, no extra requests).
   - **Bug caught:** the bundle demo's "Added to cart ✓" state was **white on `#22c55e` — 2.27:1**, failing AA. Added a `--color-success-solid` (`#15803d`) token that carries white text at ~4.9:1; the demo now uses it. _(General rule reaffirmed: `bg-success #22c55e` is a status/tint colour, not a white-text button fill.)_

10. **Vibe correction** (2026-07-22) — user felt the site read too dark/cool for a jewelry-commerce product. Decision: *mostly light, one intentional dark moment, + warm coral/amber accent*.
    - **Warm accent tokens added** (see §6 color) — coral/amber secondary for energy.
    - **The single dark moment = "Storefront Personalization"**, reworked from a flat near-black band into a **rich deep-indigo gradient** with brand + warm glows, a coral eyebrow, and a warm-accented "Proven Sales Impact" card. Reads as a premium highlight, not "the site went dark." Everything else stays light; footer remains the dark anchor.
    - **Warm section eyebrows** ("The toolkit", "Grow AOV", "Storefront personalization") add energy + hierarchy on the light sections.
    - **Bundle demo "Save $X" badge** → warm.
    - **Contrast guard (gradient blind spot, again):** the coral eyebrow initially sat on the section's bright-blue glow — low contrast, invisible to axe. Repositioned the glows so the eyebrow sits on dark indigo; warm glow moved behind the impact card. _(Reaffirmed: axe cannot judge text contrast over gradients — verify by design/measurement.)_
11. **Warm accent extended across the homepage** (2026-07-22): shared `Eyebrow` component (`components/ui/eyebrow.tsx`, `onDark` variant) applied to every section header (The toolkit / Grow AOV / Storefront personalization / Mobile-first / Social proof / From the blog / On the roadmap); added a `warm` tone to `Badge`; **Coming Soon roadmap** restyled with warm coral chips + dots, so upcoming (warm) reads as distinct from shipped (blue) features.

**Verified after revisions:** lint ✅ · typecheck ✅ · **63 tests pass** · **Lighthouse mobile 98 perf / 100 a11y / 96 BP / 100 SEO, CLS 0**.

_Note: decorative depth uses CSS radial-gradients, not large blurred elements — `filter: blur(110px)` on 34rem divs measurably cost ~2 Lighthouse points._
_Note: the hero's "+28% AOV" chip is illustrative UI (aria-hidden), consistent with the site's own "Lift AOV by 20–30%" claim — **confirm before launch** if it should show a verified figure or be removed._

**Bugs caught & fixed during verification:**
1. **Invisible CTA text** — the hero/trial "Install Free on Shopify" button rendered **white text on a white background** (verified 1:1 contrast). Cause: overriding `text-*`/`bg-*` on `buttonStyles()` output is unreliable because Tailwind's CSS source order wins — the same class of bug as Phase 2's `hidden` issue. Fixed by adding real **`inverse` / `inverseOutline` variants**. _Critically, **axe passed this** — it cannot compute contrast over a gradient background._ Added a dedicated contrast test that checks control colours directly, since the a11y gate is blind here.
2. **Horizontal scroll at 320px** — `AnimateIn`'s horizontal reveal starts translated on the x-axis, widening the page. Fixed with `overflow-x-clip` on `Section` (`clip`, not `hidden`, so no scroll container is created), plus `min-w-0` on grid children.
3. **`aria-label` on a `<p>`** (review star rating) — prohibited without a valid role → replaced with visually-hidden text.
4. **Motion was on the critical path** — Lighthouse showed ~56 KiB unused JS and simulated LCP 3.3s, breaking the perf budget. Rewrote `AnimateIn` to **IntersectionObserver + CSS transitions** (same API, no library on the critical path): unused JS halved, perf 93 → 96. `motion` stays installed for genuinely complex animation later. Added tests proving reveals still honour `prefers-reduced-motion` **and** degrade to fully-visible content without JS (styles gated behind a `js` class).

### Phase 5 — Static marketing pages ✅ **COMPLETE (2026-07-22)**
- **Pricing** (toggle, comparison table), **About us**, **Contact us** (form UI), **Privacy Policy**
**Exit:** all four match §5 outlines; a11y + responsive pass.

**Delivered:**
- Shared: `PageHero` (brand-tinted interior header), `TrustBand`, `FaqSection` (CMS + `FAQPage` JSON-LD), `Eyebrow` reused throughout.
- **`/pricing`** — `PricingPlans` (client toggle, Starter Free / Growth $14 mo · **$134.40 yr** from Shopify), `PricingComparison` (grouped table), trust band, billing FAQ, `SoftwareApplication`+`Offer`+`Breadcrumb` JSON-LD.
- **`/about-us`** — hero, Who-we-are, Mission (light card, warm) + Vision (gradient card), 6-feature grid, company stats, reviews strip (reused `Reviews`), FAQ, `Organization`/`Breadcrumb` JSON-LD.
- **`/contact-us`** — `ContactForm` (client validation, inline `aria-describedby` errors, honeypot, success state; real backend Phase 9 §9 #12), info column, 3 method cards (email live; chat→Tawk.to / meeting→Calendly Phase 9), `ContactPage`/`ContactPoint` JSON-LD.
- **`/privacy-policy`** — sticky TOC anchor nav + 9 sections + "Last updated", `Breadcrumb` JSON-LD.
- Content modules `lib/content/{pricing,about,contact,privacy}.ts`.

**Verified:** lint ✅ · typecheck ✅ · build ✅ · **97 tests pass** (new `tests/pages.spec.ts`: one-h1, axe light+dark, responsive 320–1920, pricing $134.40 toggle, contact validation+success, privacy TOC anchors) · **Lighthouse mobile all four ≥95** (pricing 98 / about 98–99 / contact 98 / privacy 96; a11y 100, CLS 0 across the board).

**Bugs caught during verification:**
1. **`aria-label` on `<span>`** again (comparison-table checkmarks) → sr-only text.
2. **Comparison table forced 320px document overflow** — a `min-width` table isn't contained by an `overflow-x-auto` wrapper (table min-content quirk; setting the wrapper to `overflow:hidden` didn't fix it, proving the wrapper wasn't the lever). Reworked to a **fully fluid table** (narrow check columns, wrapping labels) — no min-width, no horizontal scroll at any breakpoint.

**⚠️ Placeholders still needing client input before launch (§9):** Contact **phone + Dubai address** (#6a); **real FAQ answers** (#3); Privacy Policy is **draft legal copy + placeholder "Last updated" date** — needs legal review; About "team" is company-stats only (no individual members yet).

### Phase 6 — Dynamic/content pages ✅ **COMPLETE (2026-07-22)**
- **Blog** (index, `/blog/page/[n]`, `[slug]`, `category/[category]`), **Docs** (home + article), **Changelog**, **Partners**, **FAQ**
**Exit:** all routes render from the adapter; pagination/filters work.

**Delivered (all consume the Phase-3 CMS adapter; `params` awaited per Next 16):**
- **Blog** — `BlogListing` shared by index/pagination/category; `PostCard` + numbered `Pagination` (crawlable `<a>`, `rel=prev/next`); single post with breadcrumb, **author + reviewer** (E-E-A-T), `.prose-pb` body, related posts, `BlogPosting` JSON-LD. Page-1 pagination 301→`/blog`; unknown slug → 404.
- **Docs** — home groups articles by category; article uses a **sticky sidebar category tree** (current page marked) + `.prose-pb` body + `TechArticle` JSON-LD.
- **Changelog** — `ChangelogTimeline` (client badge filter) with color-coded categories, deep-link anchors.
- **Partners** — CMS-driven grid, external "Visit" links (`rel=noopener`, new tab), "become a partner" prompt + `CollectionPage`/`ItemList` JSON-LD.
- **FAQ** (new) — `FaqBrowser` (client search + categorized accordions); **`FAQPage` JSON-LD built from the full set** so client search can't shrink structured data; deep-link anchors.
- `.prose-pb` long-form content styles added to `globals.css`.

**Verified:** lint ✅ · typecheck ✅ · build ✅ · **149 tests pass** (new `tests/content-pages.spec.ts`: one-h1 + axe light/dark + responsive across 9 routes, BlogPosting author/reviewer, page-1 redirect, 404, changelog filter, FAQ search + full JSON-LD + anchors, docs sidebar current, partner new-tab safety) · **Lighthouse mobile all routes ≥93 perf, a11y 100, BP 100, SEO 100** (blog/faq/partner 99, changelog 95, docs 93–94).

**Bugs caught during verification:**
1. **Relative canonicals** (`alternates.canonical: "/blog"`) rendered invalid → Lighthouse SEO 91 on every dynamic route. Fixed by setting `metadataBase` once in the root layout → SEO 100 (also lifts the static pages).
2. **Heading-order** — post/partner cards rendered `h3` directly under the page `h1`, skipping `h2` → axe/Lighthouse a11y 98. Made `PostCard`/partner `CardTitle` level context-aware (`h2` when the primary list under an `h1`, `h3` inside a "Related" `h2`).
3. Axe sampled the brand badge **mid-fade** (4.43:1 blended; 4.71:1 at rest) — the recurring transition blind spot. Ran the axe tests with **reduced-motion emulated** so reveals are instant and no colour is sampled mid-transition.

### Phase 7 — SEO / AEO / GEO ✅ **COMPLETE (2026-07-22)**
- `generateMetadata` per route, JSON-LD (`SoftwareApplication`, `Article`, `FAQPage`, `Organization`, `Breadcrumb`, `Review`)
- **Auto-updating `sitemap.xml`** (§4.3), `robots.txt`, `llms.txt`, OG image generation
- **Legacy 301 redirects** (trailing-slash → non-trailing; monthly archives → `/blog`)
**Exit:** redirects verified against the old URL list; structured data validates.

**Delivered (followed the `nextjs-seo-website` skill; Next 16 `proxy` not `middleware`):**
- **Metadata foundation** — root title **template** (`%s | PushBundle`) + default OG/Twitter + `robots` in `app/layout.tsx`; `lib/seo/metadata.ts` `pageMetadata()` helper (explicit OG image per page); all 9 static pages + dynamic routes converted → **unique `og:title` + absolute canonical + share image each** (verified via curl).
- **Root JSON-LD `@graph`** — Organization + WebSite + SoftwareApplication (AggregateOffer + AggregateRating), cross-referenced by `@id`, in the layout.
- **`app/sitemap.ts`** — static routes + live CMS refs (34 URLs), resilient (CMS blip → static-only, not empty), `revalidate: 900`.
- **`app/robots.ts`** — allow + disallow `/api/`, `/ui-preview`; **AI-bot allowlist** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …); blanket disallow when `VERCEL_ENV !== production`.
- **`app/llms.txt`** — AEO/GEO fact sheet incl. a **"What PushBundle is NOT"** section (clarifies it's *not* a push-notification app — important disambiguation for AI engines).
- **`app/og-image/route.tsx`** — generated 1200×630 brand card (SVG mark; avoided ▾/★ tofu glyphs that next/og's default font lacks).
- **`app/icon.svg`** — branded favicon (replaces the default).
- **Redirects** (`next.config.ts`) — monthly archives `/blog/YYYY/MM`→`/blog`, `/partners`→`/partner`; Next auto-301s trailing slashes. All verified 308 → land 200.
- **`proxy.ts`** — host-gated staging noindex (`X-Robots-Tag`), because an env flag can't tell the prod `*.vercel.app` alias from the real domain.

**Verified:** lint ✅ · typecheck ✅ · build ✅ · **149 tests pass** · sitemap 34 `<loc>` · robots + AI allowlist · llms.txt · og-image 200/png · redirects 308→200 · unique per-page OG/canonical · **Lighthouse SEO 100** (home/pricing/blog/docs), perf 93–98.

**Issue caught:** local Lighthouse SEO first read **66** — the staging-noindex was (correctly) firing on `localhost`. Since localhost is never publicly crawlable, added it (+127.0.0.1) to the indexable set so local scores are truthful; confirmed a real `*.vercel.app` host **still** gets `noindex`.

### Phase 8 — i18n rollout ✅ **COMPLETE (2026-07-22)**
- ~~`next-intl`~~ **native Next 16 i18n** (`proxy.ts` + `app/[lang]` + server dictionaries) — see §8 revision. `i18n/config.ts` one-file source, `/messages/{locale}.json` × 7 (6 are English placeholders until translated).
- Language switcher (path-preserving), `hreflang` + canonicals, CJK fonts for `ja`/`zh`, CMS locale param + English fallback
**Exit:** all 7 locales navigable; hreflang correct; no layout breakage in CJK/German (long words).

**Delivered:**
- `i18n/config.ts` (locales, native names, hreflang, `localizePath`), `i18n/dictionaries.ts` (`getDictionary` + English fallback), `messages/{en,de,fr,es,it,ja,zh}.json`.
- **All routes moved under `app/[lang]/`**; `[lang]/layout.tsx` is the root html layout (dynamic `<html lang>`), SEO route handlers stay at `app/` root.
- **`proxy.ts`** — as-needed routing: unprefixed paths **internally rewritten** to `/en` (URL stays clean), prefixed locales pass through, `/en/*` → 308 to unprefixed. Composes the staging-noindex header.
- **Localized chrome** — Header/Footer/MobileNav take `locale`+`dict`; nav/footer labels from the dictionary, hrefs via `localizePath`. **`LocaleSwitcher`** (native-name dropdown, path-preserving). **`LocaleLink`** aliased as `Link` across content components so internal links stay in-locale.
- **Per-locale SEO** — every page emits `hreflang` alternates (all 7 + `x-default`) + a **self-canonical per locale**; `sitemap.xml` carries `xhtml:link` alternates (238 of them).
- **CJK fonts** — Noto Sans JP/SC loaded **only** on `ja`/`zh` (tree-shaken off Latin pages, verified).
- **Branded localized 404** — catch-all `[lang]/[...rest]` → `notFound()` (a root html layout under `[lang]` means unmatched URLs need this to reach `[lang]/not-found`).

**Verified:** lint ✅ · typecheck ✅ · build ✅ (**85 static pages** = 7 locales × routes) · **149 tests pass** · routing (en unprefixed, `/de` etc. prefixed, `/en/*`→308) · `<html lang>` per locale (`zh`→`zh-Hans`) · hreflang + canonical + sitemap alternates · CJK font on ja/zh only · branded 404 (en + de).

**Bugs caught during verification:**
1. **Header active-state broke** — `usePathname()` returns the *rewritten* `/en/…` path, so matching the unprefixed `homeHref` failed. Fixed to compare **bare** (locale-stripped) paths.
2. **Branded 404 didn't render** for unmatched URLs — with the html layout under `[lang]`, there's no root `not-found`; added the `[...rest]` catch-all.
3. **Test suite hung** against `npm run dev` — dev compiles each route×locale on demand (85 combos). Ran against the **production build** instead → 33s.

**⚠️ Open items:**
- **Translations don't exist** — the 6 non-English dictionaries are English copies; marketing pages render English until translated, dynamic content until the CMS returns localised copy (Phase 9). This is the planned split (§8), not a defect.
- **Perf caveat (verify on deploy):** local `next start` shows home perf ~**90** (LCP ~3.4s) vs 96 pre-i18n — TTFB from the proxy rewrite + dictionary load in the local Node server. Pages are SSG (●), so on Vercel edge + CDN this overhead should be minimal; **re-verify the ≥95 gate on the real deployment**. `/ja` ~76 is the inherent CJK font weight — revisit font-display/subsetting in Phase 10.

### Phase 9 — Integrations _(needs §9 supply items)_ — 🟡 **CMS API + Tawk.to COMPLETE (2026-07-22)**; rest deferred
**Done this pass (per client scope "only CMS API + Tawk.to"):**
- **Real Efoli CMS API** wired via `httpAdapter` (`lib/cms/http/{client,mappers}.ts` + `http-adapter.ts`), selected in `lib/cms/index.ts` when a CMS base is configured. Every method **falls back to fixtures on error/empty** (a transient failure or an empty CMS never blanks the site or sitemap). WordPress-migrated HTML is **sanitized** (`isomorphic-dompurify`) before render.
- **On-demand revalidation** `POST /api/revalidate` (nodejs) — token-gated on `REVALIDATE_SECRET` (401 without/with wrong token), `revalidatePath(path)` + `revalidateTag("cms","max")`. Proxy now passes `/api/*` through untouched (was being locale-rewritten → 404).
- **Tawk.to live chat** — zero-dependency lazy loader (`components/integrations/live-chat.tsx`), injected only after first interaction / 6s idle, **production + `NEXT_PUBLIC_TAWK_SRC` gated** (0 third-party scripts on load). Mounted globally in the locale layout. `openLiveChat()` exported for a future Contact "Let's Chat" wiring (deferred per client).
- **Layout hardening from real content:** live partner/changelog data carried long unbreakable tokens that blew out grid tracks at 320–768px → added `wrap-break-word` to `Card` title/description + changelog entry text, `min-w-0` on the partner grid item. No horizontal scroll 320–1440.
- **Deterministic tests:** `CMS_USE_FIXTURES=1` force-selects fixtures (no network); Playwright `webServer.env` sets it so the suite asserts a stable dataset regardless of a local `.env.local` pointing at a populated CMS. **149 pass** (fixtures); live multivariants build verified via curl smoke checks (real posts/reviews/partners render, unknown slug → 404, sanitized body).

**Deferred to a later pass (client: "other will later"):** Contact form + newsletter backend; **Calendly**; **GA4 + Meta Pixel gated by cookie consent**.
**Exit (full phase):** live content flows; publishing updates site + sitemap; analytics only fire post-consent.

### Phase 10 — QA, polish & launch
- Full Playwright pass: responsive matrix, axe a11y, light/dark + multi-locale visual, functional smoke
- Lighthouse mobile ≥95, bundle-size check vs budget; manual keyboard + screen-reader pass
- Staging `noindex` verified; production robots/sitemap; launch + post-launch redirect/GSC check
**Exit:** all quality gates green → ship.

**Dependency notes:** Phases 0–8 are fully unblocked today. **Phase 9 is the only one gated** on client supply (CMS API details, form/newsletter backend, phone/address, FAQ answers, assets — §9). Content copy (FAQ answers, translations) can land in parallel from Phase 6 onward.

---

## Changelog

- **2026-07-10** — Document created; awaiting requirements and old-site links.
- **2026-07-10** — Animation decision recorded: Motion (`motion/react`) + Lenis smooth scroll, with reduced-motion / GPU / SSR guardrails (§6).
- **2026-07-10** — Performance budget recorded: Lighthouse mobile ≥95, LCP <2s, ~≤100KB first-load JS; server-first + progressive enhancement so first paint never waits on Motion/Lenis (§7).
- **2026-07-10** — Color scheme recorded from logo: indigo→cyan brand gradient, blue-500 `#2C5BF0` primary, light/dark neutrals, semantic set, AA guardrails (§6).
- **2026-07-10** — Semantic UI roles (button primary/secondary/tertiary, section backgrounds) + two-layer design-token architecture (primitives → semantic roles in one `@theme` file) for one-place rebrand (§6).
- **2026-07-10** — Visual polish checklist (typography, spacing, depth, signature moments, design-system kit, dark mode) + WCAG 2.1 AA accessibility standard recorded (§6).
- **2026-07-14** — Homepage content extracted into §3; Overview (§1) filled: PushBundle = Shopify bundle app for retail + B2B, primary CTA "Install Free on Shopify".
- **2026-07-14** — Old-site content inventory complete (§3): extracted Home, Pricing, About, Contact, Partners, Docs, Blog (~54 posts), Privacy, Changelog. FAQ marked NEW (to build). Open questions consolidated (§9).
- **2026-07-14** — Resolved: content from **existing headless CMS via API** (build API-agnostic adapter now) (§7); i18n split — **marketing pages manual, dynamic content from CMS** (§8). Open questions #1/#2/#5/#9 closed.
- **2026-07-14** — Resolved: Partners = CMS-driven (demo data); legal = Privacy Policy only; Contact = Tawk.to + Calendly + phone/address; URL scheme = no trailing slash + 301 redirects + `/zh`. §9 down to content/asset-supply items only.
- **2026-07-14** — Sitemap (§4) drafted: full route map (static/dynamic/system), nav+footer, and **auto-updating `sitemap.xml`** generated from CMS with hreflang alternates, CMS `updatedAt` lastmod, ISR + webhook revalidation, resilient fallback.
- **2026-07-14** — Sitemap finalized: keep old slugs; monthly blog archives 301→`/blog` (no archive pages). Home page content outline drafted (§5.1) — 12 sections incl. new social-proof block + JSON-LD.
- **2026-07-14** — Home: Reviews section is **CMS-driven** (`Review` model added to adapter, §7); powers `Review`/`AggregateRating` JSON-LD (§5.1).
- **2026-07-14** — Pulled Shopify listing (apps.shopify.com/push-bundle): **4.9★/16, Built for Shopify**, added to §1 + hero trust strip. Flagged discrepancies (yearly price $148 vs $134.40, launch date, 7 vs 8 languages incl. Portuguese) in §9.
- **2026-07-14** — Resolved discrepancies (Shopify = source of truth): yearly **$134.40**, launch **Jun 23 2025**, features from listing. **Website stays 7 locales** ("locally rely on 7"); Portuguese remains Shopify-app-only (revertable one-liner). Reverted §8 to 7.
- **2026-07-14** — Pricing page outline drafted (§5.2): 2 tiers w/ toggle ($14/mo · $134.40/yr), new comparison table, trust band, pricing FAQ, `Offer`/`AggregateRating`/`FAQPage` JSON-LD.
- **2026-07-14** — About us outline drafted (§5.3): hero, who/mission/vision, 6-feature grid, new Team/Company section, reviews strip, `Organization`/`AboutPage` JSON-LD.
- **2026-07-14** — Contact us outline drafted (§5.4): hero, form+info, 3 method cards (email/Tawk.to/Calendly), `ContactPage`/`ContactPoint` JSON-LD. Map dropped per user.
- **2026-07-14** — FAQ page outline drafted (§5.5, NEW): search + categorized accordions from CMS, support CTA, `FAQPage` JSON-LD for AEO/GEO.
- **2026-07-14** — Partners outline drafted (§5.6): CMS-driven partner grid (4 seed), optional "become a partner" prompt, `CollectionPage`/`ItemList` JSON-LD.
- **2026-07-14** — Blog outline drafted (§5.7): `Post` model, index+pagination, category archives, single-post template w/ author+reviewer, TOC, related, `Article`/`BlogPosting` JSON-LD, ISR.
- **2026-07-14** — Docs outline drafted (§5.8): `DocArticle` model, docs home w/ categories+search, article template w/ sidebar tree + TOC, `TechArticle` JSON-LD, ISR.
- **2026-07-14** — Changelog (§5.9) + Privacy Policy (§5.10) outlines drafted. **§5 per-page outlines COMPLETE (all 10 pages, §5.1–5.10).**
- **2026-07-14** — Testing/QA tooling recorded (§7): Playwright + Chromium dev dependency for responsive matrix, axe-core a11y gate, light/dark + multi-locale visual checks, functional smoke, Lighthouse.
- **2026-07-14** — Responsive design strategy recorded (§6): mobile-first, fluid `clamp()` scaling, Tailwind breakpoints, responsive nav/switcher, image `sizes`, ≥44px touch targets, device test matrix, no horizontal scroll.
- **2026-07-14** — i18n architecture recorded (§8): 7 locales, English default (no prefix) + `/de /fr /es /it /ja /zh` prefixed, `next-intl` `as-needed`, per-locale messages single source of truth, hreflang/canonical/localized metadata/sitemap alternates, accessible language switcher, CJK font subsetting.
- **2026-07-14** — Full-plan review pass: filled §2 Requirements (consolidated); added GDPR **cookie-consent** decision (§7); reconciled Changelog nav (under Resources); refreshed date/stale notes; added open items #12–14 (form/newsletter backend, View Demo target, consent provider).
- **2026-07-15** — Fonts decided (§6): **Plus Jakarta Sans** (display) + **Inter** (body), self-hosted variable via `next/font`; **Noto Sans JP/SC** per-locale for CJK; exposed as `--font-display`/`--font-sans`.
- **2026-07-15** — **§10 Build Phases** added: 11 phases (0–10) from foundation → UI kit → chrome → CMS adapter → Home → static pages → dynamic pages → SEO → i18n → integrations → QA/launch, with exit criteria. Only Phase 9 is gated on client supply.
- **2026-07-15** — **Phase 0 COMPLETE**: design tokens, fonts, Container/Section, Lenis + AnimateIn, Playwright config + foundation tests. Build/typecheck green; 5/5 Playwright tests pass desktop+mobile incl. zero axe AA violations. Logged Next.js 16 breaking changes affecting §7/§8 (middleware→proxy, async params, revalidateTag 2nd arg, scroll-behavior, image defaults).
- **2026-07-15** — **Phase 1 COMPLETE**: core UI kit (Button, Card, Badge, Input/Textarea, Accordion, Tabs, Dropdown) with full ARIA/keyboard support. 20/20 Playwright tests pass desktop+mobile. Fixed 2 real defects found by the gates: badge AA contrast, dropdown Escape handling. Added AA status-text tokens.
- **2026-07-15** — **Home revisions after review**: fixed sticky-header scroll shake (height→paint-only transitions, + regression test); hero redesigned light/airy and made full-height (`min-h-[calc(100svh-5rem)]`); H1 capped at 3rem so all hero content fits above the fold on 655px-tall viewports; **switched to a single type family** (Plus Jakarta Sans) which lifted Lighthouse mobile **94 → 96–98**. 59 tests pass.
- **2026-07-22** — **Phase 8 COMPLETE**: native Next 16 i18n (proxy + app/[lang] + dictionaries, NOT next-intl) — 7 locales (en unprefixed, /de… prefixed), localized chrome + LocaleSwitcher + LocaleLink, hreflang + per-locale canonical + sitemap alternates, CJK fonts for ja/zh, branded localized 404. 85 static pages, 149 tests pass. 6 non-en dictionaries are English placeholders (translations pending). Perf caveat: local home ~90 (proxy TTFB) — re-verify ≥95 on Vercel edge.
- **2026-07-23** — **Fixed Vercel serverless 500 on `/blog/{slug}` + `/docs/{slug}`.** Root cause: `isomorphic-dompurify` uses **jsdom**, which fails in Vercel's serverless runtime — the only pages that sanitize CMS HTML body 500'd (listings were fine). Swapped `sanitizeHtml` to **`sanitize-html`** (pure JS), configured to preserve heading `id`s + `#` anchors (the TOC), tables, lists, `nav`, images, and inline formatting while dropping scripts/styles. Verified live: both single pages return 200 on Vercel.
- **2026-07-23** — **Reviews auto-scroll marquee + draft preview.** Reviews (CMS "opinions") now render as a smooth, continuous CSS marquee (`.marquee` in globals.css, 45s linear) that **pauses on hover/focus** and **zooms the hovered card**; cards are duplicated once (copy `aria-hidden`) for a seamless `-50%` loop, and it degrades to a horizontal scroll under reduced-motion. Bumped the review fetch to 12. **Draft preview** implemented per `cmd.md`: `/api/preview` (token-gated, 401 without `PREVIEW_SECRET` → enables draft mode → redirects to the post), `/api/preview/exit`, and a draft-aware `getPreviewPost()` (forwards `x-preview-token`, `no-store`) used only by the blog post page — scoped there (not the global `cmsFetch`/layout) to keep the rest of the site statically generated. Preview posts show a banner + are `noindex`. Verified: 401 gating, redirect + draft cookie, banner + noindex with the real secret, exit → `/`. 155 tests pass.
- **2026-07-23** — **New `/features` page.** Comprehensive features page (`app/[lang]/features/page.tsx` + `lib/content/features.ts`): dark aurora hero + dual CTA → 6-category toolkit grid (IconTile cards with capability chips) → 3 alternating spotlight sections (Mix & Match · B2B/Volume · Built-for-speed) with checklist panels → free-plan nudge → reused Reviews/TrialCta/FaqSection. Wired **"Features" into the nav** (all 7 message JSONs + header + mobile drawer) between Home and Pricing; added a **"See more features"** button to the home `FeatureTrio`; added `/features` to `sitemap.ts`. **Header nav breakpoint moved `md`→`lg`** so the now-5-item nav doesn't overflow at 768px (768–1023 uses the mobile drawer). Added `/features` to the static-page test suite (h1 + axe light/dark + no-overflow) — all green.
- **2026-07-23** — **Three polish fixes.** (1) Home "Expert Reads" teaser now renders the shared `PostCard` (was a bespoke card) so it matches the blog listing. (2) `TrialCta` reworked from a flat, washed-out full-bleed gradient into a contained rounded card with a dark bottom-vignette + faint grid texture + elevation — white copy is crisp instead of hazy. (3) **Heading line-height bug**: the global `h1–h4 { line-height: 1.1 }` was written **unlayered**, so it beat Tailwind's `leading-*` utilities (utilities layer) and pinned every heading to 1.1 — cramped card titles. Moved the heading base into `@layer base` and set 1.15, so `leading-*` overrides now work (blog-card title went 1.10 → 1.38). Also fixed the nav "reload on click" — `Dropdown` (Resources menu) rendered a plain `<a>` instead of `next/link`; verified client-side nav now. Added the "About the author" block to single posts. 149 tests pass.
- **2026-07-23** — **Blog single-post redesign** (matched to efoli.com / multivariants.com reference designs). Dark aurora hero band (breadcrumb · category chip · date/updated/read-time · full-width H1 · lead · author avatar+name · social share) → cover image overlapping the hero → two-column body with a **sticky scroll-spy Table of Contents** + prose. `lib/blog/toc.ts` `processArticle()` lifts the CMS's own inline TOC into the sidebar and **auto-generates one from the h2/h3 headings when a post has none** (injecting anchor ids); it also wraps `<table>`s for horizontal scroll. Added `prose-pb` **table styling** (first-row header, zebra, bordered, scrollable). Stripped WordPress's trailing " […]" read-more marker from excerpts in `mapPost`. Fixed a mobile overflow (wide table blew out the grid column → mobile is now `flex-col`, grid only at `lg`, body col `min-w-0`) and widened the hero so it fills the width. 149 tests pass (incl. axe light+dark on the post page).
- **2026-07-22** — **CMS base URL is now env-only + compact pagination.** Removed the hardcoded `efoli-cms.vercel.app` fallback in `lib/cms/http/client.ts` — `CMS_BASE` comes entirely from `CMS_SITE_URL` (trailing slash tolerated; API paths appended in code), `CMS_SITE` from env; unset → fixtures. Root cause of "missing covers/logos + only ~18 posts" was env layering: `.env` points at the real CMS `https://cms.efoli.com` (**234 posts / 47 pages, all with covers; 44 partners all with logos**) but a local `.env.local` was overriding it with the staging `efoli-cms.vercel.app`/`multivariants` (empty covers). Verified a fresh build against `cms.efoli.com` renders real covers, avatars, partner logos, and **24-page** blog pagination. Made `Pagination` **compact/truncated** (first · last · current±1 · `…` gaps) so a 24-page corpus no longer renders 24 buttons. 149 tests pass.
- **2026-07-22** — **CMS adapter hardening (shape tolerance).** Diagnosed "only ~18 posts, no covers, no partner logos" as the **fixture fallback** (17 demo posts / 43 demo partners, none with images) — triggered when the live CMS call fails or returns an unrecognised shape. Added `readListEnvelope()` (accepts the list under `posts`/`data`/`items`/`results`/`docs` or a bare array; reads total/totalPages/page/limit under several key aliases and **derives totalPages when omitted** so pagination reflects the real corpus, not one page) and `pickImage()` (resolves an image from string or `{url|src|sourceUrl|…}` across `coverImage`/`image`/`featuredImage`/`thumbnail` and `logoUrl`/`logo`/`image`/`icon`). On `efoli-cms.vercel.app`, every WhenLab slug is empty except `multivariants` (20 posts, **all `coverImage:null`**; 44 partners, **all `logoUrl:null`**) — so a CMS with 200+ posts + images must live at a different URL/slug than the repo's `.env.local`. Live regression (multivariants) + 149 fixture tests still green.
- **2026-07-22** — **Full visual redesign — "futuristic / sleek dark-first" (§6 rebrand).** Per client direction (sleek dark-first · electric violet+cyan · both themes polished). Reworked the palette at the **primitive layer** (kept token names so components that reference primitives directly rebrand automatically): brand is now electric **violet → indigo → cyan**, magenta as the tri-tone accent (legacy `blue-*`/`coral-*` primitives now hold the violet/fuchsia ramps), deeper blue-violet dark surfaces. Made **elevation shadows theme-aware** — dark cards get a hairline top-highlight (glass edge) + deep ambient shadow; added a brand **glow** shadow for primary/gradient CTAs. Added `glass`, `glow`, `gradient-border` utilities + a fixed low-alpha **aurora** ambient behind all content (default `Section` tone is now transparent so it shows through; solid `--background` still sits beneath, so AA is unchanged). Retuned `section-wash`. **All 149 tests pass incl. axe contrast in light AND dark on every page** — the new palette was tuned to AA (verified, not assumed). Updated the two `foundation` token-value assertions to the new hexes. Cover images/mockups render bright (violet→cyan), not dimmed.
- **2026-07-22** — **Content-page UX pass (post-Phase-9 review):** blog card redesigned (category chip + "min read" chip overlays, right-sized title — fixed a `text-lg` being overridden by `CardTitle`'s `text-display-sm`, now an explicit heading; author+date footer, uniform heights via `line-clamp`); blog gains a **category filter panel** (bordered, per-category counts, "N results on this page") + **client-side search** across all posts (server URL pagination preserved for SEO — `/blog/page/N` crawlable); **docs search** (client filter over grouped articles); **partner pagination** (client-side, 9/page — the live CMS has 44 partners). Fixed a `Card` `p-6`/`p-0` conflict (`cn` is not tailwind-merge) by adding a `padded` prop — it was pushing media cards past the mobile viewport. Added `decodeEntities()` to the CMS mappers so WordPress-encoded text (`&#038;` → `&`) renders correctly in titles/names/excerpts. 149 tests pass; no horizontal scroll 320–1440 on live data. Known CMS data-quality items (owner to fix): some blog excerpts contain byline meta text; some partner descriptions are raw UTM URLs.
- **2026-07-22** — **Phase 9 partial — CMS API + Tawk.to COMPLETE** (client scope: "only CMS API + Tawk.to, other later"). Real Efoli CMS wired via `httpAdapter` (map + sanitize + resilient fixture fallback); token-gated `/api/revalidate` (401 verified); proxy now excludes `/api/*` from locale rewrite; Tawk.to zero-dep lazy loader mounted globally (prod + `NEXT_PUBLIC_TAWK_SRC` gated, 0 scripts on load). Fixed real responsive overflow (long CMS tokens) on `/partner` + `/changelog` via `wrap-break-word` + `min-w-0`. Added `CMS_USE_FIXTURES=1` so the e2e suite is deterministic regardless of `.env.local`; **149 pass**, live integration curl-verified against `multivariants`. Deferred: Calendly, GA4/Pixel, form/newsletter backend.
- **2026-07-22** — **Phase 7 COMPLETE** (via `nextjs-seo-website` skill): metadata foundation (title template + `pageMetadata` helper, unique per-page OG/canonical), root JSON-LD @graph, auto-updating sitemap (34 URLs, resilient), robots + AI-bot allowlist, llms.txt, generated /og-image, branded icon.svg, legacy redirects, host-gated staging noindex (Next 16 `proxy.ts`). Lighthouse SEO 100; 149 tests pass. Caught the localhost-noindex false-66 (localhost now indexable; real staging still noindexed).
- **2026-07-22** — **Post-Phase-6 fixes**: (1) `wash` section tone added (soft brand gradient; lifts dark mode off flat-black) — applied to Feature trio + Mobile Experience. (2) **Lenis scroll broke in real browsers** (worked headless) — root cause: the required Lenis CSS was never added; `html.lenis body { height: auto }` overrides the `h-full`/`min-h-full` → inlined the Lenis stylesheet. (3) Header dropdown items had no gap (active/hover highlights touched) → `gap-0.5`. (4) Added `MediaHolder`/`LogoHolder` — blog cover-image placeholders (cards + single post) and partner logo placeholders, gradient-branded until real CMS assets land (§9 #10), auto-swap to the image when `coverImage`/`logo` is set.
- **2026-07-22** — **Phase 6 COMPLETE**: dynamic content pages — Blog (index/pagination/category/post), Docs (home/article), Changelog, Partners, FAQ — all CMS-adapter-driven. 149 tests pass; Lighthouse all routes a11y 100 / SEO 100 / perf ≥93. Fixed relative-canonical (→ `metadataBase`), heading-order (context-aware card levels), and the recurring axe-mid-fade sampling (reduced-motion in tests).
- **2026-07-22** — **Phase 5 COMPLETE**: Pricing, About us, Contact us, Privacy Policy. Shared PageHero/TrustBand/FaqSection/Eyebrow; warm accent carried through. 97 tests pass; Lighthouse mobile all four ≥95, a11y 100, CLS 0. Fixed a min-width-table 320px overflow (→ fluid table) and another span aria-label. Placeholders flagged: contact phone/address, FAQ answers, privacy legal copy/date, About team.
- **2026-07-15** — **Phase 4 COMPLETE**: Home page — all 12 sections, CMS-driven reviews/blog/FAQ, JSON-LD. Lighthouse mobile **96 perf / 100 a11y / 96 BP / 100 SEO**; 57 tests pass. Swapped Motion for CSS+IntersectionObserver reveals to meet the perf budget. Caught an **invisible white-on-white CTA that axe could not detect over a gradient** — added a direct contrast test. LCP (2.7s simulated) still above the <2s sub-target; logged for Phase 10.
- **2026-07-15** — **Phase 3 COMPLETE**: CMS adapter layer (`CmsAdapter` contract + fixture implementation + demo data seeded from real extracted content) behind a single `@/lib/cms` import. 47 passed/1 skipped. Verified pages never reach past the boundary, so the Phase 9 API swap is a one-line change.
- **2026-07-15** — **Phase 2 COMPLETE**: global chrome (Header + drawer, Footer, skip link, theme toggle + no-flash script, cookie-consent shell, branded 404) + `lib/site-config.ts`. 35 passed/1 skipped; zero axe violations in light **and** dark. Fixed 6 real defects incl. a Tailwind source-order bug causing 320px overflow, dark-mode primary/inverse/error contrast failures, and React 19 lint issues.


