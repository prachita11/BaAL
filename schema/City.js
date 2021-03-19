const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let City = new Schema({
  state_id: Number,
  city_id:Number,
  city_Name:String,
  dd_coordinates:String
});
module.exports = mongoose.model("City", City);