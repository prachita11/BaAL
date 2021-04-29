const express = require("express");
const apiHandler = require("./api-handler/api-function");

const api = express();
api.use(express.json());
api.use(express.urlencoded());

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

api.get("/states", async (req, res) => await apiHandler.getStates(req, res));
api.get("/banks", async (req, res) => await apiHandler.getBanks(req, res));
api.get(
  "/cities/:state_id",
  async (req, res) => await apiHandler.getCities(req, res)
);
api.post("/branch", async (req, res) => await apiHandler.getResults(req, res));
api.post(
  "/search",
  async (req, res) => await apiHandler.getKeywordResults(req, res)
);

api.post(
  "/api/register",
  async (req, res) => await apiHandler.Register(req, res)
);
api.post("/api/login", async (req, res) => await apiHandler.Login(req, res));
api.get("/api", async (req, res) => await apiHandler.getAPIKit(req, res));
api.get(
  "/transaction/:api",
  async (req, res) => await apiHandler.getTransactions(req, res)
);
api.post(
  "/api/changePass",
  async (req, res) => await apiHandler.changePass(req, res)
);
api.get(
  "/limit/:api",
  async (req, res) => await apiHandler.getLimits(req, res)
);
api.post("/sub", async (req, res) => await apiHandler.subscription(req, res));
api.post(
  "/updatePlan",
  async (req, res) => await apiHandler.updatePlan(req, res)
);
api.post(
  "/resetPass",
  async (req, res) => await apiHandler.resetPass(req, res)
);
api.listen(process.env.PORT || 3001, () =>
  console.log("Server is running on 3001")
);
