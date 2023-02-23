const express = require("express");
const app = express();
const {getCategories} = require("./controllers/categoriesControllers")
const {handle500Statuses, handle404Statuses, handleCustomErrors, handle400Errors } = require("./controllers/errorHandlingControllers")
const {getReviews} = require("./controllers/reviewsControllers")
const {getReviewID} = require("./controllers/reviewsControllers")
const {getComments} = require("./controllers/reviewsControllers")




app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewID);
app.get("/api/reviews/:review_id/comments", getComments);



app.use((request, response, next) => {
    response.status(404).send({msg: 'path not found!'})
})

app.use(handle404Statuses);
app.use(handle500Statuses);
app.use(handle400Errors);
app.use(handleCustomErrors);





module.exports = app;
