/**
 * ProtectedRoute — wraps a route element and gates it behind authentication.
 *
 * Behaviour:
 *   - Auth still loading from localStorage → render nothing (avoids flashing
 *     the login page for users who are actually logged in).
 *   - No token → redirect to /login. `replace` overwrites the history entry
 *     so the back button doesn't return to a protected page after logout.
 *   - Token present → render the wrapped element as-is.
 *
 * It does NOT verify the token's freshness — that happens server-side on
 * each request. If a stored token has expired, the protected page renders
 * but its first API call returns 401, and the service throws.
 * (TODO: a global fetch interceptor that auto-logs-out on 401 would close
 * that loop, but it's a follow-up.)
 */

import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth()

  if (loading) return null
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}
