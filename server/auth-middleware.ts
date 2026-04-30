import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from './jwt';

// Module augmentation: tell TypeScript that `req.user` exists on Express's
// Request type. Without this, `req.user = ...` below would be a type error
// ("Property 'user' does not exist on type 'Request'"). The `declare global`
// is the only way to extend a type that's defined in node_modules; it
// effectively merges into Express's own type definitions at compile time.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware: rejects any request without a valid bearer token.
 * On success, attaches the decoded payload to req.user for downstream handlers.
 *
 * Convention: clients send `Authorization: Bearer <jwt>`. The "Bearer" prefix
 * is from RFC 6750 — universally understood by tools, libraries, and humans.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header.' });
  }

  // .slice(7) drops the literal "Bearer " prefix (7 characters including the space).
  const token = header.slice(7).trim();
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  req.user = payload;
  next();
}

/**
 * Middleware: rejects any request where the token's candidateId doesn't match
 * the :id in the URL. Use AFTER requireAuth — it depends on req.user being set.
 *
 * Without this, an authenticated candidate A could PATCH candidate B's
 * profile or test answers just by changing the URL. Authentication says
 * "you are who you say you are"; authorization says "you can only do that
 * to your own resources." Both are necessary.
 */
export function requireOwnership(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    // Defensive: should be impossible if requireAuth ran first, but guards
    // against a future refactor that forgets to chain them.
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  if (req.user.candidateId !== req.params.id) {
    // 403 Forbidden, not 401 Unauthorized: the caller IS authenticated, they
    // just don't have permission for this specific resource.
    return res.status(403).json({ message: 'You can only access your own data.' });
  }

  next();
}
