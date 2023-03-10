const express = require("express");
const app = express();
const {getCategories} = require("./controllers/categoriesControllers")
const {handle500Statuses, handle404Statuses, handleCustomErrors, handle400Errors } = require("./controllers/errorHandlingControllers")
const {getReviews} = require("./controllers/reviewsControllers")
const {getReviewID} = require("./controllers/reviewsControllers")
const {getComments} = require("./controllers/reviewsControllers")
const {postComment} = require("./controllers/reviewsControllers")
const {patchReviews} = require("./controllers/reviewsControllers")
const {getUsers} = require("./controllers/reviewsControllers")
const cors = require('cors');

app.use(cors());

app.use(express.json())




app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewID);
app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReviews);

app.get("/api/users", getUsers);



app.use((request, response, next) => {
    response.status(404).send({msg: 'path not found!'})
})

app.use(handleCustomErrors);
app.use(handle404Statuses);
app.use(handle400Errors);
app.use(handle500Statuses);






module.exports = app;
