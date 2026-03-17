import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		unoptimized: true
	},
	serverExternalPackages: ["better-sqlite3"],
}

export default nextConfig
