
import Link from 'next/link'
import GeometricPattern from './GeometricPattern'
import { getSiteName, getSiteSubtitle } from '@/functions/settings'

interface HeaderProps {
    title?: string
    subtitle?: string
    breadcrumb?: string
}

export default async function Header({ title, subtitle, breadcrumb }: HeaderProps) {
    const siteName = await getSiteName()
    const siteSubtitle = await getSiteSubtitle()

    return (
        <div className="relative bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
            <GeometricPattern />
            <div className="relative px-8 sm:px-16 md:px-32 py-16">
                <div className="max-w-4xl">
                    {breadcrumb && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Link href="/" className='hover:cursor-pointer hover:underline'>
                                Home
                            </Link>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-900">{breadcrumb}</span>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                        {breadcrumb || title || siteName}
                    </h1>
                    <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl">
                        {subtitle || siteSubtitle}
                    </p>
                    <div className="flex items-center gap-4 mt-8">
                        <div className="w-12 h-px bg-gray-900"></div>
                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                        <div className="w-6 h-px bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
