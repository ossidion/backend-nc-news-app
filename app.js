const express = require("express");
const app = express();
const endpoints = require("./endpoints.json")

console.log(endpoints, "<< endpoints in app")

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
})

app.get("/api/topics");

app.get("/api/articles");




module.exports = app