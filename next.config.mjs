/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/CV',               // 👈 your repo name (subpath on github.io)
  assetPrefix: '/CV/',           // 👈 ensures images, CSS, JS load from correct path
  images: {
    unoptimized: true,           // 👈 required for static export
  },
  trailingSlash: true,           // 👈 ensures every route exports as /index.html
};

export default nextConfig;
