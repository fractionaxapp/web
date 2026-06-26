import type { MetadataRoute } from 'next';

// Web app manifest — enables "Add to Home Screen" with brand name, colors, and icons.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FractionAX',
    short_name: 'FractionAX',
    description: 'Agentic RWA investing on Solana.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#0e1714',
    theme_color: '#16af8e',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
