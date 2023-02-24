const {selectReviews} = require("../models/reviewsModels");
const {selectReview} = require("../models/reviewsModels");
const {selectComments} = require("../models/reviewsModels");
const {addComment} = require("../models/reviewsModels"); 
const {updateReviewVotes} = require("../models/reviewsModels");



exports.getReviews = (request, response, next) => {
    selectReviews().then((reviews) => {
        response.status(200).send({ reviews });
    })
    .catch((error) => {
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

exports.postComment = (request, response, next) => {
    const { review_id } = request.params;
    const { username, body } = request.body || {}; 
    if (!body) {
      return next({
        status: 400,
        msg: 'Please provide valid body request'
      });
    }
    if (!username) {
      return next({
        status: 400,
        msg: 'Please provide a valid username'
      });
    }
    addComment(review_id, username, body)
      .then((result) => {
        console.log(result);
        response.status(201).send({ comment: result });
        console.log(review_id);
      })
      .catch((err) => { 
        next(err)});
  };

exports.patchReviews = (request, response, next) => {
 const {review_id} = request.params;
 const {inc_votes} = request.body;
  
updateReviewVotes(review_id, inc_votes)
    .then((updatedReview) => {
     response.status(200).send({updated_review: updatedReview});
     })
     .catch((err) => next(err));
  }
  

 