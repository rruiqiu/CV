/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // <=== enables static exports for GitHub Pages
  // trailingSlash: true,  // <=== ensures proper routing on GitHub Pages
  // reactStrictMode: true,
  // images: { unoptimized: true }
};

export default nextConfig;
