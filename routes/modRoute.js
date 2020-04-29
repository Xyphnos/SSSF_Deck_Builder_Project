'use strict';

const express = require('express');
const router = express.Router();

router.get('/:name', (req, res) => {
    res.render('modify', {room: req.name})
});

module.exports = router;