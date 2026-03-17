import Database from "better-sqlite3"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const DB_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DB_DIR, "views.db")

let db: Database.Database | null = null

function getDb(): Database.Database {
	if (!db) {
		fs.mkdirSync(DB_DIR, { recursive: true })
		db = new Database(DB_PATH)
		db.pragma("journal_mode = WAL")

		db.exec(`
			CREATE TABLE IF NOT EXISTS page_views (
				page_key TEXT PRIMARY KEY,
				title TEXT NOT NULL DEFAULT '',
				preview TEXT NOT NULL DEFAULT '',
				count INTEGER NOT NULL DEFAULT 0
			);

			CREATE TABLE IF NOT EXISTS view_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				page_key TEXT NOT NULL,
				ip_hash TEXT NOT NULL,
				created_at INTEGER NOT NULL
			);

			CREATE INDEX IF NOT EXISTS idx_view_logs_lookup
				ON view_logs (page_key, ip_hash, created_at);
		`)
	}
	return db
}

function hashIp(ip: string): string {
	// Daily-rotating salt so we can't track users long-term
	const daySalt = new Date().toISOString().slice(0, 10)
	return crypto.createHash("sha256").update(`${ip}:${daySalt}`).digest("hex").slice(0, 16)
}

export function incrementView(pageKey: string, ip: string, title?: string, preview?: string): number {
	const database = getDb()
	const ipHash = hashIp(ip)
	const oneHourAgo = Date.now() - 60 * 60 * 1000

	// Check if this IP already viewed this page in the last hour
	const recent = database
		.prepare("SELECT 1 FROM view_logs WHERE page_key = ? AND ip_hash = ? AND created_at > ?")
		.get(pageKey, ipHash, oneHourAgo)

	if (!recent) {
		database.prepare("INSERT INTO view_logs (page_key, ip_hash, created_at) VALUES (?, ?, ?)").run(pageKey, ipHash, Date.now())

		database
			.prepare(
				"INSERT INTO page_views (page_key, title, preview, count) VALUES (?, ?, ?, 1) ON CONFLICT(page_key) DO UPDATE SET count = count + 1, title = COALESCE(NULLIF(?, ''), title), preview = COALESCE(NULLIF(?, ''), preview)",
			)
			.run(pageKey, title || "", preview || "", title || "", preview || "")
	}

	const row = database.prepare("SELECT count FROM page_views WHERE page_key = ?").get(pageKey) as
		| { count: number }
		| undefined
	return row?.count ?? 0
}

export function getViewCount(pageKey: string): number {
	const database = getDb()
	const row = database.prepare("SELECT count FROM page_views WHERE page_key = ?").get(pageKey) as
		| { count: number }
		| undefined
	return row?.count ?? 0
}

export function getTopPages(limit = 5): { pageKey: string; title: string; preview: string; count: number }[] {
	const database = getDb()
	return database
		.prepare("SELECT page_key AS pageKey, title, preview, count FROM page_views ORDER BY count DESC LIMIT ?")
		.all(limit) as {
		pageKey: string
		title: string
		preview: string
		count: number
	}[]
}
