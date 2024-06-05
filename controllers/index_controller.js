const Message = require("../models/message");
const User = require("../models/user");
const { isAuth } = require("../middlewares/auth_middleware");
const { body, validationResult } = require("express-validator");

const home = async (req, res, next) => {
   const messages = await Message.find().populate("author").exec();

   res.render("home", {
      title: "Clubhouse",
      messages,
   });
};

const joinClubFormGet = [
   isAuth,
   (req, res, next) => {
      res.render("member_form", { title: "Member form" });
   },
];

const joinClubFormPost = [
   isAuth,
   body("password", "Must specify a password")
      .trim()
      .notEmpty()
      .custom((value) => {
         return value === process.env.MEMBER_PASSWORD;
      })
      .withMessage("Incorrect password."),
   async (req, res, next) => {
      const user = await User.findById(req.user.id);
      user.membership_status = true;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.render("member_form", {
            title: "Member form",
            errors: errors.array(),
         });
      }

      await user.save();
      res.redirect("/");
   },
];

module.exports = {
   home,
   joinClubFormGet,
   joinClubFormPost,
};
