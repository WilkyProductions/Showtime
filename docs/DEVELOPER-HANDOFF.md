# Developer Handoff

## 1. Delivery intent

This package is the approved visual and functional direction for the Showtime website. The `/site` folder is a maintainable static HTML/CSS/JavaScript build that can be launched as a static site or ported into WordPress, Webflow, Next.js, Astro, another CMS, or a custom stack.

Do not treat the self-contained approval preview as production source. It is included only as a visual reference. Build from `/site` or port its semantic structure into the chosen platform.

## 2. Primary business objective

The website must move stressed, high-intent visitors toward one of three actions:

1. Start the Carwise photo estimate.
2. Call Showtime.
3. Get directions or begin intake at the appropriate location.

The Carwise estimate URL is a global setting and should not be hard-coded independently in multiple CMS fields.

## 3. Approved information architecture

- Home
- Services
- Locations (includes the facility tour)
  - Running Springs — complete repair/production campus
  - Big Bear — staffed satellite, intake capability, rental cars on site
  - Lake Arrowhead — service area
  - Crestline — service area
- OEM Certifications
- Results
- Insurance
- About
- Contact

Use the pretty production routes listed in `content/route-map.csv`; the `.html` filenames exist only for portable local preview.

## 4. Conversion requirements

- Keep the primary label consistent: **Start Photo Estimate** or **Start Your Photo Estimate**.
- Route every estimate CTA to the exact Carwise URL in `content/site-config.json`.
- Keep the phone number clickable everywhere it appears.
- Keep the mobile action bar limited to Call, Estimate, and Directions.
- Preserve the accident-safety reminder near the top of the homepage.
- Do not reintroduce a custom photo-upload form unless uploads are actually stored and delivered securely.
- Do not place a generic contact form ahead of the Carwise estimate path.

## 5. Global content rules

- Never present Lake Arrowhead or Crestline as physical staffed facilities.
- Present Big Bear accurately as a staffed satellite for intake, process initiation, and on-site rental cars. State that production repairs are coordinated through Running Springs.
- Keep I-CAR Gold Class separate from OEM certification.
- Do not describe exotic experience as OEM certification.
- Reserve future exotic rebuild/modification storytelling for Results, supported by project-specific photos, video, scope, and customer permission.

## 6. OEM Certifications page

The approved preview organizes 17 makes across nine program groups. Use `content/oem-certifications.json` as the working data structure.

Before launch, replace text-only identifiers only with official, currently approved badge files supplied by Showtime or the certification program. Do not download random manufacturer logos or recreate certification marks.

For each program, verify:

- Exact current program title
- Covered makes
- Certified facility address
- Active status or renewal date
- Approved logo/badge file
- Required legal wording
- Approved official verification/shop-locator link

If a badge or current certificate cannot be verified, keep the text-only card or remove the program from the public roster.

## 7. Design implementation

The source CSS defines the approved tokens and responsive behavior. Preserve:

- Deep maroon/red `#DA0020`
- Pure black `#000000`
- Tan `#EFC58E`
- Light reading surfaces for most content
- Red reserved primarily for the dominant CTA and critical accents
- Large italic display headings with clean body typography
- Real facility, technician, repair, and vehicle photography
- Consistent card radii, container widths, and vertical spacing

Forza is the intended brand type family, but no font files are included. Obtain a valid webfont license before adding it. Do not substitute unlicensed files.

## 8. Component behavior

- Header becomes visually condensed/scrolled after the user moves down the page.
- Mobile menu must trap focus or at minimum close on link click, Escape, and desktop breakpoint.
- Before/after components use an accessible range input.
- FAQ sections use native `details`/`summary`.
- Scroll reveal must respect `prefers-reduced-motion`.
- All images require meaningful alt text.
- External directions/review links may open in a new tab; phone and Carwise estimate should remain frictionless on mobile.

## 9. CMS/content model recommendation

Create global settings for:

- Business name and legal name
- Phone
- Canonical domain
- Carwise estimate URL
- Review profile URL
- Running Springs address/hours
- Big Bear address/hours/phone/rental disclaimer
- Current review count/rating
- Warranty statement
- I-CAR status

Create repeatable collections for:

- OEM programs
- Locations/service areas
- Repair results/case studies
- Reviews
- FAQs
- Facility/equipment features (part of the Locations page)

## 10. Performance requirements

- Serve responsive AVIF/WebP with width variants, not one oversized image to every device.
- Preload only the visible logo and homepage hero.
- Lazy-load below-the-fold media.
- Set explicit width and height to reduce layout shift.
- Target Core Web Vitals in the green range on representative mobile hardware.
- Keep third-party scripts deferred and minimal.
- Avoid autoplay background video on mobile; use a poster and click-to-play for future Results videos.

## 11. Accessibility requirements

- WCAG 2.2 AA target.
- Maintain visible keyboard focus.
- Preserve the skip link and semantic heading order.
- Verify red/black/tan combinations against contrast requirements.
- Do not place critical text only inside images.
- Rebuild review screenshots as native text before final launch where possible.
- Ensure mobile menu, comparison sliders, and accordions are keyboard operable.

## 12. SEO requirements

- One unique title, meta description, H1, canonical, and social metadata set per page.
- Keep location pages genuinely distinct; do not city-swap identical paragraphs.
- Include complete LocalBusiness/AutoBodyShop data only for genuine physical facilities.
- Do not create LocalBusiness entities for service areas.
- Add breadcrumbs and BreadcrumbList schema.
- Preserve and redirect every valuable legacy URL.
- Submit the final sitemap and verify Search Console after launch.
- Do not add self-serving third-party review aggregate markup in an attempt to obtain review stars.

## 13. Analytics requirements

Use the hooks in `content/tracking-plan.csv`. At minimum, send:

- `estimate_click`
- `phone_click`
- `directions_click`
- `review_profile_click`

Mark estimate clicks and qualified phone calls as primary conversions in the advertising platform. Report by landing page, location, device, campaign, and source/medium.

## 14. Deployment sequence

1. Confirm the final platform and canonical domain.
2. Load global business settings.
3. Add licensed font assets or retain the fallback stack.
4. Replace/confirm OEM program data and official badges.
5. Add Big Bear address, phone, hours, map, and rental disclaimer.
6. Verify all public claims.
7. Install analytics/consent tooling.
8. Implement legal/privacy copy.
9. Add redirects from the current site.
10. Run validation, accessibility, mobile, performance, and form/CTA tests.
11. Publish to staging for owner approval.
12. Launch and monitor conversions and crawl errors.
