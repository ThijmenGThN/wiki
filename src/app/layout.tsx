import { ThemeProvider } from "next-themes"

import ConvexClientProvider from "@/components/convex/ConvexClientProvider"
import { RouteGuard } from "@/components/convex/RouteGuard"
import { ThemeSync } from "@/components/ThemeSync"
import { WikiHeader } from "@/components/wiki-header"
import { Toaster } from "@/components/ui/sonner"

import type { Metadata } from "next"

import "@/styles/globals.css"

export const metadata: Metadata = {
	title: "Wiki",
	description: "Browse through our comprehensive knowledge base.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ConvexClientProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<ThemeSync />
						<RouteGuard>
							<WikiHeader />
							{children}
						</RouteGuard>
					</ThemeProvider>
				</ConvexClientProvider>
				<Toaster />
			</body>
		</html>
	)
}
