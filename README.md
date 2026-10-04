# Dhruv Portfolio

A premium, dark-themed personal portfolio for **Dhruv**, Computer Science
Engineering student, developer and AI/ML enthusiast â€” built as a static site with
React + Vite and a lightweight WebGL layer.

All personal content lives in **one central data file**. Edit it once and every
section updates automatically.

---

## About

This repository contains the source for Dhruv's personal developer portfolio â€” a
single-page site presenting a Computer Science Engineering background across
AI/Machine Learning, computer vision and modern web development.

The site is built around a deep-space visual system (glassmorphism, neon accents
and glowing borders) with interactive 3D scenes that render on demand, so the
experience stays fast and smooth rather than constantly animating.

**All content is editable in one place:** `src/data/portfolio.js`.

---

## Features

- **Responsive design** â€” verified from 360px phones up to 1920px desktops;
  the hero re-composes from stacked mobile to a cinematic two-column layout.
- **Interactive 3D UI** â€” hero, skills, about, journey and contact sections each
  use a WebGL scene with `frameloop="demand"`: scenes idle at **zero GPU cost**
  and only redraw on scroll-in or pointer interaction.
- **AI/ML project showcase** â€” project cards open a polished detail view
  (portal-based modal) with category, description, technologies and preview art.
- **Animated sections** â€” staggered scroll reveals, tilt cards and a progressive
  timeline, all driven by CSS + IntersectionObserver.
- **Contact form** â€” client-side validation (name, email, subject, message),
  loading, success and error states, with no page reload.
- **Mobile support** â€” reduced particle counts, a lightweight mobile mode and a
  full-screen glass navigation menu.
- **Accessibility** â€” semantic headings, labelled fields, visible focus states,
  a skip link, focus-trapped modal and full `prefers-reduced-motion` support.
- **Browser navigation** â€” project deep links (`#project-<id>`) work with the
  back/forward buttons, refresh and direct URL loads.

---

## Tech Stack

- **React 19** â€” UI components
- **Vite 8** â€” dev server, bundler and code-splitting
- **JavaScript (ESM)** â€” no TypeScript
- **CSS** â€” CSS Modules per component + a global design-token system
- **Three.js** via **@react-three/fiber** â€” the 3D scenes
- No animation library â€” motion is CSS keyframes plus small custom hooks
---

## Installation

```bash
npm install
```

Requires Node.js 18 or newer.

---

## Development

```bash
npm run dev
```

Starts the Vite dev server with hot module replacement
(http://localhost:5173 by default).

---

## Production Build

```bash
npm run build     # production bundle → dist/
npm run preview   # serve the production build locally
```

The build outputs a fully static site to `dist/`, which can be deployed to any
static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, or plain
nginx). No server-side runtime is required.

---

## Project Structure

```
├── index.html               # Static SEO/meta, font preconnects, theme-color
├── vite.config.js           # Build config + dev/preview ports
├── .env.example             # Env var template (no real secrets)
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # App shell — composes all sections
    │
    ├── data/
    │   └── portfolio.js     # ★ SINGLE SOURCE OF TRUTH for all content
    │
    ├── sections/            # One folder per page section
    │   ├── Hero/            # Above-the-fold intro + lazy 3D scene
    │   ├── Skills/          # Categorised skill filters + 3D core
    │   ├── About/           # Bio, highlights, animated stats
    │   ├── Journey/         # Education / experience timeline
    │   ├── Projects/        # Project grid, cards and detail modal
    │   └── Contact/         # Contact links + validated form
    │
    ├── components/
    │   ├── layout/          # Layout shell, Navbar, Footer
    │   ├── three/           # WebGL scenes and objects (three.js)
    │   └── common/          # Shared utilities (ErrorBoundary)
    │
    ├── animations/          # Reusable motion hooks
    │   ├── useReveal.js             # Scroll-triggered reveal
    │   ├── usePrefersReducedMotion.js
    │   ├── useTilt.js               # rAF-throttled card tilt
    │   ├── useInView.js             # Viewport gating for 3D
    │   ├── usePointerPosition.js    # Shared pointer ref (no re-renders)
    │   └── useCountUp.js            # Animated stat counters
    │
    ├── styles/
    │   ├── tokens.css        # Design tokens: colors, type, spacing, motion
    │   ├── base.css          # Reset + element defaults
    │   ├── animations.css    # Keyframes + [data-reveal] primitives
    │   ├── utilities.css     # Container, buttons, text-gradient, eyebrow
    │   └── index.css         # Stylesheet entry (import order matters)
    │
    ├── config/               # Thin re-exports kept for import compatibility
    └── App.module.css
```

Each section owns a `.jsx` + `.module.css` pair. All 3D components live in
`components/three/` and are shared across sections.

---

## Customization

**Almost everything is edited in one file: `src/data/portfolio.js`.**

### Personal information

Edit the `profile` object at the top of the file:

```js
export const profile = {
  name: 'Dhruv',                              // Hero, About, Footer
  role: 'Computer Science Engineering Student',
  headline: 'Developer • AI/ML Enthusiast • Creative Technologist',
  shortBio: '…',                              // one-line bio
  education: 'Computer Science & Engineering',
  email: 'your-email@example.com',            // drives every mailto: link
  badge: '…',                                 // Hero pill
  heroSubline: '…',                           // animated second line
  heroTagline: '…',                           // Hero description
  availability: 'Open to Learning • …',       // status indicator
  resumeUrl: '#',                             // see "Resume" below
}
```

The `monogram` ("DH") and `siteConfig` object are **derived** from `profile` —
you do not need to edit them.

### Skills

Edit `skillCategories`. Tabs, counts and the skill orbit all adapt
automatically:

```js
export const skillCategories = [
  { id: 'programming', label: 'Programming', skills: ['C', 'C++', 'Python'] },
  { id: 'web-development', label: 'Web Development', skills: ['React'] },
]
```

### Projects

Add, remove or edit objects in the `projects` array. The card, modal layout and
preview art all update automatically:

```js
{
  id: 'anomaly-detection',                    // used for #project-<id> links
  title: 'Project title',
  category: 'AI / Machine Learning',
  description: 'Short summary…',
  technologies: ['Python', 'OpenCV'],
  image: '',            // ← cover image path, or '' for generated abstract art
  githubUrl: '',        // ← '' hides the GitHub button entirely
  liveUrl: '',          // ← '' hides the Live Demo button entirely
  visual: 'ai',         // abstract-art theme: 'ai' | 'social' | 'creative'
  screenshots: [],      // ← optional gallery images for the modal
}
```

> **No fake links are ever rendered.** Leaving `githubUrl` / `liveUrl` as `''`
> (or `'#'`) automatically hides the corresponding button. Add a real URL and
> the button appears by itself.

### Social links

Edit the `socialLinks` object. Placeholder `'#'` values are filtered out, so a
social button only shows once a real URL is supplied:

```js
export const socialLinks = {
  github: '#',       // e.g. 'https://github.com/your-handle'
  linkedin: '#',     // e.g. 'https://linkedin.com/in/your-handle'
  instagram: '#',    // e.g. 'https://instagram.com/your-handle'
  email: `mailto:${profile.email}`,   // derived — no need to edit
}
```

### Resume

1. Drop the real file into `public/` (e.g. `public/resume.pdf`).
2. Set the path in `portfolio.js`:

```js
resumeUrl: '/resume.pdf',
```

While it is left as `'#'` the Hero shows a muted "soon" state and the About
button stays hidden — so there is never a broken download link. **Do not commit
a placeholder or fabricated resume file.**

### Images

- **Project images** — add files under `public/projects/` and set
  `projects[].image` to e.g. `'/projects/my-project.jpg'`. Leave it `''` to get
  themed CSS/SVG artwork instead. Images are lazy-loaded.
- **Favicon** — `public/favicon.svg` (a lightweight "DH" monogram).
- **Placeholder slots** — `src/assets/` contains `_placeholder.txt` notes for
  images, icons and fonts.

### Other things worth knowing

| What | Where |
| --- | --- |
| Page title, description, OG/Twitter tags, canonical URL | `index.html` |
| Design tokens (colors, spacing, type scale, easing) | `src/styles/tokens.css` |
| Navigation labels and anchors | `navigation` in `portfolio.js` |
| About highlight cards & animated stats | `about` in `portfolio.js` |
| Journey / timeline entries | `journeyItems` in `portfolio.js` |
| Contact form endpoint | `formConfig.endpoint` in `portfolio.js` |

---

## Environment Variables

This project is fully static and requires **no** environment variables. There
are no API keys, tokens or secrets in the repository, and none are needed to
build or deploy.

An `.env.example` file is included as documentation and a safety net — the real
`.env` is ignored by Git. If you later connect the contact form to a real
service, set `formConfig.endpoint` in `src/data/portfolio.js`.

> Only variables prefixed with `VITE_` are exposed to the browser bundle by
> Vite. Treat them as public — never place a secret in one.

---

## Deployment

The built site in `dist/` is plain static files.

- **GitHub Pages** — push to a repository, then in *Settings → Pages* set the
  source to the `main` branch and the `/dist` folder.
- **Netlify / Vercel / Cloudflare Pages** — build command `npm run build`,
  publish directory `dist`.

Before going live, replace the placeholder canonical URL
(`https://your-domain.example/`) in `index.html` with your real domain.

---

## License

Personal portfolio project — use it as a starting point for your own portfolio.
