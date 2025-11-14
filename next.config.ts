import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      new URL("https://avatars.githubusercontent.com/**?v=4"),
      new URL("https://http.cat/**")
    ]
  },
  output: "export"
};

export default nextConfig;
