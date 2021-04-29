const express = require("express");
const apiHandler = require("./api-handler/api-function");
const cors = require("cors");
var path = require("path");
const api = express();
api.use(express.json());
api.use(express.urlencoded());
api.use(cors());
api.use(express.static(path.join(__dirname, "api-handler")));
var corsOptions = {
  origin: ["https://baal-in.netlify.app", "http://localhost:3000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
api.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
  res.setHeader(
    "Access-Control-Request-Headers",
    "Content-Type ,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

api.get(
  "/states",
  cors(corsOptions),
  async (req, res) => await apiHandler.getStates(req, res)
);
api.get(
  "/banks",
  cors(corsOptions),
  async (req, res) => await apiHandler.getBanks(req, res)
);
api.get(
  "/cities/:state_id",
  cors(corsOptions),
  async (req, res) => await apiHandler.getCities(req, res)
);
api.post(
  "/branch",
  cors(corsOptions),
  async (req, res) => await apiHandler.getResults(req, res)
);
api.post(
  "/search",
  cors(corsOptions),
  async (req, res) => await apiHandler.getKeywordResults(req, res)
);

api.post(
  "/api/register",
  cors(corsOptions),
  async (req, res) => await apiHandler.Register(req, res)
);
api.post(
  "/api/login",
  cors(corsOptions),
  async (req, res) => await apiHandler.Login(req, res)
);
api.get(
  "/api",
  cors(corsOptions),
  async (req, res) => await apiHandler.getAPIKit(req, res)
);
api.get(
  "/transaction/:api",
  cors(corsOptions),
  async (req, res) => await apiHandler.getTransactions(req, res)
);
api.post(
  "/api/changePass",
  cors(corsOptions),
  async (req, res) => await apiHandler.changePass(req, res)
);
api.get(
  "/limit/:api",
  cors(corsOptions),
  async (req, res) => await apiHandler.getLimits(req, res)
);
api.post(
  "/sub",
  cors(corsOptions),
  async (req, res) => await apiHandler.subscription(req, res)
);
api.post(
  "/updatePlan",
  cors(corsOptions),
  async (req, res) => await apiHandler.updatePlan(req, res)
);
api.post(
  "/resetPass",
  cors(corsOptions),
  async (req, res) => await apiHandler.resetPass(req, res)
);
api.listen(process.env.PORT || 3001, () =>
  console.log("Server is running on 3001")
);
