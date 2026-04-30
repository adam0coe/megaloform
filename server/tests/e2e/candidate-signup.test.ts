/**
 * End-to-end test: signup persists a candidate.
 *
 * Scope: the smallest possible test that exercises the full stack with a
 * real database. We drive the actual client service against the actual
 * Express app, which talks to the real Mongoose model, which writes to a
 * real (in-memory) MongoDB instance. After the call returns, we query
 * MongoDB directly and assert the document is there with the expected,
 * sanitized email.
 *
 * Compared to the integration test (server/tests/integration/...):
 *   - The Mongoose model is NOT mocked — we use the real one.
 *   - bcrypt is NOT mocked — we want to exercise real password hashing.
 *   - We connect Mongoose to mongodb-memory-server, an ephemeral DB that
 *     boots in this process and is thrown away when the test ends.
 *
 * Why "very very simple": one test, one round trip, one DB read. The goal
 * is to prove the entire stack is wired correctly. Broader e2e flows
 * (login, registration, scoring) belong in additional files if/when we
 * decide to invest in them.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import app from '../../app'
import Candidate from '../../model'

type ServicesModule = {
  signup: (input: { email: string; password: string }) => Promise<{
    token: string
    candidate: { _id: string; profile: { email: string } }
  }>
}

let mongo: MongoMemoryServer
let server: Server
let services: ServicesModule

// 60 s timeout: the FIRST run of this test downloads the MongoDB binary
// (~150 MB, cached at ~/.cache/mongodb-binaries). Subsequent runs use the
// cache and complete in ~1–2 s.
beforeAll(async () => {
  // 1. Boot an in-memory MongoDB and connect Mongoose to it.
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())

  // 2. Boot the real Express app on a random port.
  server = app.listen(0)
  const { port } = server.address() as AddressInfo

  // 3. Stub VITE_API_URL, then dynamic-import the client service so it
  //    captures the right URL at module-load time. Same trick as in
  //    server/tests/integration/candidate-input.test.ts.
  vi.stubEnv('VITE_API_URL', `http://localhost:${port}`)
  services = (await import(
    '../../../client/src/services/candidate-input'
  )) as ServicesModule
}, 60_000)

afterAll(async () => {
  // Tear down in reverse order: HTTP server, Mongoose, MongoDB instance.
  server.close()
  await mongoose.disconnect()
  await mongo.stop()
  vi.unstubAllEnvs()
})

describe('e2e: candidate signup', () => {
  it('persists a new candidate with the sanitized email', async () => {
    // Deliberately messy input — uppercase letters and surrounding
    // whitespace. The controller's `sanitizedEmail = email.trim().toLowerCase()`
    // logic must actually run for this test to pass.
    // Password is 8+ chars to satisfy the new MIN_PASSWORD_LENGTH policy.
    const result = await services.signup({
      email: '  Hello@Example.COM  ',
      password: 'longenough',
    })

    // Sanity: the new endpoint returns a token alongside the candidate.
    expect(typeof result.token).toBe('string')
    expect(result.token.length).toBeGreaterThan(0)

    // Query the real DB directly. If the round trip worked, exactly one
    // document should exist with the sanitized email.
    const stored = await Candidate.findOne({ 'profile.email': 'hello@example.com' })

    expect(stored).not.toBeNull()
    expect(stored!.profile.email).toBe('hello@example.com')
  })
})
