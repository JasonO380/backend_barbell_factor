const express = require('express');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/:uid', userController.getUserbyID);

module.exports = router;