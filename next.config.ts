import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		unoptimized: true
	},
	reactProductionProfiling: true,
}

export default nextConfig
