const { connect, close } = require("../db-connect");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var mailer = require("./mail-function");
var moment = require("moment");
const bcrypt = require("bcrypt");
const State = require("../schema/State");
const City = require("../schema/City");
const Bank = require("../schema/Bank");
const Branch = require("../schema/Branch");
const Token = require("../schema/Token");
const Transaction = require("../schema/Transaction");
const saltrounds = 10;
const os = require("os");
const stripe = require("stripe")(process.env.stripe);
connect();

const getStates = async (req, res) => {
  let response = 200;
  let token = await getToken(req);
  try {
    let validate_token = await authenticateToken(req, res);
    if (validate_token == false)
      return res.send({ status: 403, message: "UNAUTHORISED" });

    if (token !== process.env.ADMIN) {
      await decrementLimit(req, res);
    }
    let states = await State.find({
      country_id: 1,
    }).sort({ state_id: 1 });
    response = 200;
    res.json({ success: true, data: states });
  } catch (e) {
    console.log(e);
    res.json({ success: false, data: [] });
    response = 503;
  }
  if (token !== process.env.ADMIN) await updateTransaction(req, response);
  return;
};

const getCities = async (req, res) => {
  let response = 200;
  let token = await getToken(req);
  try {
    let validate_token = await authenticateToken(req, res);
    if (validate_token == false)
      return res.send({ status: 403, message: "UNAUTHORISED" });

    if (token !== process.env.ADMIN) await decrementLimit(req, res);
    let cities = await City.find({ state_id: req.params.state_id }).sort({
      city_id: 1,
    });
    response = 200;
    res.json({ success: true, data: cities });
  } catch (e) {
    response = 503;
    res.json({ success: false, data: [] });
  }
  if (token !== process.env.ADMIN) await updateTransaction(req, response);
  return;
};

const getBanks = async (req, res) => {
  let response = 200;
  let token = await getToken(req);
  try {
    let validate_token = await authenticateToken(req, res);
    if (validate_token == false)
      return res.send({ status: 403, message: "UNAUTHORISED" });

    if (token !== process.env.ADMIN) await decrementLimit(req, res);
    let banks = await Bank.find({}).sort({ bank_id: 1 });
    res.json({ success: true, data: banks });
  } catch (e) {
    res.json({ success: false, data: [] });
    response = 503;
  }
  if (token !== process.env.ADMIN) await updateTransaction(req, response);
  return;
};

const getResults = async (req, res) => {
  let validate_token = await authenticateToken(req, res);
  if (validate_token == false)
    return res.send({ status: 403, message: "UNAUTHORISED" });
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
  let token = await getToken(req);
  if (token !== process.env.ADMIN) await decrementLimit(req, res);
  let results = await Branch.find(query, { _id: 0 });
  if (token !== process.env.ADMIN) await updateTransaction(req, 200);
  return sendResponse(results, res);
};

const getKeywordResults = async (req, res) => {
  let validate_token = await authenticateToken(req, res);
  if (validate_token == false)
    return res.send({ status: 403, message: "UNAUTHORISED" });

  let token = await getToken(req);
  if (token !== process.env.ADMIN) await decrementLimit(req, res);
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
  if (token !== process.env.ADMIN) await updateTransaction(req, 200);
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

  return jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
    if (err) {
      return false;
    } else {
      let data = await Token.find({ api: token });
      if (data.length > 0 || token == process.env.ADMIN) {
        return true;
      }
      return false;
    }
  });
}
// to get token
const getToken = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
};
// function to check if token exists
function authenticateDevToken(req, res, next) {
  //jwt
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return false;
  }

  return jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
    if (err) {
      return false;
    }
    return true;
  });
}
const Register = async (req, res) => {
  let userDetails = req.body;
  if (
    userDetails.name == undefined ||
    userDetails.password == undefined ||
    userDetails.email == undefined
  ) {
    return res.json({ error: false, data: "Failed" });
  }

  return generateAPI(req, res, true);
};

const Login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const login = Token.where({
    email: email,
  });
  login.findOne(function (err, user) {
    if (err) return res.send({ data: "login failed", error: true });
    if (user) {
      let usr_password = user.password;
      bcrypt.compare(password, usr_password, function (err, result) {
        if (err) {
          console.log(err);
          return res.send({ data: "something went wrong ", error: true });
        }
        if (result == false) {
          return res.send({ data: "login failed", error: true });
        }
        const access_token = jwt.sign(user.email, process.env.ACCESS_TOKEN);
        return res
          .status(200)
          .json({ data: user, error: false, token: access_token });
      });
    } else {
      return res.send({ data: " User doesnt exist ! ", error: true });
    }
  });
};

const generateAPI = async (req, res, valid_email) => {
  try {
    if (valid_email) {
      let api = uuidv4();
      const password = req.body.password;
      const access_token = jwt.sign(api, process.env.ACCESS_TOKEN);
      bcrypt.hash(password, saltrounds, function (err, hash) {
        if (err) {
          console.log(err);
          return res.json({ error: true, data: "Failed" });
        }

        Token.findOneAndUpdate(
          { email: req.body.email },
          {
            name: req.body.name,
            password: hash,
            api: access_token,
            lastUpdatedTimeStamp: new Date(),
            limit: "1000",
            plan: "Free",
            expiryDate: "null",
          },
          { upsert: true },
          async function (err, doc) {
            if (err) {
              console.log(err);
              return res.json({
                error: true,
                data: "Failed",
              });
            }

            let is_mail_sent = await mailer.main(req.body.email, access_token);
            if (is_mail_sent) {
              return Login(req, res);
            }
          }
        );
      });
    } else {
      return res.json({ error: true, data: "Failed" });
    }
  } catch (e) {
    return res.json({ error: true, data: "Failed" });
  }
};

const getAPIKit = async (req, res) => {
  res.type("Blob");
  return res.sendFile("BaAL.zip", { root: __dirname });
};

const decrementLimit = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let data = await Token.findOne({ api: token });
  let limit = Number(data.limit);
  if (
    data.expiryDate !== "null" &&
    moment(new Date().toISOString()).isSameOrAfter(
      new Date(data.expiryDate).toISOString()
    )
  ) {
    return res.send({ status: 403, message: "UNAUTHORISED" });
  }
  if (!isNaN(limit)) {
    if (limit == 0) {
      return res.send({ status: 403, message: "UNAUTHORISED" });
    }
    limit--;
    Token.updateOne(
      { api: token },
      { limit: limit },
      async function (err, doc) {
        if (err) {
          console.log(err);
        }
        return;
      }
    );
  }
};

const updateTransaction = async (req, response) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let transaction = new Transaction({
      api: token,
      ipv4: req.headers["x-forwarded-for"],
      request: req.route.path,
      response: response,
    });

    await transaction.save();
  } catch (e) {
    console.log(e);
  }
};

const getTransactions = async (req, res) => {
  let api = req.params.api;
  let data = await Transaction.find({ api: api }).sort({ executionDate: -1 });
  return res.json({ error: false, data: data });
};

const getLimits = async (req, res) => {
  let api = req.params.api;
  let data = await Token.find(
    { api: api },
    { limit: 1, plan: 1, expiryDate: 1, _id: 0 }
  );
  return res.json({ error: false, data: data });
};

const changePass = async (req, res) => {
  try {
    let validate_token = await authenticateDevToken(req, res);
    if (validate_token == false)
      return res.send({ status: 403, error: true, data: "UNAUTHORISED" });

    let data = {};
    let email = req.body.email;
    if (req.body.name !== undefined) {
      data.name = req.body.name;
    }
    if (req.body.password != undefined) {
      return bcrypt.hash(
        req.body.password,
        saltrounds,
        async function (err, hash) {
          if (err) {
            console.log(err);
            return res.json({ error: true, data: "Failed" });
          }
          data.password = hash;
          await Token.updateOne({ email: email }, data);
          return res.json({ error: false, data: "success" });
        }
      );
    }

    await Token.updateOne({ email: email }, data);
    return res.json({ error: false, data: "success" });
  } catch (e) {
    return res.json({ error: true, data: "failed" });
  }
};

const subscription = async (req, res) => {
  try {
    const { email, payment_method, name, plan } = req.body;

    const customer = await stripe.customers.create({
      payment_method: payment_method,
      email: email,
      name: name,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: plan.plan }],
      expand: ["latest_invoice.payment_intent"],
    });

    const status = subscription["latest_invoice"]["payment_intent"]["status"];
    const client_secret =
      subscription["latest_invoice"]["payment_intent"]["client_secret"];

    res.json({ client_secret: client_secret, status: status, error: false });
  } catch (e) {
    res.json({ client_secret: "", status: "", error: true });
  }
};

const updatePlan = async (req, res) => {
  try {
    let plan = "Free";
    if (req.body.price == 300) {
      plan = "Basic";
    } else if (req.body.price == 700) {
      plan = "Standard";
    } else {
      plan = "Premium";
    }

    let data = {
      limit: req.body.limit,
      plan: plan,
      expiryDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
    };
    await Token.updateOne({ email: req.body.email }, data);
    let is_mail_sent = await mailer.subscription(
      req.body.email,
      plan,
      req.body.price,
      req.body.limit
    );
    if (is_mail_sent) {
      return res.json({ error: false, data: "success" });
    } else {
      return res.json({ error: true, data: "Failed" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ error: true, data: "Failed" });
  }
};
const resetPass = async (req, res) => {
  try {
    let email = req.body.email;
    let account = await Token.find({ email: email });
    if (account.length <= 0) {
      return res.json({
        error: true,
        data: "No account associated with this email ID",
      });
    }
    let api = uuidv4();
    api = api.substr(0, 7);
    bcrypt.hash(api, saltrounds, function (err, hash) {
      if (err) {
        console.log(err);
        return res.json({ error: true, data: "Failed to reset password" });
      }

      Token.findOneAndUpdate(
        { email: email },
        {
          password: hash,
        },

        async function (err, doc) {
          if (err) {
            console.log(err);
            return res.json({
              error: true,
              data: "Failed to update password",
            });
          }

          let mail = await mailer.reset(email, api);
          if (mail) {
            return res.json({ error: false, data: "successfull" });
          }
        }
      );
    });
  } catch (e) {
    console.log(e);
    return res.json({ error: true, data: "Failed to reset password" });
  }
};

module.exports = {
  getStates,
  getCities,
  getBanks,
  getResults,
  getKeywordResults,
  Register,
  Login,
  getAPIKit,
  getTransactions,
  getLimits,
  changePass,
  subscription,
  updatePlan,
  resetPass,
};
