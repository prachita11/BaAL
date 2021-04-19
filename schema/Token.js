const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Token = new Schema({
  api: String,
  lastUpdatedTimeStamp: Date,
  email: String,
});
module.exports = mongoose.model("Token", Token);
