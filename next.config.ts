import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/main-interface",
        destination: "/desktop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
