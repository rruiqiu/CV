const nextConfig = {
  // Only enable static exports for production builds (GitHub Pages)
  ...(process.env.NODE_ENV === 'production' && { output: "export" }),

};

export default nextConfig;
