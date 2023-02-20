const app = require('../app.js');
const request = require('supertest');
const testData = require("../db/data/test-data/index.js")
const developmentData = require("../db/data/development-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed.js")


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
            expect(body.categories[2].slug).toBe("dexterity");
            expect(body.categories[2].description).toBe("Games involving physical skill");
         })
        })
    // test("Returns the correct information in type and value", () => {
    //     return request(app)
    //     .get("/api/categories")
    //     .expect(200)
    //     .then(({body}) => {
    //         expect(body.categories[2].slug).toBe("dexterity");
    //         expect(body.categories[2].description).toBe("Games involving physical skill");
    //     })
    // })
})

