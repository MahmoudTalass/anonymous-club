const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
   firstname: { type: String, required: true },
   lastname: { type: String, required: true },
   email: { type: String, required: true, lowercase: true },
   password: { type: String, required: true },
   membership_status: { type: Boolean, required: true },
   admin: Boolean,
});

UserSchema.virtual("fullname").get(function () {
   return this.firstname + " " + this.lastname;
});

module.exports = mongoose.model("User", UserSchema);
