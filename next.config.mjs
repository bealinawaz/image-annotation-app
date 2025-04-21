/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization for production
  output: 'standalone',
  
  // Enable image optimization for external URLs
  images: {
    domains: ['placehold.co', 'my-json-server.typicode.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Production optimizations
  swcMinify: true,
  
  // Handle redirects at the Next.js level
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
