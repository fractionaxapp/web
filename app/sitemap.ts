import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.fractionax.app';

// Indexable content pages. The app surface is excluded via robots.
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date('2026-06-26');
  const paths = [
    { path: '', priority: 1 },
    { path: '/docs', priority: 0.8 },
    { path: '/terms', priority: 0.3 },
    { path: '/privacy', priority: 0.3 },
  ];
  return paths.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: updated,
    changeFrequency: 'monthly',
    priority,
  }));
}
