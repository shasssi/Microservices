const express = require('express');
const { registerUser, loginController, refreshTokenContoller } = require('../controllers/login-controller');

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerUser);
router.post("/refresh", refreshTokenContoller);


module.exports = router;