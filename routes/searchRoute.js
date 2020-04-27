'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/backt');

router.get('/', controller.cardSearch);

module.exports = router;