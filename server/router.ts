import express from 'express'
const router = express.Router();
import * as controller from './controller'

router.post('/auth/enter', controller.enter)
router.patch('/candidates/:id/registration', controller.register)
router.patch('/candidates/:id/test', controller.testCandidate)
router.get('/candidates/:id', controller.fetchCandidate)

export default router;
