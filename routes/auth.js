const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.get("/login");

router.post("/login");

router.get("/register", authController.registerGet);

router.post("/register", authController.registerPost);

router.post("/logout");

module.exports = router;
