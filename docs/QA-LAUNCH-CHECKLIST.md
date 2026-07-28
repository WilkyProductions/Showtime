# QA and Launch Checklist

## Functional

- [ ] Every internal link resolves.
- [ ] Every image loads.
- [ ] Every Carwise CTA uses the exact approved URL.
- [ ] Phone links dial the correct number.
- [ ] Directions links use the correct destination.
- [ ] Mobile menu opens, closes, and responds to Escape.
- [ ] Before/after sliders work with pointer, touch, and keyboard.
- [ ] FAQ accordions are usable with keyboard and screen reader.
- [ ] External links use appropriate `rel` values.

## Content

- [ ] No “OEM + Exotics” language remains.
- [ ] No certification is shown without current proof.
- [ ] General Motors includes Chevrolet, GMC, Buick, and Cadillac.
- [ ] Big Bear is described as a staffed satellite, not a complete production facility.
- [ ] Lake Arrowhead and Crestline remain service areas.
- [ ] Review totals and dates are current.
- [ ] Warranty and I-CAR claims are current.
- [ ] Privacy/legal copy is approved.

## Responsive

Test at minimum:

- 360 × 800
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1440 × 900
- 1920 × 1080

Confirm no horizontal overflow, clipped text, hidden CTA, or unreadable image crop.

## Accessibility

- [ ] Automated axe/WAVE scan reviewed.
- [ ] Keyboard-only walkthrough completed.
- [ ] Visible focus on all interactive elements.
- [ ] Heading order checked.
- [ ] Color contrast checked.
- [ ] Images have useful alt text.
- [ ] Motion respects reduced-motion settings.

## Performance

- [ ] Mobile Lighthouse test completed from staging.
- [ ] Hero is responsive and appropriately compressed.
- [ ] Below-fold media is lazy-loaded.
- [ ] Third-party scripts are deferred.
- [ ] No layout shift from missing dimensions.

## SEO / launch

- [ ] Production canonicals correct.
- [ ] Sitemap and robots correct.
- [ ] Redirects tested.
- [ ] Search Console verified.
- [ ] Analytics real-time events verified.
- [ ] Ad destination URLs and conversions verified.
- [ ] 404 page works.
- [ ] Post-launch crawl completed.
