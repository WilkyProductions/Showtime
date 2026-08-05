# Showtime Collision Website

Static website for Showtime Collision (Running Springs, CA), built from
`templates/*.template.html` + `content/*.json` at build time and edited
through a Decap CMS admin UI at `/admin`.

## Vercel deployment settings

- Framework Preset: Other
- Build Command: `npm run build` (runs `node build.js`)
- Output Directory: leave blank (serves the project root)
- Install Command: leave blank

`build.js` merges each `content/<page>.json` file into the matching
`templates/<page>.template.html` file and writes a plain `<page>.html` file to
the project root. The deployed output is ordinary static HTML — nothing is
rendered client-side at request time.

## Editing content

- Open `/admin` on the deployed site to use the Decap CMS editor (GitHub
  backend, configured in `admin/config.yml`).
- Each page's editable fields (hero copy, reviews, FAQs, and the OEM
  certification roster) are stored in `content/<page>.json`. Editing through
  `/admin` commits directly to the `cms-integration` branch and triggers a
  new Vercel build.
- To add a new template field, add the `{{token}}` to the relevant
  `templates/<page>.template.html` file, add the matching key to
  `content/<page>.json`, and add a field entry to `admin/config.yml`.
- `build.js` also supports `{{#each fieldName}}...{{this.prop}}...{{/each}}`
  blocks for repeatable lists — used on the OEM Certifications page to render
  the `programs` array from `content/oem-certifications.json`.

## Pages

Home, Services, Locations (hub + facility tour, plus Running Springs / Big
Bear / Lake Arrowhead / Crestline), OEM Certifications, Results, Insurance,
About, Contact, plus static `privacy.html` and `404.html`. Routes are flat `.html`
files (e.g. `/services.html`), matching how the site is actually served —
see `content/route-map.csv` in the original design handoff for the
recommended pretty-URL structure if clean routing is added later.

## Notes

- This is a static HTML/CSS/JS site — no server-side logic. Every estimate
  CTA routes to the external Carwise photo-estimate URL; there is no
  in-house lead form or email pipeline.
- Business facts baked into the templates (phone, address, Carwise URL,
  review counts, OEM roster) came from an approved design handoff and are
  **not all launch-ready** — see the original package's
  `docs/LAUNCH-BLOCKERS.md` for what still needs owner confirmation before
  publishing (Big Bear address/phone, current OEM certificates and badges,
  I-CAR status, review counts, legal copy).
- Update canonical domain and analytics IDs before final launch.
