import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.fractionax.app';

// Let crawlers index the marketing + docs/legal content; keep them out of the
// interactive app surface (no SEO value, partly gated).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/app/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
