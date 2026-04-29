/**
 * Integration test: client services <-> server.
 *
 * Scope is intentionally narrow: verify that each client service function
 * sends data over the wire to the server correctly, and that the server's
 * response comes back to the client correctly. We do NOT test database
 * persistence, scoring logic, or business rules — those are unit-test
 * concerns.
 *
 * Strategy:
 *   1. Mock the Mongoose model so the server can answer without a DB.
 *   2. Mock bcrypt so password hashing is fast and deterministic.
 *   3. Boot the real Express app on a random port (no collisions).
 *   4. Stub VITE_API_URL to point at that port.
 *   5. Dynamic-import the client service AFTER step 4, because it captures
 *      `import.meta.env.VITE_API_URL` at module-load time.
 *   6. For each service function: pre-arm the model mock with sentinel data,
 *      call the service, assert the model was called with the data we sent,
 *      and assert the service returned the data the server replied with.
 */

import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

// vi.mock is hoisted to the top of the file, BEFORE any imports.
// Anything that transitively loads the model (router -> controller -> model)
// receives the mocked version. We expose only the four model methods the
// controllers actually call.
vi.mock('../../model', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findById: vi.fn(),
  },
}))

// bcryptjs is used by the controller's `enter` flow. Mocking it avoids
// real hashing and lets us write a stable assertion on the persisted hash.
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed'),
    compare: vi.fn().mockResolvedValue(true),
  },
}))

import app from '../../app'
import Candidate from '../../model'

// We can't statically import the client service: it does
//     const API = import.meta.env.VITE_API_URL
// at module-load time. We need the env stubbed first. So we hold the module
// in a typed variable and load it in beforeAll.
type ServicesModule = {
  upsertCandidate: (input: { email: string; password: string }) => Promise<unknown>
  updateCandidate: (
    id: string,
    data: { firstName: string; lastNames: string; phone: string }
  ) => Promise<unknown>
  testCandidate: (id: string, choices: string[]) => Promise<unknown>
  fetchCandidate: (id: string) => Promise<unknown>
}

let services: ServicesModule
let server: Server

beforeAll(async () => {
  // Port 0 means "let the OS pick a free port" — collision-safe.
  server = app.listen(0)
  const { port } = server.address() as AddressInfo

  vi.stubEnv('VITE_API_URL', `http://localhost:${port}`)

  // Dynamic import: triggers module evaluation NOW, after the env stub,
  // so the client's `const API = import.meta.env.VITE_API_URL` sees our value.
  services = (await import(
    '../../../client/src/services/candidate-input'
  )) as ServicesModule
})

afterAll(() => {
  server.close()
  vi.unstubAllEnvs()
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('client <-> server integration', () => {
  // -- upsertCandidate ----------------------------------------------------

  describe('upsertCandidate', () => {
    it('sends email/password to the server and returns the created candidate', async () => {
      const sentinel = { _id: 'abc', profile: { email: 'a@b.c' } }
      // New-user path: findOne returns null, controller calls Candidate.create.
      vi.mocked(Candidate.findOne).mockResolvedValue(null)
      vi.mocked(Candidate.create).mockResolvedValue(sentinel as never)

      const result = await services.upsertCandidate({
        email: 'a@b.c',
        password: 'pw',
      })

      // Server received the data the client sent.
      expect(Candidate.create).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: expect.objectContaining({ email: 'a@b.c' }),
          passwordHash: 'hashed',
        })
      )
      // Client got back the data the server replied with.
      expect(result).toEqual(sentinel)
    })
  })

  // -- updateCandidate ----------------------------------------------------

  describe('updateCandidate', () => {
    it('sends registration fields and returns the updated candidate', async () => {
      const sentinel = { _id: 'abc', profile: { firstName: 'Jon' } }
      vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(sentinel as never)

      const result = await services.updateCandidate('abc', {
        firstName: 'Jon',
        lastNames: 'Doe',
        phone: '555',
      })

      expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc',
        expect.objectContaining({
          $set: expect.objectContaining({
            'profile.firstName': 'Jon',
            'profile.lastNames': 'Doe',
            'profile.phone': '555',
          }),
        }),
        expect.any(Object)
      )
      expect(result).toEqual(sentinel)
    })
  })

  // -- testCandidate ------------------------------------------------------

  describe('testCandidate', () => {
    it('sends choices and returns the updated candidate', async () => {
      const sentinel = { _id: 'abc', steps: { test: { score: 10 } } }
      vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(sentinel as never)

      const result = await services.testCandidate('abc', ['a', 'b', 'c', 'd', 'a'])

      expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc',
        expect.objectContaining({
          $set: expect.objectContaining({
            'steps.test.choices': ['a', 'b', 'c', 'd', 'a'],
          }),
        }),
        expect.any(Object)
      )
      expect(result).toEqual(sentinel)
    })
  })

  // -- fetchCandidate -----------------------------------------------------

  describe('fetchCandidate', () => {
    it('GETs by id and returns the candidate', async () => {
      const sentinel = { _id: 'abc', profile: { email: 'a@b.c' } }
      vi.mocked(Candidate.findById).mockResolvedValue(sentinel as never)

      const result = await services.fetchCandidate('abc')

      expect(Candidate.findById).toHaveBeenCalledWith('abc')
      expect(result).toEqual(sentinel)
    })
  })
})
