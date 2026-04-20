//import { register } from "../../../server/controller";

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


export async function updateCandidate(candidateId, dataInput) {
  const res = await fetch(`http://localhost:3000/candidates/${candidateId}/registration`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(dataInput)
  })

  if (res.ok) return res.json();
  throw new Error(`Failed to register user: error ${res.status}`)
}

export async function testCandidate(candidateId, choices) {
  console.log(choices)
  const res = await fetch(`http://localhost:3000/candidates/${candidateId}/test`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ choices })
  })

  if (res.ok) return res.json();
  throw new Error(`Failed to test user: error ${res.status}`)
}

export async function fetchCandidate(candidateId) {
  const res = await fetch(`http://localhost:3000/candidates/${candidateId}`);
  if (!res.ok) throw new Error(`Failed to fetch candidate: ${res.status}`);
  return res.json();
}