/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  allowedDevOrigins: ['127.0.0.1'],
  agentRules: false,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
