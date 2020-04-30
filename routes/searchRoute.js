'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/backt');

router.get('/', controller.cardSearch);
router.get('/entries', controller.entrySearch);

module.exports = router;