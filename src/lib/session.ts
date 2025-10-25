/**
 * Session management for anonymous users
 * Generates and persists a unique session ID in localStorage
 */

const SESSION_KEY = "wiki_session_id"

/**
 * Get or create a session ID for the current browser
 * This is used to track likes from anonymous users
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return ""
  }

  let sessionId = localStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    // Generate a random session ID
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(SESSION_KEY, sessionId)
  }

  return sessionId
}
