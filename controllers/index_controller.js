const Message = require("../models/message");
const User = require("../models/user");
const { isAuth, isAdmin } = require("../middlewares/auth_middleware");
const { body, validationResult } = require("express-validator");

// Render the home page with all the messages
const home = async (req, res, next) => {
   const messages = await Message.find().populate("author").exec();

   res.render("home", {
      title: "Clubhouse",
      messages,
   });
};

// If user is authenticated, render the member form
const joinClubFormGet = [
   isAuth,
   (req, res, next) => {
      res.render("member_form", { title: "Member form" });
   },
];

/**
 * If user is authenticated, validate and sanitize their input.
 * Check if it matches the expected member password.
 *
 * If validation passes, update the user to have a membership status
 * set to true.
 *
 * If validation fails, re-render the form with the errors.
 */
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
      const errors = validationResult(req);

      const user = new User({
         firstname: req.user.firstname,
         lastname: req.user.lastname,
         email: req.user.email,
         _id: req.user.id,
         password: req.user.password,
      });

      user.membership_status = true;

      if (!errors.isEmpty()) {
         return res.render("member_form", {
            title: "Member form",
            errors: errors.array(),
         });
      }

      await User.findByIdAndUpdate(req.user.id, user, {
         runValidators: true,
      });
      res.redirect("/");
   },
];

// If user is authenticated, render the new message form
const createMessageGet = [
   isAuth,
   (req, res, next) => {
      res.render("message_form", {
         title: "New Message",
      });
   },
];

/**
 * If user is authenticated, validate and sanitize their message input.
 *
 * If validation passes, create a new message.
 *
 * If validation fails, re-render the form with the errors.
 */
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

// If user is authenticated, render the admin form
const adminAccessGet = (req, res, next) => {
   res.render("admin_form", {
      title: "Admin form",
   });
};

/**
 * If user is authenticated, validate their admin password input against admin
 * admin password.
 *
 * If they provided the correct input, update the user's model to have the admin
 * role and the member role set to true.
 *
 * If the input is incorrect, re-render the form with the error.
 */
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

/**
 * If a user is authenticated and is an admin, delete the message
 * with the id found in url params.
 * */
const deleteMessagePost = [
   isAuth,
   isAdmin,
   async (req, res, next) => {
      await Message.deleteOne({ _id: req.params.id }).exec();

      res.redirect("/");
   },
];

module.exports = {
   home,
   joinClubFormGet,
   joinClubFormPost,
   createMessageGet,
   createMessagePost,
   adminAccessGet,
   adminAccessPost,
   deleteMessagePost,
};
