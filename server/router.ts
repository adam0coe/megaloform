import express from 'express'
import * as controller from './controller'
import { requireAuth, requireOwnership } from './auth-middleware'
import { loginLimiter, signupLimiter } from './rate-limit'

const router = express.Router();

// --- Public auth routes (rate-limited, no token required) -----------------
// /auth/enter is gone: split into signup (create account) and login (issue
// token). Each gets its own rate limiter — see rate-limit.ts for the rationale.
router.post('/auth/signup', signupLimiter, controller.signup)
router.post('/auth/login', loginLimiter, controller.login)

// --- Protected candidate routes -------------------------------------------
// Middleware chain runs in order: requireAuth proves identity (sets req.user),
// then requireOwnership confirms the URL :id matches the token. Both must
// pass before the controller runs.
router.patch('/candidates/:id/registration', requireAuth, requireOwnership, controller.register)
router.patch('/candidates/:id/test', requireAuth, requireOwnership, controller.testCandidate)
router.get('/candidates/:id', requireAuth, requireOwnership, controller.fetchCandidate)

export default router;
