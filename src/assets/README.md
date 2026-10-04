# Assets

Static assets referenced by the app:

- `fonts/` — self-hosted font files (the project currently loads
  Space Grotesk, Inter and JetBrains Mono via Google Fonts in `index.html`)
- `images/` — photography, project screenshots, textures
- `icons/` — SVG icon set (prefer inline SVG components when possible)

Vite serves anything in this folder relative to the project root, e.g.
`import heroImage from '../assets/images/hero.jpg'`.
