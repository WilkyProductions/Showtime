# Design System and Brand Implementation

## Source hierarchy

1. Supplied Showtime brand guide
2. Approved website preview
3. This handoff specification

## Logo

- Use the primary Showtime mark in most website situations.
- Maintain clear space on every side.
- Do not stretch, warp, outline, recolor, crowd, or add unapproved effects.
- The special “It’s Showtime” mark is not the default navigation logo.

## Core colors

| Token | Value | Intended use |
|---|---:|---|
| `--red` | `#DA0020` | Primary CTA, active states, strong accents |
| `--black` | `#000000` | Header, footer, premium proof sections |
| `--tan` | `#EFC58E` | Restrained heritage/premium accents |
| `--cream` | `#fbf8f3` | Main light content surface |

Pair dark and light colors for contrast. Do not make the whole site black and red; most reading surfaces should remain light.

## Typography

The brand guide calls for Forza Black Italic for main headings, Forza Bold for subheadings, and Forza Book for body text. The preview uses a fallback stack because licensed webfont files were not supplied.

Production options:

1. License and self-host the approved Forza webfont files.
2. Retain the fallback stack in `assets/css/styles.css`.
3. Obtain written brand approval for another typeface.

Never copy desktop font files into the website without a valid web license.

## Layout tokens

See `:root` in `site/assets/css/styles.css`. Important values:

- Content max-width: `1240px`
- Section padding: approximately `104px` desktop, reduced at responsive breakpoints
- Card radius: `18px`
- Large media radius: `28px`
- Header height: `86px`

## Imagery

- Preserve accurate vehicle paint color.
- Avoid heavy red overlays on repair evidence.
- Use real facility/team/work images ahead of stock imagery.
- Use native text for reviews and before/after descriptions.
- Keep desktop hero crops usable at mobile breakpoints.
- Asset usage is listed in `content/image-asset-map.csv`.
