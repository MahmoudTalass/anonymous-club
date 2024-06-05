const Message = require("../models/message");

const home = async (req, res, next) => {
   const messages = await Message.find().populate("author").exec();

   res.render("home", {
      title: "Clubhouse",
      messages,
   });
};

module.exports = {
   home,
};
