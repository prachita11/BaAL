const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let State = new Schema({
  country_id: Number,
  state_id:Number,
  state_name:String,
  is_data_available:Boolean
});
module.exports = mongoose.model("State", State);