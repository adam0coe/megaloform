import rateLimit from 'express-rate-limit';

/**
 * Login: aggressive throttling. 5 attempts per 15 minutes per IP is enough
 * for a typo-prone human and useless for a brute-force script — an attacker
 * with a 10k-word list would need ~3 weeks to try them all from one IP.
 *
 * `standardHeaders: true` puts the limit info in the modern RateLimit-* headers
 * (RFC 6585 family). `legacyHeaders: false` skips the older X-RateLimit-* set.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many login attempts. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Signup: less critical than login but worth limiting so an attacker can't
 * flood the DB with junk accounts. 10 per hour per IP is generous for any
 * legitimate use case (people don't sign up to the same site over and over)
 * and stops mass-creation cold.
 */
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many signup attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
