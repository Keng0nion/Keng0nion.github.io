import type { APIRoute } from 'astro';

// Crawlers only read robots.txt at the origin root, so this one file governs
// every project site published under keng0nion.github.io. The robots.txt files
// inside each project repository are never fetched, which makes this list the
// only place their sitemaps can be declared.
const projectSitemaps = [
  '/Collatz-Conjecture-Reverse-Tree-Interactive-Visualizer/sitemap.xml',
  '/ecolab-antibiotic-modeling/sitemap.xml',
  '/fifteen-day-frontline/sitemap.xml',
  '/HANDHELD-MATRIX-V3.0/sitemap.xml',
  '/xuewu/sitemap-index.xml',
];

export const GET: APIRoute = ({ site }) => {
  const sitemapUrls = [
    new URL('sitemap-index.xml', site).href,
    ...projectSitemaps.map((path) => new URL(path, site).href),
  ];
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...sitemapUrls.map((url) => `Sitemap: ${url}`),
  ].join('\n');

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
