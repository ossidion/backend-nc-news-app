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
  test("404: Responds with an error - endpoint has not been found", () => {
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
  test("200: Responds with an array of topic objects each of which should have a slug and description", () => {
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
  test("200: Responds with an article object, which should have the correct properties", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const article = body.updatedArticle
        expect(article.article_id).toBe(4);
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });

  test("404: Responds with a 404 error if object not found", () => {
    const id = 4286723
    return request(app)
      .get(`/api/articles/${id}`)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found with id: ${id}`);
      });
  });

  test("400: Responds with a 400 error if made a bad request", () => {
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
  test("200: Responds with an array of article objects each of which should have the correct properties and sorted in date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.rows.length).not.toBe(0);
        expect(body.rows).toBeSortedBy("created_at", {descending: true,});
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

describe("GET /api/article/:article_id/comments", () => {
  test("200: Responds with all comments for an article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toBeSortedBy("created_at", {descending: true,});
        expect(body.comments.length).toBe(2)
        body.comments.forEach(comment => {
          expect(comment.article_id).toBe(3);
          expect(comment).toEqual(expect.objectContaining({
            comment_id: expect.any(Number), 
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          }));
        });
      });
  });

  test("200: Responds with a message if no comments associated with specified article.", () => {
    const id = 4
    return request(app)
      .get(`/api/articles/${id}/comments`)
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toBe(`There are no comments associated with this article: ${id}`);
      });
  });

  test("404: Responds with a 404 error if article not found.", () => {
    const id = 4566546
    return request(app)
      .get(`/api/articles/${id}/comments`)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found with id: ${id}`);
      });
  });


  test("400: Responds with a 400 error if made a bad request.", () => {
    const id = "banana"
    return request(app)
      .get(`/api/articles/${id}/comments`)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request.");
      });
  });
});


describe("POST /api/article/:article_id/comments", () => {
  test("201: Creates a new comment for specified article and inserts the comment into the database, responding with the inserted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: 'rogersop',
        body: 'A cloud weighs around a million tonnes.'
      })
      .expect(201)
      .then(({ body }) => {
          const comment = body.comment
          expect(comment.comment_id).toBe(19);
          expect(comment.body).toBe("A cloud weighs around a million tonnes.");
          expect(comment.votes).toBe(0);
          expect(comment.author).toBe("rogersop");
          expect(comment.article_id).toBe(3);

          expect(typeof comment.created_at).toBe("string");
        });
      });
  

  test("404: Responds with a 404 error if article not found.", () => {
    const id = 4566546
    return request(app)
      .post(`/api/articles/${id}/comments`)
      .send({
        username: 'rogersop',
        body: 'A cloud weighs around a million tonnes.'
      })
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found with id: ${id}`);
      });
  });


  test("400: Responds with a 400 error if bad id request.", () => {
    const id = "banana"
    return request(app)
      .post(`/api/articles/${id}/comments`)
      .send({
        username: 'rogersop',
        body: 'A cloud weighs around a million tonnes.'
      })
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request.");
      });
  });

  test("400: Responds with a 400 error if invalid data is posted.", () => {
    return request(app)
    .post(`/api/articles/3/comments`)
    .send({
      username: 1,
      body: 37
    }).expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Invalid data");
      });
  });

  test("400: Responds with a 400 error if username does not exist.", () => {
    return request(app)
    .post(`/api/articles/3/comments`)
    .send({
      username: 'Alexander',
      body: 'A cloud weighs around a million tonnes.'
    }).expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("User does not exist");
      });
  });
})

describe("PATCH /api/article/:article_id", () => {
  test("201: update an article by article_id with vote increment", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({
        inc_votes: 4
      })
      .expect(201)
      .then(({ body }) => {
        const article = body.article
        expect(article.title).toBe("Sony Vaio; or, The Laptop");
        expect(article.topic).toBe("mitch");
        expect(article.votes).toBe(4);
        expect(typeof article.author).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.article_img_url).toBe("string");
        });
      });
  
  test("201: update an article by article_id with vote decrement", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -4
      })
      .expect(201)
      .then(({ body }) => {
        const article = body.article
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.votes).toBe(96);
        expect(typeof article.author).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.article_img_url).toBe("string");
        });
      });

  test("404: Responds with a 404 error if article not found.", () => {
    const id = 4566546
    return request(app)
    .patch(`/api/articles/${id}`)
    .send({
      inc_votes: 4
    })
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found with id: ${id}`);
      });
  });

  test("400: Responds with a 400 error if bad id request.", () => {
    const id = "banana"
    return request(app)
      .patch(`/api/articles/${id}`)
      .send({
        inc_votes: 4
      })
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request.");
      });
  });

  test("400: Responds with a 400 error if invalid data is posted.", () => {
    return request(app)
    .patch(`/api/articles/3`)
    .send({
      inc_votes: "d"
    })
    .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Invalid data");
      });
  });
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete the given comment by comment_id", () => {
    const id = 1
    return request(app)
      .delete(`/api/comments/${id}`)
      .expect(204)
      });

  test("404: Responds with a 404 error if comment not found.", () => {
    const id = 458
    return request(app)
    .delete(`/api/comments/${id}`)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe(`Comment not found with id: ${id}`);
      });
  });


  test("400: Responds with a 400 error if bad id request.", () => {
    const id = "banana"
    return request(app)
      .delete(`/api/comments/${id}`)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request.");
      });
  });
  });
