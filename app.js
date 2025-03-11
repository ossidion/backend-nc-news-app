const express = require("express");
const db = require("./db/connection");
const endpoints = require("./endpoints.json");
const {getAllTopics, getArticleById} = require("./controllers/news.controllers");
const {handleInvalidPath, handleCumstomErrors, handlePsqlErrors} = require("./controllers/errors.controllers");

const app = express();

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles");

app.get("/api/articles/:id", getArticleById);

app.use(handleCumstomErrors);

app.use(handlePsqlErrors);

app.use("*", handleInvalidPath);

app.use((err, request, response, next) => {
    response.status(500).send({ message: "Internal server error."})
});




module.exports = app