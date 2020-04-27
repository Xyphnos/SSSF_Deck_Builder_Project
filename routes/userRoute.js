'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.user_get_by_username);

router.get('/:id', userController.user_get_by_id);

router.post('/', userController.user_post);

router.put('/', (req, res) => {
  res.send('With this endpoint you can edit users');
});

router.delete('/', (req, res) => {
  res.send('With this endpoint you can delete users');
});

module.exports = router;
