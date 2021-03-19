const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Branch = new Schema({
  branch_id: Number,
  bank_id:Number,
  city_id:Number,
  city_name:String,
  state_id:Number,
  branch_address:String,
  branch_timing: String,
  branch_phone:String,
  branch_coords:String,
  is_bank:Boolean
});
module.exports = mongoose.model("Branch", Branch);