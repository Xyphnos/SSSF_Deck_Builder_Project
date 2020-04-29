'use strict';

const express = require('express');
const router = express.Router();

router.get('/:username', (req, res) => {
    res.render('profile', {room: req.user})
});

module.exports = router;