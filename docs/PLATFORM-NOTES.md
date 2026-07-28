# Platform Implementation Notes

## Static hosting

The `/site` folder can be deployed directly to a static host. Configure clean URL rewrites so `services.html` is served at `/services/`, and similarly for every route in `content/route-map.csv`.

## WordPress

- Build a custom theme or block theme; do not paste the entire page into one HTML block.
- Convert header/footer into reusable template parts.
- Store global contact/estimate/location values in site options.
- Build OEM programs, repair results, and locations as structured content.
- Use the page markup as the accessibility and visual reference.

## Webflow

- Rebuild sections as native components/classes.
- Create CMS collections for results, reviews, locations, and OEM programs.
- Add the `data-track` attributes to final CTA elements.
- Do not upload the self-contained approval HTML as one embed.

## Next.js / Astro / similar

- Create a shared layout and reusable components.
- Import `content/site-config.json` and `content/oem-certifications.json` into the content layer.
- Generate location and OEM cards from data.
- Use the framework image component with responsive widths.
- Preserve semantic HTML and native `details` elements.

## CSS

The source is plain CSS. The developer may refactor into modules or a design system, but visual output and responsive behavior should remain within the approved reference unless changes are approved.
