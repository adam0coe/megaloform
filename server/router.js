const express = require('express')
const router = express.Router();
const controller = require('./controller')

router.post('/auth/enter', controller.enter)

module.exports = router;