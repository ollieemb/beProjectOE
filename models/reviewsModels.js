const db = require("../db/connection");

exports.selectReviews = (category, sortBy = "created_at", order = "desc") => {
  const validSortByColumns = [
    "title",
    "designer",
    "owner",
    "votes",
    "category",
    "created_at",
  ];
  if (!validSortByColumns.includes(sortBy)) {
    throw new Error(`Invalid sortBy column: ${sortBy}`);
  }
  if (order !== "asc" && order !== "desc") {
    throw new Error(`Invalid order value: ${order}`);
  }

  let queryStr = `
    SELECT
      title,
      designer,
      owner,
      review_img_url,
      reviews.votes,
      category,
      reviews.created_at,
      COUNT(body) AS comment_count
    FROM
      reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id`;

  const values = [];

  if (category) {
    queryStr += ` WHERE category = $1`;
    values.push(category);
  }

  queryStr += `
    GROUP BY
      reviews.review_id`;

  if (category) {
    queryStr += `, category`;
  }

  queryStr += `
    ORDER BY
      ${sortBy} ${order}`;

  return db.query(queryStr, values).then((result) => {
    const rows = result.rows;
    if (rows.length === 0 && category) {
      throw new Error("Topic not found");
    }
    return rows;
  });
};


exports.selectReview = (id) => {
    if (isNaN(id)) {
        return Promise.reject({
            status: 400,
            msg: 'Invalid ID'
        });
    }

    let queryStr = `
    SELECT reviews.*, reviews.review_id FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

    const queryValues = [];
    if (id) {
        queryStr += ` WHERE reviews.review_id = $1`;
        queryValues.push(id);
    }
    queryStr += ` GROUP BY reviews.review_id`;

    return db.query(queryStr, queryValues).then((res) => {
        if (res.rows.length > 0){
            return res.rows;
        } else {
            return Promise.reject({
                status: 404,
                msg: "Not Found"
            });
        }
    });
};

exports.selectComments = (review_id) => {
    const idNum = parseInt(review_id);
    if (Number.isNaN(idNum)) {
        return Promise.reject({
          status: 400,
          msg: 'Request Unavailable'
        });
      }
      return db.query(`
          SELECT * FROM reviews WHERE review_id = $1;
        `, [review_id])
        .then((result) => {
          if (result.rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: 'Please insert valid Review_ID'
            });
          }
          return db.query(`
              SELECT * FROM comments WHERE review_id = $1;
            `, [review_id])
            .then((response) => {
              return response.rows;
            });
        });
    }

exports.addComment = (review_id, username, body) => {
        const idNum = parseInt(review_id);
        if (Number.isNaN(idNum)) {
          return Promise.reject({
            status: 400,
            msg: 'Bad request'
          });
        }
        
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
          .then((review) => {
            if (review.rows.length === 0) {
              return Promise.reject({
                status: 404,
                msg: 'Please provide a valid review_id'
              });
            }
            
    return db.query('SELECT * FROM users WHERE username = $1;', [username])
          .then((user) => {
                if (user.rows.length === 0) {
                  return Promise.reject({
                    status: 404,
                    msg: 'Invalid Username'
                  });
                }
                
    return db.query('INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;', [review_id, username, body])
            .then((result) => {
                return result.rows;
                  });
              });
          })
          .catch((err) => {
            throw err;
          });
      };
      
exports.updateReviewVotes = (review_id, inc_votes) => {
const idNum = parseInt(review_id);

if (Number.isNaN(idNum)) {
    return Promise.reject({
    status: 400,
    msg: 'Bad request'
    });
}

if (typeof inc_votes !== 'number') {
    return Promise.reject({
    status: 400,
    msg: 'Invalid request'
    });
}

return db.query(`
    UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;
`, [inc_votes, review_id])
    .then((result) => {
    if (result.rows.length === 0) {
        return Promise.reject({
        status: 404,
        msg: 'Review not found'
        });
    }

    return result.rows[0];
    });
};

exports.selectUsers = () => {
  return db
    .query(`
      SELECT * FROM users;
    `)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      throw err;
    });
};
