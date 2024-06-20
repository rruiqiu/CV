/** @type {import('next').NextConfig} */
const nextConfig = {
  basepath: "/pw-frontend",
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
  images: { unoptimized: true }
};

export default nextConfig;
