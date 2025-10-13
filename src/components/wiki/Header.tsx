import Link from "next/link"

type Settings = {
	sitename: string
	subtitle: string
	disclaimer?: string
}

export default function Header({
	breadcrumb,
	settings,
}: {
	breadcrumb?: string
	settings?: Settings | null
}) {
	return (
		<div className="flex flex-col gap-y-3 text-center">
			<div className="flex justify-center">
				<Link href="/" className="flex gap-x-4 items-center">
					<p className="text-2xl font-semibold hover:cursor-pointer">
						{settings?.sitename || "Wiki"}
					</p>

					{breadcrumb && (
						<div className="flex gap-x-3.5 text-xl items-center">
							<p className="text-2xl">/</p>
							<p className="text-xl">{breadcrumb}</p>
						</div>
					)}
				</Link>
			</div>

			<p className="text-sm">{settings?.subtitle || "Knowledge Base"}</p>
		</div>
	)
}
