const Message = require("../models/message");
const User = require("../models/user");
const { isAuth, isAdmin } = require("../middlewares/auth_middleware");
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

const createMessageGet = [
   isAuth,
   (req, res, next) => {
      res.render("message_form", {
         title: "New Message",
      });
   },
];

const createMessagePost = [
   isAuth,
   body("title", "Must provide a title.").trim().notEmpty().escape(),
   body("message_body", "Must provide a message body.").trim().notEmpty().escape(),
   async (req, res, next) => {
      const errors = validationResult(req);

      const message = new Message({
         title: req.body.title,
         text: req.body.message_body,
         author: req.user.id,
      });

      if (!errors.isEmpty()) {
         return res.render("message_form", {
            title: "New Message",
            message,
            errors: errors.array(),
         });
      }

      await message.save();
      res.redirect("/");
   },
];

const adminAccessGet = (req, res, next) => {
   res.render("admin_form", {
      title: "Admin form",
   });
};

const adminAccessPost = [
   isAuth,
   body("password", "Must specify a password.")
      .trim()
      .notEmpty()
      .escape()
      .custom((value) => {
         return value === process.env.ADMIN_PASSWORD;
      })
      .withMessage("Incorrect password."),
   async (req, res, next) => {
      const errors = validationResult(req);

      const user = new User({
         firstname: req.user.firstname,
         lastname: req.user.lastname,
         email: req.user.email,
         _id: req.user.id,
         password: req.user.password,
      });

      user.admin = true;
      user.membership_status = true;

      if (!errors.isEmpty()) {
         return res.render("member_form", {
            title: "Admin form",
            errors: errors.array(),
         });
      }

      await User.findByIdAndUpdate(req.user.id, user, {
         runValidators: true,
      });
      res.redirect("/");
   },
];

// const deleteMessagePost = [isAuth, isAdmin, (req, res, next) => {}];

module.exports = {
   home,
   joinClubFormGet,
   joinClubFormPost,
   createMessageGet,
   createMessagePost,
   adminAccessGet,
   adminAccessPost,
};
