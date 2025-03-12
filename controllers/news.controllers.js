const {fetchAllTopics, 
    fetchArticleById, 
    fetchAllArticles, 
    fetchCommentsByArticleId,
    insertCommentByArticleId
} = require("../models/news.models");

const getAllTopics = (request, response) => {
    fetchAllTopics()
    .then(( rows ) => {response.status(200).send({rows})
    })
}

const { convertTimestampToDate } = require('../db/seeds/utils')


const getArticleById = (request, response, next) => {
    const {id} = request.params;
    fetchArticleById(id)
    .then(( article ) => {response.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    });
};

const getAllArticles = (request, response) => {
    fetchAllArticles()
    .then(( rows ) => {response.status(200).send({rows})
    })
}

const getCommentsByArticleId = (request, response, next) => {
    const {id} = request.params;
    fetchCommentsByArticleId(id)
    .then(( comments ) => {response.status(200).send({comments});
    })
    .catch((err) => {
        next(err);
    });
};

const postCommentByArticleId = (request, response, next) => {
    const {id} = request.params;
    const {username, body} = request.body
    const dateNow = Date.now()
    const dateNowObj = {created_at: dateNow}
    const convertedDate = convertTimestampToDate(dateNowObj)
    const convertedDateParam = convertedDate.created_at
    insertCommentByArticleId(username, body, id, convertedDate.created_at)
    .then(( comment ) => {response.status(201).send({ comment });
    })
    .catch((err) => {
        next(err);
    });
};


module.exports = {
    getAllTopics, 
    getArticleById, 
    getAllArticles, 
    getCommentsByArticleId,
    postCommentByArticleId
}