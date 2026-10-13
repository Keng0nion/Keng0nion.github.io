export type Locale = 'en' | 'zh';

export const SITE = {
  title: "Keng0nion's Farm",
  description: {
    en: 'The personal project archive of Kengo Kubota — an amateur developer exploring science, mathematics, security, and interactive media.',
    zh: '久保田健吾的个人项目档案——一名探索科学、数学、安全与互动媒体的业余开发爱好者。',
  },
  github: 'https://github.com/Keng0nion',
  email: 'kengo.3467.0228@gmail.com',
} as const;

// Standalone GitHub Pages sites published under the same origin. They are linked
// from the footer so crawlers can reach them through ordinary HTML links; three
// of them (Collatz, Handheld Matrix, Igloo) have no other inbound link from this
// site.
export const publishedSites = [
  {
    label: 'Collatz Reverse Tree Visualizer',
    url: 'https://keng0nion.github.io/Collatz-Conjecture-Reverse-Tree-Interactive-Visualizer/',
  },
  {
    label: 'Ecolab — E. coli–antibiotic modeling',
    url: 'https://keng0nion.github.io/ecolab-antibiotic-modeling/',
  },
  {
    label: 'Fifteen-Day Frontline',
    url: 'https://keng0nion.github.io/fifteen-day-frontline/',
  },
  {
    label: 'Handheld Matrix',
    url: 'https://keng0nion.github.io/HANDHELD-MATRIX-V3.0/',
  },
  {
    label: '雪屋 Igloo',
    url: 'https://keng0nion.github.io/xuewu/',
  },
] as const;

export const navLabels = {
  en: { home: 'Home', projects: 'Projects', about: 'About', contact: 'Contact' },
  zh: { home: '首页', projects: '项目', about: '关于我', contact: '联系方式' },
} as const;

export function pathFor(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (locale === 'zh') return clean ? `/zh/${clean}/` : '/zh/';
  return clean ? `/${clean}/` : '/';
}

export function alternatePath(pathname: string, locale: Locale): string {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (locale === 'en') return normalized.startsWith('/zh/') ? normalized.slice(3) || '/' : normalized;
  if (normalized === '/') return '/zh/';
  return normalized.startsWith('/zh/') ? normalized : `/zh${normalized}`;
}

export function projectPath(locale: Locale, slug: string): string {
  return pathFor(locale, `projects/${slug}`);
}
