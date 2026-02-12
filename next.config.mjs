/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },
  async redirects() {
    return [
      { source: '/products', destination: '/catalog', permanent: true },
      { source: '/materials', destination: '/blog', permanent: true }
    ];
  }
};

export default nextConfig;
