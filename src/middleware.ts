import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
	nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isSignInPage = createRouteMatcher(["/login", "/register"])
const isProtectedRoute = createRouteMatcher(["/dash"])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, "/dash")
	}
	if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, "/login")
	}
	// Note: Admin check is done at the page level, not in middleware
	// This is because middleware runs on the edge and can't easily query Convex with auth context
})

export const config = {
	// The following matcher runs middleware on all routes
	// except static assets.
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
