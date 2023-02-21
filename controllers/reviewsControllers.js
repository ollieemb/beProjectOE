const {selectReviews} = require("../models/reviewsModels");

exports.getReviews = (request, response, next) => {
    selectReviews().then((reviews) => {
        response.status(200).send({ reviews });
    })
    .catch((error) => {
        console.log(error);
        next(error);
    })
    };


    



