const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

const registerGet = (req, res, next) => {
   res.render("register_form", {
      title: "Register",
   });
};

const registerPost = [
   body("firstname", "Must provide a first name.").trim().notEmpty().escape(),
   body("lastname", "Must provide a last name.").trim().notEmpty().escape(),
   body("email")
      .trim()
      .notEmpty()
      .withMessage("Must provide an email address.")
      .escape()
      .custom(async (value) => {
         const user = await User.findOne({ email: value }).exec();
         if (user) {
            throw new Error("A user already exists with this email address.");
         }
      })
      .custom(async (value) => {
         const emailRegexp =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

         return emailRegexp.test(value);
      })
      .withMessage("Please enter a valid email (eg. example@gmail.com)."),
   body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must at least be 8 characters long.")
      .escape()
      .custom((value) => {
         const pwrdRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
         return pwrdRegexp.test(value);
      })
      .withMessage(
         "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (e.g., !, @, #, $, %, etc.)."
      ),
   body("password_confirmation")
      .trim()
      .notEmpty()
      .escape()
      .custom((value, { req }) => {
         console.log(value, req.body.password);
         return value === req.body.password;
      })
      .withMessage("Passwords do not match."),
   async (req, res, next) => {
      try {
         const errors = validationResult(req);

         const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
         });

         if (!errors.isEmpty()) {
            return res.render("register_form", {
               user,
               errors: errors.array(),
            });
         }

         bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
               throw new Error("Could not register user, please try again.");
            }
            user.password = hashedPassword;
            await user.save();
         });

         res.redirect("/");
      } catch (err) {
         const error = new Error("Failed to register user, please try again.");
         error.status = 409;
      }
   },
];
// const login = [
//    passport.authenticate("local", {
//       successRedirect: "/",
//       failureRedirect: "/",
//       successMessage: "You are logged in!",
//       failureMessage: "Login failure",
//    }),
// ];

module.exports = {
   registerGet,
   registerPost,
};
