const isAuth = (req, res, next) => {
   if (req.isAuthenticated()) {
      next();
   } else {
      res.render("authorization_error");
   }
};

const isAdmin = (req, res, next) => {
   if (req.user.admin === true) {
      next();
   } else {
      res.redirect("/");
   }
};

module.exports = { isAuth, isAdmin };
