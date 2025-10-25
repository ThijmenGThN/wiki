/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server"
import type * as auth from "../auth.js"
import type * as email from "../email.js"
import type * as http from "../http.js"
import type * as import_ from "../import.js"
import type * as users from "../users.js"
import type * as verify from "../verify.js"
import type * as wiki from "../wiki.js"

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
	auth: typeof auth
	email: typeof email
	http: typeof http
	import: typeof import_
	users: typeof users
	verify: typeof verify
	wiki: typeof wiki
}>
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>
