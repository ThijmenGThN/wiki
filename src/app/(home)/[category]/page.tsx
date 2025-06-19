import Link from "next/link"

import Search from "@/components/Search"
import Header from "@/components/Header"
import Toolbar from "@/components/Toolbar"
import Footer from "@/components/Footer"
import CardStack from "@/components/CardStack"

import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid"

import { getPagesByCategory } from "@/functions/pages"
import { getCategoryBySlug } from "@/functions/categories"

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params

    const [pages, category] = await Promise.all([
        getPagesByCategory(categorySlug),
        getCategoryBySlug(categorySlug)
    ])

    return (
        <>
            <Header breadcrumb={category?.title ?? categorySlug} />
            <Search />
            <Toolbar />

            <div className="flex flex-col gap-y-12 mt-20 mx-8 sm:mx-16 md:mx-32 mb-20">
                {/* Section header */}
                <div className="flex items-center gap-x-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-light text-gray-900 tracking-wide">
                        Articles
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>

                {/* Pages grid */}
                <ul className="grid gap-6 md:grid-cols-2">
                    {pages.map((page, index: number) => (
                        <li key={page.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="animate-fadeInUp"
                        >
                            <CardStack>
                                <Link
                                    className="group block p-6"
                                    href={categorySlug + '/' + page?.slug}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-3 group-hover:bg-gray-900 transition-colors"></div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors mb-2">
                                                {page?.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {page?.subtitle}
                                            </p>
                                            <div className="w-6 h-px bg-gray-300 group-hover:bg-gray-900 transition-colors duration-300 mt-3"></div>
                                        </div>
                                    </div>
                                </Link>
                            </CardStack>
                        </li>
                    ))}
                </ul>

                {/* Back button */}
                <div className="flex justify-center mt-16">
                    <Link href='/'>
                        <CardStack hover={true} className="inline-block">
                            <button className="group flex items-center justify-center w-16 h-16 bg-white hover:bg-gray-900 transition-colors duration-300">
                                <ArrowUturnLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        </CardStack>
                    </Link>
                </div>
            </div>

            <Footer />
        </>
    )
}