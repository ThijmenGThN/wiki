"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { Page } from '@/payload-types'

import { classNames } from "@/helpers/tailwind"
import CardStack from "./CardStack"
import LoadingSpinner from "./LoadingSpinner"

export default function Search() {
    const [results, setResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (searchTerm.length < 2) {
            setResults([])
            setIsLoading(false)
        } else {
            setIsLoading(true)
            const delay = setTimeout(async () => {
                const query = new URLSearchParams({
                    'where[or][0][title][like]': searchTerm,
                    'where[or][1][subtitle][like]': searchTerm,
                    'limit': '4'
                })

                try {
                    const response = await fetch(`/api/pages?${query.toString()}`)
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    const { docs: pages } = await response.json()
                    setResults(pages)
                } catch (error) {
                    console.error('Error fetching data:', error)
                } finally {
                    setIsLoading(false)
                }
            }, 750)

            return () => clearTimeout(delay)
        }
    }, [searchTerm])

    return (
        <div className="relative -mt-8 mx-8 sm:mx-16 md:mx-32">
            <CardStack>
                <div className="p-6">
                    <div className="relative">
                        {/* Search icon */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <MagnifyingGlassIcon className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-gray-900' : 'text-gray-400'}`} />
                        </div>

                        {/* Loading spinner */}
                        {isLoading && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <LoadingSpinner size="sm" className="text-gray-400" />
                            </div>
                        )}

                        <input
                            className="block w-full border-0 py-4 pl-12 pr-12 text-gray-900 bg-gray-50 focus:bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-black placeholder:text-gray-400 text-base font-light transition-all duration-300 focus:shadow-lg"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Search knowledge base..."
                            type="text"
                        />

                        {/* Results dropdown */}
                        <div className={classNames(
                            "absolute w-full bg-white border border-gray-200 mt-2 shadow-2xl z-50 transform transition-all duration-300",
                            results.length === 0 ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                        )}>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-px bg-gray-900"></div>
                                    <p className="text-sm font-medium text-gray-900">Search Results</p>
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                </div>
                                <ul className="space-y-2">
                                    {results.map((result: Page, index) => (
                                        <li key={result.id}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                            className="animate-fadeInUp"
                                        >
                                            <Link
                                                className="block p-4 border border-gray-100 hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 group"
                                                href={`/${typeof result.category === 'object' ? result.category.slug : ''}/${result.slug}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 group-hover:bg-gray-900 transition-colors"></div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 group-hover:text-black">{result.title}</p>
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.subtitle}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </CardStack>
        </div>
    )
}