const express = require("express");
const router = express.Router();

// Enable access of user throughout the route
router.use((req, res, next) => {
   res.locals.user = req.user;
   next();
});

/* GET home page. */
router.get("/");

router.get("/create-post");

router.post("/create-post");

router.get("/join-club");

router.get("/admin-access");

module.exports = router;
