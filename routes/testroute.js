const express = require('express');
const router = express.Router();
const controller = require('../controllers/backt');

router.get('/', (req, res) => {
    console.log(controller.lotus());
    res.send(controller.lotus);
});

module.exports = router;