import { spawnSync } from "child_process"
import { config as loadEnvFile } from "dotenv"
import fs from "fs"
import { exportJWK, exportPKCS8, generateKeyPair } from "jose"

// Exit early if .env.local doesn't exist
if (!fs.existsSync(".env.local")) {
	process.exit(0)
}

// Load environment variables from .env.local
const config = {}
loadEnvFile({ path: ".env.local", processEnv: config })

const runOnceWorkflow = process.argv.includes("--once")

// Set SMTP environment variables from .env.local if they exist (before early exit check)
if (config.SMTP_HOST || config.SMTP_USER || config.SMTP_PASS) {
	console.log("Setting SMTP environment variables...")
	const smtpVars = {
		SMTP_HOST: config.SMTP_HOST,
		SMTP_PORT: config.SMTP_PORT || "587",
		SMTP_USER: config.SMTP_USER,
		SMTP_PASS: config.SMTP_PASS,
		MAIL_DEFAULT_NAME: config.MAIL_DEFAULT_NAME || "next-leaflet",
		MAIL_DEFAULT_ADDRESS: config.MAIL_DEFAULT_ADDRESS || config.SMTP_USER,
	}

	for (const [key, value] of Object.entries(smtpVars)) {
		if (value) {
			const result = spawnSync("npx", ["convex", "env", "set", key, value], {
				stdio: "inherit",
			})
			if (result.status !== 0) {
				console.error(`Failed to set ${key} in Convex`)
				process.exit(result.status)
			}
		}
	}
} else {
	console.log("No SMTP configuration found in .env.local, skipping SMTP setup...")
}

// Check if all required Convex environment variables are already set
const checkEnvResult = spawnSync("npx", ["convex", "env", "list"], {
	encoding: "utf-8",
})
const envOutput = checkEnvResult.stdout || ""
const hasJwtPrivateKey = envOutput.includes("JWT_PRIVATE_KEY=")
const hasJwks = envOutput.includes("JWKS=")
const hasSiteUrl = envOutput.includes("SITE_URL=")

if (
	runOnceWorkflow &&
	config.SETUP_SCRIPT_RAN !== undefined &&
	hasJwtPrivateKey &&
	hasJwks &&
	hasSiteUrl
) {
	// All environment variables are already set, skip JWT key regeneration
	process.exit(0)
}

// Run Convex Auth setup for OAuth providers (non-blocking if it fails)
const result = spawnSync("npx", ["@convex-dev/auth", "--skip-git-check"], {
	stdio: "inherit",
})

if (result.status !== 0) {
	console.log("Warning: @convex-dev/auth setup had issues, continuing anyway...")
}

// Set SITE_URL from NEXT_PUBLIC_DOMAIN in .env.local
const siteUrl = config.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
const siteUrlResult = spawnSync("npx", ["convex", "env", "set", `SITE_URL=${siteUrl}`], {
	stdio: "inherit",
})

if (siteUrlResult.status !== 0) {
	console.error("Failed to set SITE_URL in Convex")
	process.exit(siteUrlResult.status)
}

// Generate RSA key pair for JWT signing
console.log("Generating JWT keys...")
const keys = await generateKeyPair("RS256", {
	extractable: true,
})
const privateKey = await exportPKCS8(keys.privateKey)
const publicKey = await exportJWK(keys.publicKey)
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] })
const jwtPrivateKey = privateKey.trimEnd().replace(/\n/g, " ")

// Set JWT_PRIVATE_KEY in Convex
const jwtPrivateKeyResult = spawnSync(
	"npx",
	["convex", "env", "set", `JWT_PRIVATE_KEY=${jwtPrivateKey}`],
	{
		stdio: "inherit",
	},
)

if (jwtPrivateKeyResult.status !== 0) {
	console.error("Failed to set JWT_PRIVATE_KEY in Convex")
	process.exit(jwtPrivateKeyResult.status)
}

// Set JWKS in Convex
const jwksResult = spawnSync("npx", ["convex", "env", "set", `JWKS=${jwks}`], {
	stdio: "inherit",
})

if (jwksResult.status !== 0) {
	console.error("Failed to set JWKS in Convex")
	process.exit(jwksResult.status)
}

console.log("✓ All Convex environment variables set successfully!")

// Mark setup as completed in .env.local
if (runOnceWorkflow) {
	fs.writeFileSync(".env.local", `\nSETUP_SCRIPT_RAN=1\n`, { flag: "a" })
}

process.exit(0)
