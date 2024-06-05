const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index_controller");

// Enable access of user throughout the route
router.use((req, res, next) => {
   res.locals.user = req.user;
   next();
});

/* GET home page. */
router.get("/", indexController.home);

router.get("/create-post");

router.post("/create-post");

router.get("/join-club", indexController.joinClubFormGet);

router.post("/join-club", indexController.joinClubFormPost);

router.get("/admin-access");

module.exports = router;
