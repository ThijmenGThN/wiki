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
})

export const config = {
	// The following matcher runs middleware on all routes
	// except static assets.
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
