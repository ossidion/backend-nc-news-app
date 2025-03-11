const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed")
const db = require("../db/connection");
const data = require('../db/data/test-data/index');
const sorted = require('jest-sorted')


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
  test("200: Responds with an array of topic objects each of which should have a slug and description.", () => {
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

describe("GET /api/article/:id", () => {
  test("200: Responds with an article object, which should have the correct properties.", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({body}) => {
        expect(body.article.article_id).toBe(4);
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });

  test("404: Responds with a 404 error if object not found.", () => {
    const id = 4286723
    return request(app)
      .get(`/api/articles/${id}`)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found with id: ${id}`);
      });
  });

  test("400: Responds with a 400 error if made a bad request.", () => {
    const id = "banana"
    return request(app)
      .get(`/api/articles/${id}`)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request.");
      });
  });
});


describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects each of which should have the correct properties and sorted in date descending order.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.rows.length).not.toBe(0);
        expect(body.rows).toBeSortedBy("created_at", {descending: true,

        });
        body.rows.forEach(article => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
});