import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  env: {
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '3145728',
    UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  },
};

export default nextConfig;
