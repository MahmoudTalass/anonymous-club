const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/");

router.get("/create-post");

router.post("/create-post");

router.get("/join-club");

router.get("/admin-access");

module.exports = router;
