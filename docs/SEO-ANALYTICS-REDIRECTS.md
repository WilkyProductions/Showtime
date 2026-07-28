# SEO, Schema, Analytics, and Redirects

## SEO implementation

- Use the recommended routes in `content/route-map.csv`.
- Replace `.html` preview filenames with clean trailing-slash URLs in production.
- Keep one canonical domain across tags, schema, sitemap, ads, and business listings.
- Use unique metadata already drafted in the source as the starting point; review copy after final business details are loaded.
- Keep location pages distinct and useful.
- Add internal links between services, locations, OEM programs, facility sections, and related results.

## Structured data

Recommended graph:

- `Organization`
- `AutoBodyShop` for Running Springs
- A separate local entity for Big Bear only after its exact staffed-address details are confirmed and only with accurate service scope
- `WebSite`
- `WebPage`
- `BreadcrumbList`
- `FAQPage` only where the visible FAQ content meets current search-engine guidelines

Do not create location entities for Lake Arrowhead or Crestline when they are service areas only.

## Analytics

The static source contains `data-track` attributes and a lightweight `gtag` hook. Implement through Google Tag Manager or the production analytics layer using `content/tracking-plan.csv`.

Minimum conversion configuration:

- Photo estimate click — primary conversion
- Phone click — primary or qualified conversion
- Directions click — secondary high-intent conversion
- Review profile click — engagement

Use a call-tracking platform only if it preserves the correct business number in structured data and business profiles.

## Redirects

Start with `content/redirect-map-starter.csv`, then export every current indexed URL and backlink target. Create one-to-one 301 redirects. Never redirect every retired page to the homepage.
