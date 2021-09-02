const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/createAccount", authController.createAccount.bind(authController));
router.post("/login", authController.logIn.bind(authController));
router.post("/updatePassword/:userId?", authController.updatePassword.bind(authController));

module.exports = router;
