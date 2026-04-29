import {
  upsertCandidate,
  updateCandidate,
  testCandidate,
  fetchCandidate,
} from '../services/candidate-input'

describe('candidate-input service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ---------- upsertCandidate ----------

  describe('upsertCandidate', () => {
    it('POSTs to /auth/enter with email and password in body', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ _id: '123' }),
      } as Response)

      await upsertCandidate({ email: 'a@b.c', password: 'pw' })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/enter'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'a@b.c', password: 'pw' }),
        })
      )
    })

    it('returns the parsed candidate on success', async () => {
      const candidate = { _id: '123', profile: { email: 'a@b.c' } }
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => candidate,
      } as Response)

      const result = await upsertCandidate({ email: 'a@b.c', password: 'pw' })

      expect(result).toEqual(candidate)
    })

    it('throws with the status code on a non-OK response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
      } as Response)

      await expect(
        upsertCandidate({ email: 'a@b.c', password: 'wrong' })
      ).rejects.toThrow('error 401')
    })
  })

  // ---------- updateCandidate ----------

  describe('updateCandidate', () => {
    it('PATCHes to /candidates/:id/registration with the registration body', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await updateCandidate('abc123', {
        firstName: 'Jon',
        lastNames: 'Doe',
        phone: '555',
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/candidates/abc123/registration'),
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: 'Jon', lastNames: 'Doe', phone: '555' }),
        })
      )
    })
  })

  // ---------- testCandidate ----------

  describe('testCandidate', () => {
    it('PATCHes to /candidates/:id/test and wraps choices in { choices }', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await testCandidate('abc123', ['a', 'b', 'c', 'd', 'a'])

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/candidates/abc123/test'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ choices: ['a', 'b', 'c', 'd', 'a'] }),
        })
      )
    })
  })

  // ---------- fetchCandidate ----------

  describe('fetchCandidate', () => {
    it('GETs /candidates/:id', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await fetchCandidate('abc123')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/candidates/abc123')
      )
    })

    it('throws with the status code on a non-OK response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchCandidate('abc123')).rejects.toThrow('404')
    })
  })
})
