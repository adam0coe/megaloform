/**
 * AuthContext — single source of truth for "who is the current candidate".
 *
 * Owns three pieces of state:
 *   - token:     JWT issued by the server; attached to every protected request
 *   - candidate: the candidate object the server returned alongside the token
 *   - loading:   true on first mount while we read localStorage
 *
 * Persists token + candidate to localStorage so a page refresh doesn't log
 * the user out. localStorage is the simplest "good enough" choice; swapping
 * to httpOnly cookies later is a self-contained change to this file only.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Candidate } from '../types'
import { signup as signupService, login as loginService } from '../services/candidate-input'

type AuthContextValue = {
  token: string | null
  candidate: Candidate | null
  loading: boolean
  // signup/login return the new candidate so the caller can use the id
  // immediately (e.g. for navigation) without waiting for a re-render.
  // Reading from `candidate` in the same handler that called login() would
  // give the stale (pre-update) value because of how React closures capture.
  signup: (email: string, password: string) => Promise<Candidate>
  login: (email: string, password: string) => Promise<Candidate>
  logout: () => void
  // Lets dashboards push fresh candidate data after a registration/test update
  // without re-fetching from the server.
  setCandidate: (c: Candidate) => void
}

const STORAGE_TOKEN = 'mf_token'
const STORAGE_CANDIDATE = 'mf_candidate'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [candidate, setCandidateState] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)

  // On first mount, hydrate from localStorage. Wrapped in try/catch because
  // localStorage can throw in some private-browsing modes, and a malformed
  // JSON blob shouldn't take the whole app down.
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_TOKEN)
      const c = localStorage.getItem(STORAGE_CANDIDATE)
      if (t && c) {
        setToken(t)
        setCandidateState(JSON.parse(c) as Candidate)
      }
    } catch {
      // Ignore — start logged-out.
    } finally {
      setLoading(false)
    }
  }, [])

  function persist(t: string, c: Candidate) {
    setToken(t)
    setCandidateState(c)
    localStorage.setItem(STORAGE_TOKEN, t)
    localStorage.setItem(STORAGE_CANDIDATE, JSON.stringify(c))
  }

  async function signup(email: string, password: string) {
    const { token: t, candidate: c } = await signupService({ email, password })
    persist(t, c)
    return c
  }

  async function login(email: string, password: string) {
    const { token: t, candidate: c } = await loginService({ email, password })
    persist(t, c)
    return c
  }

  function logout() {
    setToken(null)
    setCandidateState(null)
    localStorage.removeItem(STORAGE_TOKEN)
    localStorage.removeItem(STORAGE_CANDIDATE)
  }

  function setCandidate(c: Candidate) {
    setCandidateState(c)
    localStorage.setItem(STORAGE_CANDIDATE, JSON.stringify(c))
  }

  // useMemo so the context value is stable across renders that don't change
  // any of these fields. Without it, every consumer re-renders on every
  // parent render, even when nothing they care about changed.
  const value = useMemo<AuthContextValue>(
    () => ({ token, candidate, loading, signup, login, logout, setCandidate }),
    [token, candidate, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Tiny convenience wrapper. Throws if used outside an AuthProvider — that's
 * a programmer error, not a runtime one we should silently handle.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
