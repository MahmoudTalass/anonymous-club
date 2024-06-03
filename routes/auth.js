const express = require("express");
const router = express.Router();

router.get("/login");

router.post("/login");

router.get("/register");

router.post("/register");

router.post("/logout");

module.exports = router;
