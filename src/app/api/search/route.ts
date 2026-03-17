import { NextRequest, NextResponse } from "next/server"
import { searchPages } from "@/lib/affine"

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams.get("q") || ""

	if (query.trim().length === 0) {
		return NextResponse.json([])
	}

	const results = await searchPages(query)
	return NextResponse.json(results)
}
