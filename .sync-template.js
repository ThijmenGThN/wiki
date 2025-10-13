#!/usr/bin/env node

import { execSync } from "child_process"
import { fileURLToPath } from "url"

const TEMPLATE_REPO = "https://github.com/ThijmenGThN/next-leaflet.git"
const TEMPLATE_REMOTE = "next-leaflet" // Name matches the actual repo name

function log(message, type = "info") {
	const styles = {
		info: { color: "\x1b[96m", icon: "ℹ", prefix: "info" },
		success: { color: "\x1b[92m", icon: "✓", prefix: "success" },
		warning: { color: "\x1b[93m", icon: "⚠", prefix: "warning" },
		error: { color: "\x1b[91m", icon: "✗", prefix: "error" },
		reset: "\x1b[0m",
		bold: "\x1b[1m",
		dim: "\x1b[2m",
	}

	const style = styles[type]
	const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })

	console.log(
		`${styles.dim}[${timestamp}]${styles.reset} ${style.color}${styles.bold}${style.icon} ${style.prefix}${styles.reset} ${message}`,
	)
}

function logHeader(title) {
	const border = "━".repeat(60)
	console.log(`\n\x1b[96m\x1b[1m┏${border}┓\x1b[0m`)
	console.log(
		`\x1b[96m\x1b[1m┃${title.padStart(30 + Math.floor(title.length / 2)).padEnd(60)}┃\x1b[0m`,
	)
	console.log(`\x1b[96m\x1b[1m┗${border}┛\x1b[0m\n`)
}

function logSection(title) {
	console.log(`\n\x1b[96m\x1b[1m▶ ${title}\x1b[0m`)
	console.log(`\x1b[96m${"─".repeat(title.length + 2)}\x1b[0m`)
}

function execCommand(command, silent = false) {
	try {
		return execSync(command, {
			encoding: "utf8",
			stdio: silent ? "pipe" : "inherit",
		})
	} catch (error) {
		throw new Error(`Command failed: ${command}\n${error.message}`)
	}
}

function main() {
	logHeader("template synchronization")
	log("Initiating template repository synchronization...", "info")

	try {
		// Check for uncommitted changes
		logSection("pre-flight checks")
		const status = execCommand("git status --porcelain", true)
		if (status && status.trim()) {
			log("Uncommitted changes detected. Please commit them first.", "warning")
			process.exit(1)
		}
		log("Working directory is clean", "success")

		// Add/update template remote
		logSection("remote configuration")
		const remotes = execCommand("git remote", true)
		if (remotes.includes(TEMPLATE_REMOTE)) {
			execCommand(`git remote set-url ${TEMPLATE_REMOTE} ${TEMPLATE_REPO}`, true)
			log(`Updated remote '${TEMPLATE_REMOTE}' URL`, "success")
		} else {
			execCommand(`git remote add ${TEMPLATE_REMOTE} ${TEMPLATE_REPO}`, true)
			log(`Added remote '${TEMPLATE_REMOTE}'`, "success")
		}

		// Fetch template changes
		logSection("fetching updates")
		log("Downloading latest template changes...", "info")
		execCommand(`git fetch ${TEMPLATE_REMOTE}`, true)
		log("Template repository fetched successfully", "success")

		// Check if there are new commits
		let templateBranch = "main"
		try {
			execCommand(`git log --oneline HEAD..${TEMPLATE_REMOTE}/main`, true)
		} catch {
			templateBranch = "main"
		}

		const newCommits = execCommand(
			`git log --oneline HEAD..${TEMPLATE_REMOTE}/${templateBranch}`,
			true,
		)

		if (!newCommits || !newCommits.trim()) {
			logSection("status")
			log("Repository is already up to date!", "success")
			return
		}

		logSection("change summary")
		log("New commits available for integration:", "info")
		console.log(`\x1b[2m${newCommits}\x1b[0m`)

		// Merge template changes
		logSection("integration")
		log("Merging template changes...", "info")
		execCommand(
			`git merge ${TEMPLATE_REMOTE}/${templateBranch} --no-ff --allow-unrelated-histories -m "chore: sync with template repository"`,
		)

		logSection("completion")
		log("Template synchronization completed successfully!", "success")
		log("Please run tests and push changes if everything looks good.", "info")
	} catch (error) {
		logSection("error resolution")
		if (error.message.includes("CONFLICT")) {
			log("Merge conflicts detected. Manual resolution required:", "warning")
			console.log("\x1b[2m   1. Edit the conflicting files\x1b[0m")
			console.log("\x1b[2m   2. Run: git add <resolved-files>\x1b[0m")
			console.log("\x1b[2m   3. Run: git commit\x1b[0m")
		} else {
			log(`Operation failed: ${error.message}`, "error")
		}
		process.exit(1)
	}
}

// Check if this file is being run directly (ES module equivalent of require.main === module)
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)

if (isMainModule) {
	main()
}
