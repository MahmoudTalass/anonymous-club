const isAuth = (req, res, next) => {
   if (req.isAuthenticated()) {
      next();
   } else {
      res.render("authorization_error");
   }
};

module.exports = { isAuth };
