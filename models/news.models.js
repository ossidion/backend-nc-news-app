const db = require("../db/connection");


const fetchAllTopics = (topic) => {
    return db.query("SELECT * FROM topics")
    .then(({rows}) => {
        const slugDescription = []
        rows.forEach(comment => {
            slugDescription.push({"slug": comment.slug, "description": comment.description})
        })
        return slugDescription

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

module.exports = {fetchAllTopics, fetchArticleById}