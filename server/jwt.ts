import jwt from 'jsonwebtoken';

// In production, JWT_SECRET MUST be set via env. The dev fallback exists so
// the project still runs out of the box for new contributors, but it's logged
// loudly so the warning isn't lost in the noise. Anyone deploying with the
// fallback active is one curl request away from minted-by-anyone tokens.
const SECRET: string = process.env.JWT_SECRET ?? 'dev-only-secret-change-me';
if (SECRET === 'dev-only-secret-change-me') {
  console.warn('⚠️  JWT_SECRET not set — using dev default. DO NOT deploy like this.');
}

// 7 days. Long enough that returning candidates don't have to log in every
// session; short enough that a stolen token expires before it can do
// long-term damage. Standard tradeoff.
const EXPIRES_IN = '7d';

// What we put inside the token. Keep this minimal: no email, no profile data,
// no role flags. The token travels with every request — small payload =
// small overhead. Anything else we need we look up by id on the server.
export type TokenPayload = {
  candidateId: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

// Returns the payload if the token is valid; null if it's missing, malformed,
// expired, or signed with a different secret. Returning null (rather than
// throwing) makes the caller's code in the middleware simpler — one branch
// instead of a try/catch.
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    // jwt.verify can return a string or an object; we only sign objects, but
    // TS doesn't know that without a guard.
    if (typeof decoded === 'object' && decoded !== null && 'candidateId' in decoded) {
      return { candidateId: String((decoded as { candidateId: unknown }).candidateId) };
    }
    return null;
  } catch {
    return null;
  }
}
