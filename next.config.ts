import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		unoptimized: true
	},
  serverExternalPackages: ["better-sqlite3"],
  async rewrites() {
    return [
      {
        source: "/stats/:match*",
        destination: "https://to.nantric.com/:match*",
      },
    ];
  },
}

export default nextConfig
