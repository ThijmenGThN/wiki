import { NextRequest, NextResponse } from "next/server"
import { getViewCount, incrementView, getTopPages } from "@/lib/db"

export async function GET(request: NextRequest) {
	const page = request.nextUrl.searchParams.get("page")
	const top = request.nextUrl.searchParams.get("top")

	if (top) {
		const limit = Math.min(Number.parseInt(top, 10) || 5, 20)
		const pages = getTopPages(limit)
		return NextResponse.json(pages)
	}

	if (!page) {
		return NextResponse.json({ error: "Missing page parameter" }, { status: 400 })
	}

	return NextResponse.json({ count: getViewCount(page) })
}

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { page, title, preview } = body

	if (!page || typeof page !== "string") {
		return NextResponse.json({ error: "Missing page parameter" }, { status: 400 })
	}

	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		"unknown"

	const count = incrementView(page, ip, title, preview)
	return NextResponse.json({ count })
}
