const express = require("express");
const app = express();
const {getCategories} = require("./controllers/categoriesControllers")


app.get("api/categories")


app.use(express.json());

app.get("/api/categories", getCategories)


module.exports = app;
