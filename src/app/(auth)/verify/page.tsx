import { Suspense } from "react"
import VerifyContent from "./VerifyContent"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function VerifyFallback() {
	return (
		<div className="space-y-4">
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<Loader2 className="h-16 w-16 text-primary animate-spin" />
							</div>
							<h1 className="text-2xl font-bold text-foreground">Loading...</h1>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default function VerifyPage() {
	return (
		<Suspense fallback={<VerifyFallback />}>
			<VerifyContent />
		</Suspense>
	)
}
