import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"

import ConvexClientProvider from "@/components/ConvexClientProvider"
import { ThemeSync } from "@/components/ThemeSync"

import "@/styles/globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
	title: "next-leaflet",
	description: "An optimized tech stack for efficiency.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en" suppressHydrationWarning>
				<body>
					<ConvexClientProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<ThemeSync />
							{children}
						</ThemeProvider>
					</ConvexClientProvider>
					<Toaster />
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
