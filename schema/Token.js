const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Token = new Schema({
  api: String,
  name: String,
  lastUpdatedTimeStamp: Date,
  email: String,
  password: String,
  limit: {
    type: String,
    default: 1000,
  },
  plan: {
    type: String,
    default: "Free",
  },
  expiryDate: { type: String, default: null },
});
module.exports = mongoose.model("Token", Token);
