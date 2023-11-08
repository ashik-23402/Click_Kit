const express = require('express');
const { hello, registerUser } = require('../Controllers/userCotroller');
const router = express.Router();


router.route("/hello").get(hello);
router.route("/register").post(registerUser);


module.exports = router;


