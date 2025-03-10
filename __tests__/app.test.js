const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed")
const db = require("../db/connection");
const data = require('../db/data/test-data/index');


/* Set up your beforeEach & afterAll functions here */


beforeAll(() => seed(data));
afterAll(() => db.end());

describe("ANY:/notAPath", () => {
  test("404: Responds with an error - endpoint has not been found.", () => {
    return request(app)
      .get("/notAPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path does not exist.");
      });
  });
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});


describe("GET /api/topics", () => {
  test("200: Responds with an array of topics objects each of which should have a slug and description.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.rows.length).not.toBe(0);
        body.rows.forEach(comment => {
          expect(typeof comment.slug).toBe("string");
          expect(typeof comment.description).toBe("string");
        });
        
      });
  });
});