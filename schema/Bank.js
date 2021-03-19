const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Bank = new Schema({
  bank_id:Number,
  bank_name:String
});
module.exports = mongoose.model("Bank", Bank);