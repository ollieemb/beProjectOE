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
          console.log(review);
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

describe.only('GET/api/reviews/:review_id/comments', () => {
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


  

        
    
    



    



  
    




      

