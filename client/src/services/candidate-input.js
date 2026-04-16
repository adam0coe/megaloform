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