import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@parasnath/shared"],
  allowedDevOrigins: ["192.168.0.110"],
};

export default nextConfig;
