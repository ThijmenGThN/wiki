import { getDisclaimer } from '@/functions/settings'

export default async function Footer() {

    const disclaimer = await getDisclaimer()

    return (
        <p className="my-16 mx-auto text-xs text-center w-3/4 sm:w-1/2">
            {disclaimer}
        </p>
    )
}