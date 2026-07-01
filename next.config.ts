import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow 127.0.0.1 to avoid HMR cross-origin blocking
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
