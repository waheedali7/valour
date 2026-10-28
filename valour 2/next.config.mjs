import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// The main Valour site owns the database and product images (see .env.example).
const VALOUR_SITE_URL = (process.env.VALOUR_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app lives inside the main Valour repo; pin its root so Next doesn't pick up the parent lockfile.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // Images are pre-sized to WebP by scripts/prepare-assets.mjs, so the optimizer is not needed.
  images: { unoptimized: true },
  // Shop product images live on the main site. Proxying them keeps them same-origin here
  // (the main site serves uploads with Cross-Origin-Resource-Policy: same-origin).
  // Local files in public/ win over these rewrites.
  async rewrites() {
    return [
      { source: '/media/products/:path*', destination: `${VALOUR_SITE_URL}/media/products/:path*` },
      { source: '/images/:path*', destination: `${VALOUR_SITE_URL}/images/:path*` },
    ];
  },
};

export default nextConfig;
