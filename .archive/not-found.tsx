
import { Link } from "@/helpers/navigation"

import Explore from "@/components/Explore"
import Search from "@/components/Search"
import Header from "@/components/Header"

export default function NotFound() {

    return (
        <div className="min-h-screen h-full">
            <div className="flex flex-col gap-y-2 bg-red-400 p-4 text-white rounded-b-lg text-center">
                We&apos;re sorry, but it seems like we&apos;ve hit a dead end.
                <p className="text-xs">
                    However, worry not, as our wiki has a boundless well of information, ready to captivate and fascinate you.
                </p>
            </div>

            <div className="container mx-auto flex flex-col">

                <div className="grow mt-16">
                    <Header />

                    <Search />

                    <Link href="https://github.com/ThijmenGThN/Wiki">
                        <p className="mt-3 underline text-xs text-right px-2 mx-8 sm:mx-16 md:mx-32">
                            Star this project on Github
                        </p>
                    </Link>

                    <Explore />
                </div>

                <p className="my-16 mx-auto text-xs text-center w-3/4 sm:w-1/2">
                    This knowledge base, serves as a valuable tool to simplify installations, troubleshoot common problems, and enhance the overall developer experience. All rights reserved.
                </p>

            </div>
        </div>
    )
}