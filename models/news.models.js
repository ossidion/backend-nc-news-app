const db = require("../db/connection");
const { commentData } = require("../db/data/test-data");
const format = require("pg-format");

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
                    rows = `There are no comments associated with this article: ${id}`
                    return rows
                };
                return rows})
            }
    });
}

const insertCommentByArticleId = (username, body, article_id, convertedDate) => {
    return db.query("SELECT article_id FROM articles WHERE article_id = $1", [article_id])
    .then(({rows}) => {
        const article = rows[0];
        if (!article) {
            return Promise.reject({
                status: 404, 
                msg: `Article not found with id: ${article_id}`,
            });
        } else {
            if (typeof body && typeof username === 'string') {
                return db.query("SELECT username FROM users WHERE username = $1", [username])
                .then(({rows}) => {
                    const user = rows[0]
                    if (!user) {
                        return Promise.reject({
                            status: 400, 
                            msg: `User does not exist`,
                        });
                    } else {
                        return db.query(`INSERT INTO comments (article_id, body, author, created_at) VALUES ($1, $2, $3, $4) RETURNING *`, [article_id, body, username, convertedDate])
                        .then(({ rows }) => {
                            return rows[0]})}})
            } else {
                return Promise.reject({
                    status: 400, 
                    msg: `Invalid data`,
                });
            };
        };
    });
};

const editArticleVoteById = (inc_votes, article_id) => {
    return db.query("SELECT article_id FROM articles WHERE article_id = $1", [article_id])
    .then(({rows}) => {
        const article = rows[0];
        if (!article) {
            return Promise.reject({
                status: 404, 
                msg: `Article not found with id: ${article_id}`,
            });
        } else {
            if (typeof inc_votes === 'number') {
                return db.query(`SELECT votes FROM articles WHERE article_id = $1`, [article_id])
                .then(({rows}) => {                    
                    if (Math.sign(inc_votes) === 1) { 
                        return totalVotes = rows[0].votes + inc_votes
                    } else if (Math.sign(inc_votes) === -1) {
                        return totalVotes = rows[0].votes + inc_votes
                    }
                })
                .then(({}) => { 
                    console.log(totalVotes)
                    return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [totalVotes, article_id])
                })
                .then(({ rows }) => {
                    return rows[0]
                }
            )} else {
                return Promise.reject({
                    status: 400, 
                    msg: `Invalid data`
                })

            }
    }})
            
}
            
                
                

module.exports = {
    fetchAllTopics,
    fetchArticleById, 
    fetchAllArticles, 
    fetchCommentsByArticleId,
    insertCommentByArticleId,
    editArticleVoteById
}