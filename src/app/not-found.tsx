import Link from "next/link"
import { MostViewed } from "@/components/wiki/most-viewed"

export default function NotFound() {
	return (
		<div className="container mx-auto py-16 md:py-20 lg:py-24 px-4 max-w-2xl">
			<div className="relative text-center py-10 md:py-14">
				<svg
					width="248"
					height="139"
					viewBox="0 0 248 139"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-[28rem] lg:w-[36rem] h-auto opacity-[0.07]"
					aria-hidden="true"
				>
					<path
						d="M193.417 138.64C192.22 138.64 191.25 137.669 191.25 136.472L191.25 2.43215C191.25 1.23516 192.22 0.264807 193.417 0.264807L245.333 0.264809C246.53 0.264809 247.5 1.23516 247.5 2.43216L247.5 136.472C247.5 137.669 246.53 138.64 245.333 138.64L193.417 138.64Z"
						fill="currentColor"
					/>
					<path
						d="M140.824 138.64C139.627 138.64 138.659 137.669 138.628 136.473C138.36 126.217 136.192 116.083 132.218 106.576C127.964 96.3987 121.72 87.1284 113.823 79.3032C105.926 71.4772 96.5314 65.2503 86.1663 60.9956C76.4671 57.0143 66.1056 54.8369 55.6046 54.5733C54.408 54.5432 53.4374 53.5757 53.4374 52.3787V2.15094C53.4374 0.953943 54.408 -0.0181522 55.6048 0.000257236C73.2049 0.270974 90.6044 3.83701 106.885 10.52C123.835 17.4774 139.244 27.6785 152.23 40.5473C165.216 53.4165 175.525 68.7019 182.56 85.5341C189.317 101.699 192.926 118.983 193.202 136.472C193.22 137.669 192.248 138.64 191.051 138.64H140.824Z"
						fill="currentColor"
					/>
					<path
						d="M53.4375 136.472C53.4375 137.669 52.4671 138.64 51.2702 138.64H2.16735C0.970353 138.64 0 137.669 0 136.472V56.4322C0 55.2352 0.970354 54.2648 2.16735 54.2648H51.2702C52.4671 54.2648 53.4375 55.2352 53.4375 56.4322V136.472Z"
						fill="currentColor"
					/>
				</svg>
				<h1 className="relative text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">404</h1>
				<p className="mt-4 text-lg md:text-xl text-muted-foreground">
					This page doesn't exist or may have been moved.
				</p>
				<Link
					href="/"
					className="mt-8 inline-block text-sm font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors"
				>
					Back to home
				</Link>
			</div>

			<div className="mt-16">
				<MostViewed />
			</div>
		</div>
	)
}
