import Link from "next/link"

import Search from "@/components/Search"
import Header from "@/components/Header"
import Toolbar from "@/components/Toolbar"
import Footer from "@/components/Footer"
import CardStack from "@/components/CardStack"

import { getCategories } from "@/functions/categories"

export const dynamic = 'force-dynamic'

export default async function Page() {
    const categories = await getCategories()

    return (
        <>
            <Header />
            <Search />
            <Toolbar />

            <div className="flex flex-col gap-y-12 mt-20 mx-8 sm:mx-16 md:mx-32 mb-20">
                {/* Section header with visual separator */}
                <div className="flex items-center gap-x-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-light text-gray-900 tracking-wide">
                        Browse Categories
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>

                {/* Categories grid */}
                <ul className="grid gap-8 md:grid-cols-2">
                    {categories.map((category, index) => (
                        <li key={category?.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="animate-fadeInUp"
                        >
                            <CardStack>
                                <Link
                                    className="group block p-8 h-full"
                                    href={category?.slug ?? '/'}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 bg-gray-100 group-hover:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
                                                <div className="w-6 h-6 bg-gray-400 group-hover:bg-white transition-colors duration-300 rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors text-lg">
                                                    {category?.title}
                                                </h3>
                                                <div className="w-8 h-px bg-gray-300 group-hover:bg-gray-900 transition-colors duration-300 mt-2"></div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed flex-1">
                                            {category?.subtitle}
                                        </p>
                                        <div className="flex items-center gap-2 mt-6 text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                                            <span>Explore</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </CardStack>
                        </li>
                    ))}
                </ul>
            </div>

            <Footer />
        </>
    )
}