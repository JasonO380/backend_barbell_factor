const express = require('express');
const macrosControllers = require('../controllers/macros-controller')

const router = express.Router();

router.get('/:mid', macrosControllers.getMacrosById);

router.get('/macroslog/:uid', macrosControllers.getMacrosByUserId);

router.post('/', macrosControllers.addMacros);

module.exports = router;