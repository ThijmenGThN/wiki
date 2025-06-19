import { Ubuntu } from 'next/font/google'

import type { Metadata } from 'next'

import '@/styles/globals.css'

export const metadata: Metadata = {
    title: 'Wikibase',
    description: "A customizable knowledge base.",
}

const ubuntu = Ubuntu({ weight: ['300', '400', '500', '700'], subsets: ['latin'] })

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body className={`${ubuntu.className} bg-white text-gray-900 antialiased`}>
                {children}
            </body>
        </html>
    )
}