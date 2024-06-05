const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.get("/login", authController.loginGet);

router.post("/login", authController.loginPost);

router.get("/register", authController.registerGet);

router.post("/register", authController.registerPost);

router.post("/logout", authController.logoutPost);

module.exports = router;
