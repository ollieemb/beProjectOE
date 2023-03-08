const {selectReviews} = require("../models/reviewsModels");
const {selectReview} = require("../models/reviewsModels");
const {selectComments} = require("../models/reviewsModels");
const {addComment} = require("../models/reviewsModels"); 
const {updateReviewVotes} = require("../models/reviewsModels");
const {selectUsers} = require("../models/reviewsModels");




exports.getReviews = (request, response, next) => {
    const category = request.query.category;
    const sortBy = request.query.sort_by || 'created_at';
    const order = request.query.order || 'desc';
  
    const validCategories = [
      'push-your-luck',
      'roll-and-write',
      'strategy',
      'deck-building',
      'hidden-roles',
      'dexterity',
      'engine-building',
    ];
  
    const validSortByColumns = ['title', 'designer', 'owner', 'votes', 'category', 'created_at'];
    if (!validSortByColumns.includes(sortBy)) {
      return response.status(400).send({ error: `Invalid sortBy column` });
    }
  
    if (category && !validCategories.includes(category)) {
      return response.status(400).send({ error: `Invalid category`});
    }
  
    if (order !== 'asc' && order !== 'desc') {
      return response.status(400).send({ msg: "Invalid query input" });
    }
  
    selectReviews(category, sortBy, order)
      .then((reviews) => {
        response.status(200).send({ reviews });
      })
      .catch(next);
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
        response.status(201).send({ comment: result });
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
  
exports.getUsers = (request, response, next) => {
    const {query} = request.query;

    selectUsers(query)
    .then((users) => {
        response.status(200).send({users});
    })
    .catch((err) => {
        console.log(err);
        next(err);
    })
}
 