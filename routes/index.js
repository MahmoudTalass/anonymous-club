const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/");

router.get("/posts");

router.get("/post/create");

router.post("/post/create");

module.exports = router;
