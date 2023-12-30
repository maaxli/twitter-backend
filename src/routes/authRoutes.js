const express = require('express');
const router = express.Router();

const {
    loginUser,
    obtainJWT
} = require('../controllers/authController');

router.route('/login').post(loginUser);
router.route('/authenticate').post(obtainJWT);


module.exports = router;