const express = require('express');
const router = express.Router();
const controller = require('../controllers/backt');

router.get('/', controller.lotus);

module.exports = router;