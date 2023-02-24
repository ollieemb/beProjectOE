
exports.handleCustomErrors = (error, request, response, next) => {

  if(error.status){
    response.status(error.status).send({msg: error.msg})
  } else {
    next(error);
  }
}

exports.handle500Statuses = (error, request, response, next) => {
response.status(500).send({ msg: "Error detected" });
};


  
exports.handle400Errors = (error, request, response, next) => {
  console.log(error);

  if (error.code === '22P02') {
    response.status(400).send({msg: 'Bad request sent'});
    } else {
  next(error);
}
}

exports.handle404Statuses = (error, request, response, next) => {
  console.log(error);

  if (error.msg === 'Invalid ID') {
      response.status(400).send({msg: 'Invalid ID'});
  } else if  (error.msg === 'Please insert valid Review_ID') {
  response.status(404).send({msg: 'Please insert valid Review_ID'})
  } else if  (error.msg === 'Request Unavailable') {
    response.status(400).send({msg: 'Request Unavailable'})
} else next(error);
  }

