const {fetchAllTopics, 
    fetchArticleById, 
    fetchAllArticles, 
    fetchCommentsByArticleId,
    insertCommentByArticleId,
    editArticleVoteById,
    removeCommentById,
    fetchAllUsers
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
    .then(( updatedArticle ) => {response.status(200).send({updatedArticle});
    })
    .catch((err) => {
        next(err);
    })
}

const getAllArticles = (request, response, next) => {
    const {sort_by, order, topic} = request.query
    fetchAllArticles(sort_by, order, topic)
    .then(( rows ) => {response.status(200).send({rows});
    })
    .catch((err) => {
        next(err);
    });
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


const patchArticleVoteById = (request, response, next) => {
    const {id} = request.params;
    const {inc_votes} = request.body
    editArticleVoteById(inc_votes, id)
    .then(( article ) => {response.status(201).send({ article })
    })
    .catch((err) => {
        next(err);
    });
};

const deleteCommentById = (request, response, next) => {
    const {id} = request.params;
    removeCommentById(id)
    .then(( comment ) => {response.status(204).send({ comment })
    })
    .catch((err) => {
        next(err);
    });
};

const getAllUsers = (request, response) => {
    fetchAllUsers()
    .then(( rows ) => {response.status(200).send({rows})
    })
}


module.exports = {
    getAllTopics, 
    getArticleById, 
    getAllArticles, 
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticleVoteById,
    deleteCommentById,
    getAllUsers
}