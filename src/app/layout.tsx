import { ThemeProvider } from "next-themes"
import { Sour_Gummy } from "next/font/google"

import { WikiHeader } from "@/components/wiki-header"
import { Toaster } from "@/components/ui/sonner"

import type { Metadata } from "next"

import "@/styles/globals.css"

const sourGummy = Sour_Gummy({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Wiki",
	description: "Browse through our comprehensive knowledge base.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={sourGummy.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<WikiHeader />
					{children}
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	)
}
