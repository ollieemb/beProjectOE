const app = require('../app.js');
const request = require('supertest');
const testData = require("../db/data/test-data/index.js")
const developmentData = require("../db/data/development-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed.js");
const categories = require('../db/data/test-data/categories.js');
const reviews = require('../db/data/test-data/reviews.js')
const comments = require('../db/data/test-data/comments.js')





beforeEach(() => seed(testData, developmentData, categories, reviews, comments))
afterAll(() => db.end());

describe("Get Categories - returns slug and category data", () => {
    test("responds with a 200 status and returns an array of objects", () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.categories)).toBe(true);
            expect(body.categories.length).toBe(4);
            
            body.categories.forEach((category) => {
                expect(category).toHaveProperty('slug', expect.any(String))
                expect(category).toHaveProperty('description', expect.any(String))
            
        })
    })
    })
})
describe('/api/falseendpoint', () => {
    test("error handling works for a 404", () => {
    return request(app)
    .get("/api/not-found")
    .expect(404)
    .then(({body}) => {
        const serverResponseMsg = body.msg;
        expect(body.msg).toBe("path not found!")
    })
});
});

describe("get/api/reviews", () => {
    test("getReviews returns array of reviews and a comment count", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.reviews)).toBe(true);
           expect(body.reviews.length).toBe(13);
           expect(body.reviews).toBeSortedBy('created_at', {descending : true});
           body.reviews.forEach(review => {
            expect(review).toEqual(expect.objectContaining({
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String)
                }));
        });
    })
}) 
})

describe('GET /api/reviews/:review_id', () => {
    test('responds with 200 and the specified review', () => {
      return request(app)
        .get('/api/reviews/2')
        .expect(200)
        .then(({body}) => {
          const {review} = body
          expect(Array.isArray(review)).toBe(true);
          expect(review).toHaveLength(1);
          review.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: 'philippaclaire9',
                title: 'Jenga',
                review_id: 2,
                designer: 'Leslie Scott',
                review_img_url:
                'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                category: 'dexterity',
                created_at:  expect.any(String),
                review_body: 'Fiddly fun for all the family',
                votes: 5
              })
            );
          });
        });
    });
      test("Returns 404 for number with no match", () => {
        return request(app)
        .get("/api/reviews/999")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Not Found")
        })
      })
     test("Returns 400 invalid path", () => {
        return request(app)
        .get("/api/reviews/$$")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Invalid ID")
        })
     })
})

describe('GET/api/reviews/:review_id/comments', () => {
  test('responds with an array of comments and 200', () => {
    return request(app)
    .get('/api/reviews/3/comments')
    .expect(200)
    .then((response) => {
      const {comments} = response.body;
      expect(Array.isArray(comments)).toBe(true);
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            review_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String)
          })
        )
      })
    })
  })
  test('responds with 404 when invalid ID', () => {
    return request(app)
    .get('/api/reviews/999/comments')
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toEqual('Please insert valid Review_ID')
    })
  })

  test('Responds with 400 when invalid path', () => {
    return request(app)
    .get('/api/reviews/$$/comments')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Request Unavailable')
      })
    })
  })

describe('POST /api/reviews/:review_id/comments', () => {
  test('responds with 201 and posted comment', () => {
    return request(app)
      .post('/api/reviews/3/comments')
      .send({ username: 'bainesface', body: 'EPIC board game!!'})
      .expect(201)
      .then((res) => {
        const { comment } = res.body;
        console.log(comment);
        expect(typeof comment).toBe('object');
        expect(comment).toHaveLength(1);
        comment.forEach((result) => {
          expect(result).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String)
            })
          );
        });
      });
    })
    test('Responds with 404 if no ID match', () => {
      return request(app)
      .post('/api/reviews/999/comments')
      .send({ username: 'bainesface', body: 'EPIC board game!!' })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("Please provide a valid review_id");
      })
    })
    test('Responds with 404 if no username match', () => {
      return request(app)
      .post('/api/reviews/3/comments')
      .send({ username: 'Suuuuuiiiii', body: 'EPIC board game!!' })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Invalid Username');
      });
    });
    test('Responds with 400 if invalid ID type', () => {
      return request(app)
      .post('/api/reviews/$$/comments')
      .send({ username: 'bainesface', body: 'EPIC board game!!' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad request');
      })
    })
    test('responds with 201 and ignores distractions', () => {
      return request(app)
        .post('/api/reviews/3/comments')
        .send({ username: 'bainesface', body: 'EPIC board game!!', distraction: 'Suuuuuiiiii'})
        .expect(201)
        .then((res) => {
          const { comment } = res.body;
          console.log(comment);
          expect(typeof comment).toBe('object');
          expect(comment).toHaveLength(1);
          comment.forEach((result) => {
            expect(result).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String)
              })
            );
          });
        });
});
test('Responds with 400 if missing body property', () => {
  return request(app)
  .post('/api/reviews/3/comments')
  .send({ username: 'bainesface', incomplete: 'incomplete' })
  .expect(400)
  .then((res) => {
    expect(res.body.msg).toEqual('Please provide valid body request');
  })
})
test('Responds with 400 if missing body property', () => {
  return request(app)
  .post('/api/reviews/3/comments')
  .send({ username: '' , body: 'valid' })
  .expect(400)
  .then((res) => {
    expect(res.body.msg).toEqual('Please provide a valid username');
  })
})


})

describe("PATCH /api/reviews/:review_id", () => {
  test(" returns a 200 status with the review item", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
  test('responds 200 with the correct body of information', () => {
    return request(app)
      .patch('/api/reviews/3')
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          updated_review: {
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            review_id: expect.any(Number),
            review_body: expect.any(String)
          }
        });
       })
  })
  test('Responds 200 and updates votes (positive vote count)', () => {
    return request(app)
    .patch("/api/reviews/2")
    .send({inc_votes: 7})
    .expect(200)
    .then((res) => {
    expect(res.body).toEqual({
      updated_review: {
        owner: 'philippaclaire9',
                title: 'Jenga',
                review_id: 2,
                designer: 'Leslie Scott',
                review_img_url:
                'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                category: 'dexterity',
                owner: expect.any(String),
                created_at:  expect.any(String),
                review_body: 'Fiddly fun for all the family',
                review_body: expect.any(String),
                votes: 12
      }
    })
  })
  })
  test('Responds 200 and updates votes (negative vote count)', () => {
    return request(app)
    .patch("/api/reviews/2")
    .send({inc_votes: -7})
    .expect(200)
    .then((res) => {
    expect(res.body).toEqual({
      updated_review: {
        owner: 'philippaclaire9',
                title: 'Jenga',
                review_id: 2,
                designer: 'Leslie Scott',
                review_img_url:
                'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                category: 'dexterity',
                owner: expect.any(String),
                created_at:  expect.any(String),
                review_body: 'Fiddly fun for all the family',
                review_body: expect.any(String),
                votes: -2
      }
    })
 })
  })
  test('Returns 200, correct vote count and ignores distractions', () => {
    return request(app)
    .patch("/api/reviews/7")
    .send({inc_votes: 7, distraction: 'Suuuuuiiiii'})
    .expect(200)
    .then((res) => {
      expect(res.body).toEqual({
        updated_review: {
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: 16,
          review_id: expect.any(Number),
          review_body: expect.any(String)
        }
      });
     })
})
test('Returns 400 if missing property', () => {
  return request(app)
  .patch("/api/reviews/7")
  .send({Suuuuuiiiii: 7})
  .expect(400)
  .then((res) => {
    expect(res.body.msg).toEqual('Invalid request')
  })
  })
  test('Returns 400 if no valid ID ', () => {
    return request(app)
    .patch("/api/reviews/Suuuuuiiiii")
    .send({inc_votes: 7})
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toEqual('Bad request')
    })
    })
    test('Returns 404 if no ID Match ', () => {
      return request(app)
      .patch("/api/reviews/999")
      .send({inc_votes: 7})
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Review not found')
      })
      })
})
    
 
    



    


  
    




      

