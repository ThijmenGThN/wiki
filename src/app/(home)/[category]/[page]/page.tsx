import Link from "next/link"
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'

import Search from "@/components/Search"
import Header from "@/components/Header"
import Toolbar from "@/components/Toolbar"
import Footer from "@/components/Footer"

import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid"

import { getPageBySlug } from "@/functions/pages"
import { getCategoryById } from "@/functions/categories"

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ page: string, category: string }> }) {

    const { page: pageSlug, category: categorySlug } = await params

    const page = await getPageBySlug(pageSlug)

    const category = page && typeof page.category === 'number'
        ? await getCategoryById(page.category)
        : page?.category

    return (
        <>
            <Header breadcrumb={page?.title} />

            <Search />

            <Toolbar />

            <div className="flex flex-col gap-y-8 mt-20 mx-8 sm:mx-16 md:mx-32 mb-20">
                <div className="border-l-4 border-black pl-6">
                    <p className="text-gray-600 leading-relaxed">
                        {page?.subtitle}
                    </p>
                </div>

                <div className="border border-gray-200 bg-white">
                    <div className="prose prose-gray max-w-none p-8 prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-900 prose-code:bg-gray-100 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {page?.markdown}
                        </Markdown>
                    </div>
                </div>

                <div className="flex justify-center mt-16">
                    <Link href={'/' + (typeof category === 'object' && category?.slug ? category.slug : categorySlug)}>
                        <button className="group flex items-center justify-center w-12 h-12 border-2 border-gray-300 hover:border-black hover:bg-black transition-all duration-300">
                            <ArrowUturnLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                        </button>
                    </Link>
                </div>
            </div>

            <Footer />
        </>
    )
}