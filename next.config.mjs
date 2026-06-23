/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Consume the shared workspace packages directly from source.
  transpilePackages: ['@fractionax/ui', '@fractionax/core', '@fractionax/domain'],
  // Linting and type-checking run as dedicated moon tasks, not during the build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
