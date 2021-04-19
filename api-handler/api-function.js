const { connect, close } = require("../db-connect");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var mailer = require("./mail-function");
const Verifier = require("email-verifier");
const AdmZip = require("adm-zip");
const State = require("../schema/State");
const City = require("../schema/City");
const Bank = require("../schema/Bank");
const Branch = require("../schema/Branch");
const Token = require("../schema/Token");

connect();

const getStates = async (req, res) => {
  let validate_token = authenticateToken(req, res);
  if (validate_token == false)
    return res.send({ status: 403, message: "UNAUTHORISED" });
  let states = await State.find({
    country_id: 1,
  }).sort({ state_id: 1 });
  return res.json({ success: true, data: states });
};
const getCities = async (req, res) => {
  let validate_token = authenticateToken(req, res);
  if (validate_token == false)
    return res.send({ status: 403, message: "UNAUTHORISED" });
  let cities = await City.find({ state_id: req.params.state_id }).sort({
    city_id: 1,
  });
  return res.json({ success: true, data: cities });
};

const getBanks = async (req, res) => {
  let validate_token = authenticateToken(req, res);
  if (validate_token == false)
    return res.send({ status: 403, message: "UNAUTHORISED" });
  let banks = await Bank.find({}).sort({ bank_id: 1 });
  return res.json({ success: true, data: banks });
};

const getResults = async (req, res) => {
  let state_id = req.body.state_id;
  let city_id = req.body.city_id;
  let bank_id = req.body.bank_id;
  let type = req.body.type;
  let query = {};
  if (state_id !== null) {
    query.state_id = state_id;
  }
  if (city_id !== null) {
    query.city_id = city_id;
  }
  if (bank_id !== null) {
    query.bank_id = bank_id;
  }
  if (type == 2) {
    query.is_bank = true;
  } else if (type == 3) {
    query.is_bank = false;
  }
  let results = await Branch.find(query, { _id: 0 });
  return sendResponse(results, res);
};

const getKeywordResults = async (req, res) => {
  let validate_token = authenticateToken(req, res);
  if (validate_token == false)
    return res.send({ status: 403, message: "UNAUTHORISED" });
  let state = req.body.state;
  let city = req.body.city;
  let bank = req.body.bank;
  let arr = req.body.keyword;

  var regex = [];
  let data;
  if (arr !== null) {
    regex[0] = "." + arr + ".";
    var query = { branch_address: { $regex: regex[0], $options: "i" } };
    if (bank !== null && bank.length > 0) query.bank_id = bank[0].bank_id;
    data = await Branch.find(query, { _id: 0 });
  } else {
    let query = {};
    if (state !== null && state.length > 0) query.state_id = state[0].state_id;
    if (city !== null && city.length > 0) query.city_id = city[0].city_id;
    if (bank !== null && bank.length > 0) query.bank_id = bank[0].bank_id;
    data = await Branch.find(query, { _id: 0 });
  }
  return sendResponse(data, res);
};

const sendResponse = (results, res) => {
  if (results.length < 1) {
    return res.send({ status: false, data: results });
  }
  return res.send({ status: true, data: results });
};
// function to check if token exists
function authenticateToken(req, res, next) {
  //jwt
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return false;
  }

  return jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
}
const verifyEmail = async (req, res) => {
  try {
    let email = req.params.email;

    let verifier = new Verifier(process.env.EMAIL_VERIFY_API);
    verifier.verify(email, (err, data) => {
      let is_valid;
      if (err) {
        console.log(err);
        is_valid = false;
      } else if (
        data.formatCheck == "true" &&
        data.smtpCheck == "true" &&
        data.dnsCheck == "true" &&
        data.disposableCheck == "false"
      ) {
        is_valid = true;
      } else {
        is_valid = false;
      }
      return generateAPI(req, res, is_valid);
    });
  } catch (e) {
    return res.json({
      error: true,
      data: "Failed",
    });
  }
};

const generateAPI = async (req, res, valid_email) => {
  if (valid_email) {
    let api = uuidv4();

    const access_token = jwt.sign(api, process.env.ACCESS_TOKEN);
    Token.findOneAndUpdate(
      { email: req.params.email },
      { api: access_token, lastUpdatedTimeStamp: new Date() },
      { upsert: true },
      async function (err, doc) {
        if (err) {
          console.log(err);
          return res.json({
            error: true,
            data: "Failed",
          });
        }

        let is_mail_sent = await mailer.main(req.params.email, access_token);
        if (is_mail_sent) {
          res.type("Blob");
          return res.sendFile("/BAAL/backend/api-handler/BaAL.zip");
        }
      }
    );
  }
};
module.exports = {
  getStates,
  getCities,
  getBanks,
  getResults,
  getKeywordResults,
  verifyEmail,
};
