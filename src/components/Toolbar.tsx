import Link from "next/link"

export default function Toolbar() {
    return (
        <div className="border-b border-gray-100">
            <div className="flex justify-end py-3 px-8 sm:px-16 md:px-32">
                <ul className="flex items-center gap-x-6 text-sm font-light">
                    <li>
                        <Link
                            href="/admin"
                            className="text-gray-600 hover:text-black transition-colors duration-200 border-b border-transparent hover:border-gray-300"
                        >
                            Admin
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://github.com/ThijmenGThN/Wiki"
                            target="_blank"
                            className="text-gray-600 hover:text-black transition-colors duration-200 border-b border-transparent hover:border-gray-300"
                        >
                            GitHub
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}