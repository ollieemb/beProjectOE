const express = require("express");
const app = express();
const {getCategories} = require("./controllers/categoriesControllers")
const {handle500Statuses, handle404Statuses } = require("./controllers/errorHandlingControllers")
const {getReviews} = require("./controllers/reviewsControllers")



app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);


app.use((request, response, next) => {
    response.status(404).send({msg: 'path not found!'})
})


app.use(handle404Statuses);

app.use(handle500Statuses);




module.exports = app;
