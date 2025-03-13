const express = require("express");
const endpoints = require("./endpoints.json");
const {
    getAllTopics, 
    getArticleById, 
    getAllArticles, 
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticleVoteById
} = require("./controllers/news.controllers");


const {
    handleInvalidPath,
    handleCustomErrors,
    handlePsqlErrors
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json())

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:id", getArticleById);

app.get("/api/articles/:id/comments", getCommentsByArticleId);

app.post("/api/articles/:id/comments", postCommentByArticleId);

app.patch("/api/articles/:id", patchArticleVoteById);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use("*", handleInvalidPath);

app.use((err, request, response, next) => {
    response.status(500).send({ message: "Internal server error."})
});

module.exports = app