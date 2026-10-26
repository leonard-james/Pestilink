import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.137.1"],
  turbopack: {
    root: path.join(__dirname),
  },
  serverExternalPackages: ["lightningcss", "lightningcss-win32-x64-msvc"],
};

export default nextConfig;
