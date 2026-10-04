# Sections

Portfolio sections are composed here as the site grows. Each section follows
the same convention:

```
src/sections/
├── Hero/
│   ├── Hero.jsx
│   └── Hero.module.css
├── Work/
│   ├── Work.jsx
│   └── Work.module.css
├── About/…
└── Contact/…
```

## Conventions

- One folder per section, named after the section.
- Use **CSS Modules** (`Section.module.css`) for scoped styles; reach for the
  global utilities (`.glass`, `.glass-panel`, `.text-gradient`, `.eyebrow`,
  `.btn`, `.container`, `.section`) in `src/styles/utilities.css` first.
- Read design values only from tokens (`var(--accent-cyan)`, `var(--space-6)`,
  `var(--fs-h2)`, …) — never hard-code colors.
- Give each section a stable `id` matching its navigation anchor
  (`#work`, `#about`, `#contact` — see `navigation` in
  `src/data/portfolio.js`).
- Animate entrances with `data-reveal` + the `useReveal` hook from
  `src/animations/`, staggering children with `--reveal-delay`.
- 3D props/canvases live in `src/components/three/` and should be lazy-loaded
  for heavier scenes.

## Sections status

1. **Hero** — `#home` ✅ implemented in `Hero/`
2. **Skills** — `#skills` ✅ implemented in `Skills/`
3. **About** — `#about` ✅ implemented in `About/`
4. **Education / Journey** — `#journey` ✅ implemented in `Journey/` (data in `src/data/portfolio.js`)
5. **Work / Projects** — `#work` ✅ implemented in `Projects/` (data in `src/data/portfolio.js`)
6. **Contact** — `#contact` ✅ implemented in `Contact/` (links + form endpoint in `src/data/portfolio.js`)

> All sections (including the Footer) are complete. Remaining work: replace
> the placeholder URLs (resume, socials, project links) in
> `src/data/portfolio.js` and set `formConfig.endpoint` to a real form service.
