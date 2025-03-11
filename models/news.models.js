const db = require("../db/connection");


const fetchAllTopics = (topic) => {
    return db.query("SELECT slug, description FROM topics")
    .then(({rows}) => {
        return rows
    })
}

const fetchArticleById = (id) => {
    return db.query("SELECT article_id, title, topic, author, body, created_at, votes, article_img_url FROM articles WHERE article_id = $1", [id])
    .then(({rows}) => {
        const article = rows[0];
        if (!article) {
            return Promise.reject({
                status: 404, 
                msg: `Article not found with id: ${id}`,
            });
        }
        return article;
    });
};


const fetchAllArticles = () => {
    return db.query("SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;")

    .then(({rows}) => {
        rows.forEach(article => {
            article.comment_count = Number(article.comment_count)
        })
        return rows
    })
}

const fetchCommentsByArticleId = (id) => {
    return db.query("SELECT article_id FROM articles WHERE article_id = $1", [id])
    .then(({rows}) => {
        const article = rows[0];
        if (!article) {
            return Promise.reject({
                status: 404, 
                msg: `Article not found with id: ${id}`,
            });
        } else {
            return db.query("SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC", [id])
            .then(({rows}) => {
                const commentCheck = rows[0];
                if (!commentCheck) {
                    return Promise.reject({
                        status: 404, 
                        msg: `There are no comments associated with this article: ${id}`,
                    });
                }
                return rows;
        });
    }}
)};

module.exports = {fetchAllTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId}