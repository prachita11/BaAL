const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Transaction = new Schema({
  api: String,
  executionDate: { type: Date, default: new Date() },
  request: String,
  response: Number,
});
module.exports = mongoose.model("Transaction", Transaction);
