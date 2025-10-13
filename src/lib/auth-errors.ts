export function getAuthErrorMessage(error: unknown): string {
	const errorMessage = error instanceof Error ? error.message : String(error)

	const convexErrorMatch = errorMessage.match(/Uncaught Error: (\w+)/)
	const errorType = convexErrorMatch ? convexErrorMatch[1] : null

	switch (errorType) {
		case "InvalidSecret":
			return "Invalid email or password. Please try again."
		case "AccountNotFound":
			return "No account found with this email address."
		case "AccountAlreadyExists":
			return "An account with this email already exists."
		case "InvalidVerificatio nCode":
			return "Invalid or expired verification code."
		case "CodeExpired":
			return "Verification code has expired. Please request a new one."
		default:
			if (errorMessage.toLowerCase().includes("password")) {
				return "Invalid password. Please try again."
			}
			if (errorMessage.toLowerCase().includes("email")) {
				return "Invalid email address."
			}
			if (errorMessage.toLowerCase().includes("network")) {
				return "Network error. Please check your connection and try again."
			}
			return "Something went wrong. Please try again."
	}
}
