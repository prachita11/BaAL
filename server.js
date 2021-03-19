const express = require("express");
const apiHandler = require("./api-handler/api-function");
const api = express();
app.use(express.json())
app.use(express.urlencoded());

api.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
  res.setHeader("Access-Control-Request-Headers", "Content-Type ,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
api.get("/states",async (req, res) =>await apiHandler.getStates(req,res));
api.get("/banks",async (req, res) =>await apiHandler.getBanks(req,res));
api.get("/cities/:state_id",async (req, res) =>await apiHandler.getCities(req,res));
api.post("/branch",async (req, res) =>await apiHandler.getResults(req,res));
api.post("/search",async(req,res)=>await apiHandler.getKeywordResults(req,res))
api.listen(3001, () => console.log("Server is running on 3001"));