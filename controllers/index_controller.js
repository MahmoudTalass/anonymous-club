const Message = require("../models/message");
const { isAuth } = require("../middlewares/auth_middleware");

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

module.exports = {
   home,
   joinClubFormGet,
};
