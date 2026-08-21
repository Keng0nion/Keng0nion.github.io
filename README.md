# Keng0nion's Farm

The bilingual personal project archive of **Kengo Kubota (Keng0nion)**, built for documenting independent projects, experiments, and a continuing development journey.

**Website:** [https://keng0nion.github.io/](https://keng0nion.github.io/)

## Features

- English and Chinese routes with remembered language preference
- Interactive cyberpunk home experience with Matrix rain and click particles
- A WebGL Earth with day, night, normal, and cloud textures
- Project archive with five bilingual project dossiers
- About, development journey, contact, and attribution pages
- Static GitHub Pages deployment through GitHub Actions

## Technology

- Astro 7
- React 19
- TypeScript
- Three.js
- `react-globe.gl`

## Local development

```sh
npm install
npx astro dev --background
```

Manage the background server with:

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## Validation

```sh
npx astro check
npm run build
```

## Attribution

Earth and space textures are provided by Solar System Scope / INOVE under CC BY 4.0. Open-source rendering libraries are used under their respective MIT licenses. See [`ATTRIBUTION.md`](./ATTRIBUTION.md) and the website Credits page for details.
