// const {response} = require("express");
const {fetchAllTopics, fetchArticleById} = require("../models/news.models");

const getAllTopics = (request, response) => {
    fetchAllTopics()
    .then(( rows ) => {response.status(200).send({rows})
    })
}

const getArticleById = (request, response, next) => {
    
    const {id} = request.params;
    fetchArticleById(id)
    .then(( article ) => {response.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = {getAllTopics, getArticleById}