const express = require("express");
const app = express();
const db = require("./db/connection");
const endpoints = require("./endpoints.json");
const {getAllTopics} = require("./controllers/news.controllers");
const {handleInvalidPath} = require("./controllers/errors.controllers");


// console.log(endpoints, "<< endpoints in app")

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles");

app.use(handleInvalidPath);

app.use((err, request, response, next) => {
    response.status(500).send({ message: "Internal server error."})
})




module.exports = app