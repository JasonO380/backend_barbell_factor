const express = require('express');
const macrosControllers = require('../controllers/macros-controller');
const { check } = require('express-validator');

const router = express.Router();

router.get('/:mid', macrosControllers.getMacrosById);

router.get('/macroslog/:uid', macrosControllers.getMacrosByUserId);
//with express-validators enter array of checks for fields to be validated
router.post('/', 
[
    check('carbs').not().isEmpty(),
    check('protein').not().isEmpty(),
    check('fats').not().isEmpty()
] , macrosControllers.addMacros);

router.patch('/:mid',
[
    check('carbs').not().isEmpty(),
    check('protein').not().isEmpty(),
    check('fats').not().isEmpty()
] , macrosControllers.updateMacrosByID);

router.delete('/:mid', macrosControllers.deleteMacrosbyID);

module.exports = router;