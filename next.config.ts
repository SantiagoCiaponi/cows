import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io", "192.168.*.*"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "http://backend-cows-env.eba-q7dyzcfv.us-east-2.elasticbeanstalk.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
