"use client"

import { useQuery } from "convex/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/../convex/_generated/api"

// Centralized route configuration
export const ROUTE_CONFIG = {
	
	// Where to redirect after successful authentication
	DEFAULT_AUTHENTICATED_ROUTE: "/dash",

	// Where to redirect when authentication is required
	DEFAULT_UNAUTHENTICATED_ROUTE: "/login",

	// Routes that require authentication (supports glob patterns)
	PROTECTED_ROUTES: ["/dash"],

	// Routes that should redirect authenticated users away (login, register, etc.)
	AUTH_ROUTES: ["/login", "/register", "/reset", "/verify"],

} as const

interface RouteGuardProps {
	children: React.ReactNode
	loadingComponent?: React.ReactNode
}

export function RouteGuard({ children, loadingComponent }: RouteGuardProps) {
	const user = useQuery(api.users.current)
	const router = useRouter()
	const pathname = usePathname()
	const [isRedirecting, setIsRedirecting] = useState(false)

	const isProtectedRoute = ROUTE_CONFIG.PROTECTED_ROUTES.some((route) =>
		pathname.startsWith(route),
	)
	const isAuthRoute = ROUTE_CONFIG.AUTH_ROUTES.some((route) => pathname.startsWith(route))

	useEffect(() => {
		// Reset redirecting state when pathname changes
		setIsRedirecting(false)

		// Wait for the query to resolve
		if (user === undefined) {
			return
		}

		const isAuthenticated = user !== null

		// Redirect authenticated users away from auth pages
		if (isAuthenticated && isAuthRoute) {
			setIsRedirecting(true)
			router.push(ROUTE_CONFIG.DEFAULT_AUTHENTICATED_ROUTE)
			return
		}

		// Redirect unauthenticated users away from protected pages
		if (!isAuthenticated && isProtectedRoute) {
			setIsRedirecting(true)
			router.push(ROUTE_CONFIG.DEFAULT_UNAUTHENTICATED_ROUTE)
			return
		}
	}, [user, router, pathname, isProtectedRoute, isAuthRoute])

	// Show loading only while auth is being checked AND we're on a route that might need redirect
	if (user === undefined) {
		if (isProtectedRoute || isAuthRoute) {
			return loadingComponent || null
		}
		// For public routes, show content immediately
		return <>{children}</>
	}

	const isAuthenticated = user !== null

	// Hide content only while actively redirecting
	if (isRedirecting) {
		return loadingComponent || null
	}

	// Check if we should be redirecting (but haven't started yet)
	const shouldRedirect =
		(isAuthenticated && isAuthRoute) || (!isAuthenticated && isProtectedRoute)

	if (shouldRedirect) {
		return loadingComponent || null
	}

	// Route is accessible, render children
	return <>{children}</>
}
