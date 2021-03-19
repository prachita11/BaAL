const { connect, close } = require("../db-connect");
const State = require("../schema/State");
const City = require("../schema/City");
const Bank = require("../schema/Bank");
const Branch = require("../schema/Branch");

connect();

const getStates = async (req, res) => {
  let states = await State.find({ country_id: 1 }).sort( { "state_id": 1 } );
  return res.json({ success: true, data: states });
};
const getCities = async (req, res) => {
  let cities = await City.find({ state_id: req.params.state_id }).sort( { "city_id": 1 } );
  return res.json({ success: true, data: cities });
};

const getBanks = async (req, res) => {
  let banks = await Bank.find({}).sort( { "bank_id": 1 } );
  return res.json({ success: true, data: banks });
};

const getResults = async (req, res) => {
  let state_id = req.body.state_id;
  let city_id = req.body.city_id;
  let bank_id = req.body.bank_id;
  let type = req.body.type;
 let query={};
 if(state_id!==null){
 query.state_id=state_id;
 }
 if(city_id!==null)
 {
   query.city_id=city_id;
 }
 if(bank_id!==null)
 {
   query.bank_id = bank_id
 }
 if(type==2)
 {
   query.is_bank=true;
 }else if(type==3)
 {
   query.is_bank=false;
 }
 let results = await Branch.find(query,{_id:0});
 return sendResponse(results, res);

  
};

const getKeywordResults = async (req, res) => {
 let arr = req.body.arr;
 var regex = [];
 let data;
 for (var i = 0; i < arr.length; i++) {
     regex[i] = "."+arr[i]+".";
      data = await Branch.find({"branch_address": {$regex: regex[i],$options:'i'}},{_id:0});
 } 
 return sendResponse(data, res);  
};

const sendResponse = (results, res) => {
  if (results.length < 1) {
    return res.send({ status: false, data: results });
  }
  return res.send({ status: true, data: results });
};
module.exports = {
  getStates,
  getCities,
  getBanks,
  getResults,
  getKeywordResults
};
