export async function upsertCandidate(candidateInput) {
  const res = await fetch('http://localhost:3000/auth/enter', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(candidateInput)
  })

  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Failed to log in or sing up user: error ${res.status}`)
  }
}

export async function registerCandidate(candidateId, registerInput) {
  const res = await fetch(`http://localhost:3000/candidates/${candidateId}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(registerInput)
  })

  if (res.ok) return res.json();
  throw new Error(`Failed to register user: error ${res.status}`)
}