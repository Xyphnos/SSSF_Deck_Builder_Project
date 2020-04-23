const express = require('express');
const router = express.Router();
const controller = require('../controllers/deckController');

router.get('/', controller.deckGet());
router.get('/', controller.deckGetAll());
router.post('/', controller.deckAdd());
router.put('/', controller.deckModify());
router.delete('/', controller.deckDelete());


module.exports = router;