const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const { strategy } = require("./config/passport");

// dotenv config
require("dotenv").config();

// Database setup
const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
   await mongoose.connect(process.env.MONGODB_URL);
}

// Routes
const indexRouter = require("./routes/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
   session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
         maxAge: 14 * 24 * 60 * 60,
      },
      store: MongoStore.create({
         mongoUrl: process.env.MONGODB_URL,
         collectionName: "sessions",
      }),
   })
);

// Passport config
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render("error");
});

module.exports = app;
