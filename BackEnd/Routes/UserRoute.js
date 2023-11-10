const express = require('express');
const { hello, registerUser, loginUser, logout, forgotPassword, resetPassword, getuserDetails, updatePassword, updateProfile, getAllusers, getauser, updateRole, deleteUser } = require('../Controllers/userCotroller');
const { isAuthenticatedUser, authorizeRole } = require('../Middleware/auth');
const router = express.Router();


router.route("/hello").get(hello);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser,getuserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/admin/getusers").get(isAuthenticatedUser,authorizeRole("admin"),getAllusers);
router.route("/admin/getuser/:id")
    .get(isAuthenticatedUser,authorizeRole("admin"),getauser)
    .put(isAuthenticatedUser,authorizeRole("admin"),updateRole)
    .delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser);




module.exports = router;


