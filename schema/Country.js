const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Country = new Schema({
  country_id: Number,
  country_name:String,
});
module.exports = mongoose.model("Country", Country);
