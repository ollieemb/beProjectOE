const app = require('../app.js');
const request = require('supertest');
const testData = require("../db/data/test-data/index.js")
const developmentData = require("../db/data/development-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed.js");
const categories = require('../db/data/test-data/categories.js');





beforeEach(() => seed(testData))
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

  
    




      

