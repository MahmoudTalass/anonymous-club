const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
   title: { type: String, required: true },
   timestamp: { type: Date, required: true, default: Date.now },
   text: { type: String, required: true },
   author: { type: Schema.ObjectId, ref: "User" },
});

MessageSchema.virtual("timestamp_formatted").get(function () {
   return this.timestamp.toLocaleString();
});

module.exports = mongoose.model("Message", MessageSchema);
