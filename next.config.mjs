/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Consume the shared workspace packages directly from source.
  transpilePackages: ['@fractionax/ui', '@fractionax/core', '@fractionax/domain'],
  // The product surfaces moved under /app; keep old links working.
  async redirects() {
    return [
      { source: '/copilot', destination: '/app', permanent: true },
      { source: '/app/copilot', destination: '/app', permanent: true },
      { source: '/deals', destination: '/app/deals', permanent: true },
      { source: '/onchain', destination: '/app/onchain', permanent: true },
    ];
  },
};

export default nextConfig;
