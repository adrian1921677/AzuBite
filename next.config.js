/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Vercel optimizations
  output: 'standalone',
}

module.exports = nextConfig


