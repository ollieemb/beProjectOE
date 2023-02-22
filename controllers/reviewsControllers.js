const {selectReviews} = require("../models/reviewsModels");
const {selectReview} = require("../models/reviewsModels");
const {selectComments} = require("../models/reviewsModels");



exports.getReviews = (request, response, next) => {
    selectReviews().then((reviews) => {
        response.status(200).send({ reviews });
    })
    .catch((error) => {
        console.log(error);
        next(error);
    })
    };

exports.getReviewID = (request, response, next) => {
    selectReview(request.params.review_id)
    .then((review) => {
        response.status(200).send({review});
    })
    .catch((err) => 
    next (err));
};

exports.getComments = (request, response, next) => {
    const {review_id} = request.params;
    selectComments(review_id)
    .then((res) => {
        response.status(200).send({comments :res});
    })
    .catch((error) => 
    next(error));
};




