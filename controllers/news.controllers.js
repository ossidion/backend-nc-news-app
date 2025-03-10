const {response} = require("express");
const {fetchAllTopics} = require("../models/news.models");

const getAllTopics = (request, response) => {
    fetchAllTopics()
    .then(( rows ) => {response.status(200).send({rows})
    })
}


module.exports = {getAllTopics}