/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/CV' : '', // 👈 your repo name (subpath on github.io)
  assetPrefix: process.env.NODE_ENV === 'production' ? '/CV/' : '', // 👈 ensures images, CSS, JS load from correct path
  // basePath: '/CV',               // 👈 your repo name (subpath on github.io)
  // assetPrefix: '/CV/',
  images: {
    unoptimized: true,           // 👈 required for static export
  },
  trailingSlash: true,           // 👈 ensures every route exports as /index.html
};

export default nextConfig;
