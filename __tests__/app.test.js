const app = require('../app.js');
const request = require('supertest');
const testData = require("../db/data/test-data/index.js")
const developmentData = require("../db/data/development-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed.js");
const categories = require('../db/data/test-data/categories.js');
const reviews = require('../db/data/test-data/reviews.js')





beforeEach(() => seed(testData, developmentData, categories, reviews))
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
    test.only("getReviews returns array of reviews and a comment count", () => {
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


    



  
    




      

