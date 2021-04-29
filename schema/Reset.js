const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Reset = new Schema({
  email: String,
  token: String,
  expiryDate: { type: String, default: null },
});
module.exports = mongoose.model("Reset", Reset);
