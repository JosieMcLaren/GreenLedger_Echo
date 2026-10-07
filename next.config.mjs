/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons", "recharts"],
  },
};

export default nextConfig;
