import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.1.193",
    "192.168.1.193:3000",
    "0.0.0.0:3000",
  ],
};

export default nextConfig;
