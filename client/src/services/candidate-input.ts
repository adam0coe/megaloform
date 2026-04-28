import type { Candidate, LoginInput, RegistrationInput } from '../types'

const API = import.meta.env.VITE_API_URL

export async function upsertCandidate(candidateInput: LoginInput): Promise<Candidate> {
  const res = await fetch(`${API}/auth/enter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(candidateInput),
  })
  if (res.ok) return res.json() as Promise<Candidate>
  throw new Error(`Failed to log in or sign up user: error ${res.status}`)
}

export async function updateCandidate(candidateId: string, dataInput: RegistrationInput): Promise<Candidate> {
  const res = await fetch(`${API}/candidates/${candidateId}/registration`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataInput),
  })
  if (res.ok) return res.json() as Promise<Candidate>
  throw new Error(`Failed to register user: error ${res.status}`)
}

export async function testCandidate(candidateId: string, choices: string[]): Promise<Candidate> {
  const res = await fetch(`${API}/candidates/${candidateId}/test`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choices }),
  })
  if (res.ok) return res.json() as Promise<Candidate>
  throw new Error(`Failed to test user: error ${res.status}`)
}

export async function fetchCandidate(candidateId: string): Promise<Candidate> {
  const res = await fetch(`${API}/candidates/${candidateId}`)
  if (!res.ok) throw new Error(`Failed to fetch candidate: ${res.status}`)
  return res.json() as Promise<Candidate>
}
