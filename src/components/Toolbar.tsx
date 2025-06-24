import Link from "next/link"

export default function Toolbar() {
    return (
        <div className="flex justify-end">
            <ul className="mt-3 flex gap-x-3 divide-x divide-gray-300 underline text-xs px-2 mx-8 sm:mx-16 md:mx-32">
                <li className="pl-3">
                    <Link href="/admin">
                        Admin
                    </Link>
                </li>
                <li className="pl-3">
                    <Link href="https://github.com/ThijmenGThN/Wiki" target="_blank">
                        GitHub
                    </Link>
                </li>
            </ul>
        </div>
    )
}