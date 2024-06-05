const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
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
               title: "Register",
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

         res.redirect("/auth/login");
      } catch (err) {
         const error = new Error("Failed to register user, please try again.");
         error.status = 409;
      }
   },
];

const loginGet = (req, res, next) => {
   res.render("login_form", {
      title: "Login",
   });
};

const loginPost = [
   body("email", "Must provide an email address.").trim().notEmpty().escape(),
   body("password", "Must provide a password").trim().isLength({ min: 8 }).escape(),
   (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.render("login_form", {
            title: "Login",
            email: req.body.email,
            errors: errors.array(),
         });
      }
      next();
   },
   (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
         if (err) throw err;

         if (info) {
            return res.render("login_form", {
               title: "Login",
               email: req.body.email,
               errors: [{ msg: info.message }],
            });
         }
         req.login(user, (loginErr) => {
            if (loginErr) throw loginErr;

            res.send("<h1>success</h1>");
         });
      })(req, res, next);
   },
];

module.exports = {
   registerGet,
   registerPost,
   loginGet,
   loginPost,
};
