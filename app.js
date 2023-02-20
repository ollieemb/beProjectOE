const express = require("express");
const app = express();
const {getCategories} = require("./controllers/categoriesControllers")
const {handle500Statuses, handle404Statuses } = require("./controllers/errorHandlingControllers")

app.get("api/categories")


app.use(express.json());

app.get("/api/categories", getCategories)

app.use(handle404Statuses);
app.use(handle500Statuses);




module.exports = app;
