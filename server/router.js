const express = require('express')
const router = express.Router();
const controller = require('./controller')

router.post('/auth/enter', controller.enter)
router.patch('/candidates/:id/registration', controller.register)
router.patch('/candidates/:id/test', controller.testCandidate)
router.get('/candidates/:id', controller.fetchCandidate)

module.exports = router;