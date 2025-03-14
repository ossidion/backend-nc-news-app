const db = require("../db/connection");

const fetchAllTopics = () => {
    return db.query("SELECT slug, description FROM topics")
    .then(({rows}) => {
        return rows
    })
}

const fetchArticleById = (id) => {
    return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.body, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ORDER BY articles.created_at desc;', [id])
    .then(({rows}) => {
        const article = rows[0];
        if ( article === undefined ) return Promise.reject({status: 404, msg: `Article not found with id: ${id}`});
        rows.forEach(article => {
            article.comment_count = Number(article.comment_count)
        })
        return article;
    });
};

const fetchAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {

    if (topic) {
        return db.query('SELECT slug FROM topics WHERE slug = $1', [topic])
        .then(({rows}) => {
            const topicCheck = rows[0]
            if (topicCheck === undefined) return Promise.reject({status: 404, msg: `Topic does not exist`});

            return db.query('SELECT article_id FROM articles WHERE topic = $1', [topic])
        })

        .then(({rows}) => {
            const articleCheck = rows[0]
            if (articleCheck === undefined) return Promise.reject({status: 404, msg: `There are no articles with this topic.`});
                        
            const allowedSortByQueries = ['author', 'title', 'article_id', 'topic', 'votes', 'article_img_url', 'comment_count', 'created_at'];
            
            const allowedOrderQueries = ['asc', 'desc'];
            
            if (!allowedSortByQueries.includes(sort_by) || !allowedOrderQueries.includes(order)) return Promise.reject({status: 400, msg: `Invalid query`});
            
            let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`
        
            const queryValue = []            
            
            queryString += ` WHERE topic = $1`;
            queryValue.push(topic)
            
            queryString += ` GROUP BY articles.article_id`;
        
            queryString += ` ORDER BY ${sort_by}`;
        
            queryString += ` ${order}`;
        
            return db.query(queryString, queryValue)
    
            .then(({rows}) => {
                rows.forEach(article => {
                    article.comment_count = Number(article.comment_count)
                })
                return rows
            })
        })
    }

    const allowedSortByQueries = ['author', 'title', 'article_id', 'topic', 'votes', 'article_img_url', 'comment_count', 'created_at'];

    const allowedOrderQueries = ['asc', 'desc'];

    if (!allowedSortByQueries.includes(sort_by) || !allowedOrderQueries.includes(order)) return Promise.reject({status: 400, msg: `Invalid query`});

    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`

    queryString += ` GROUP BY articles.article_id`;
        
    queryString += ` ORDER BY ${sort_by}`;

    queryString += ` ${order}`;

    return db.query(queryString)

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
        if ( article === undefined ) return Promise.reject({status: 404, msg: `Article not found with id: ${id}`});
        return db.query("SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC", [id])
    })
    .then(({rows}) => {
        const commentCheck = rows[0];
        if ( commentCheck === undefined ) rows = `There are no comments associated with this article: ${id}`;
        return rows
    })
}

const insertCommentByArticleId = (username, body, article_id, convertedDate) => {
    return db.query("SELECT article_id FROM articles WHERE article_id = $1", [article_id])
    .then(({rows}) => {
        const article = rows[0];
        if ( article === undefined ) return Promise.reject({status: 404, msg: `Article not found with id: ${article_id}`
        });

        if (typeof body && typeof username === 'string') {
            return db.query("SELECT username FROM users WHERE username = $1", [username])
        } else {return Promise.reject({
            status: 400, 
            msg: `Invalid data`});
        }
    })
    .then(({rows}) => {
        const user = rows[0]
        if ( user === undefined ) return Promise.reject({status: 400, msg: `User does not exist`
        });
        return db.query(`INSERT INTO comments (article_id, body, author, created_at) VALUES ($1, $2, $3, $4) RETURNING *`, [article_id, body, username, convertedDate])
    })
    .then(({ rows }) => {
        return rows[0]
    })

}

const editArticleVoteById = (inc_votes, article_id) => {
    return db.query("SELECT article_id FROM articles WHERE article_id = $1", [article_id])
    .then(({rows}) => {
        const article = rows[0];
        if ( article === undefined ) return Promise.reject({status: 404, msg: `Article not found with id: ${article_id}`});

        if ( isNaN(inc_votes) ) return Promise.reject({status: 400, msg: `Invalid data`});
        
        if (typeof inc_votes === 'number') return db.query(`SELECT votes FROM articles WHERE article_id = $1`, [article_id])
        
    })            
    .then(({rows}) => {      
        if (Math.sign(inc_votes) === 1) { 
            return totalVotes = rows[0].votes + inc_votes
        } else if (Math.sign(inc_votes) === -1) {
            return totalVotes = rows[0].votes + inc_votes
        };
    })
    .then(({}) => { 
        return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [totalVotes, article_id])
    })
    .then(({ rows }) => {
        return rows[0]
    })
}            

const removeCommentById = (id) => {
    if ( isNaN(id) ) return Promise.reject({status: 400, msg: `Invalid data`})
    return db.query(`SELECT comment_id FROM comments WHERE comment_id = $1`, [id])
    
    .then(({rows}) => {
        const comment = rows[0]
        if ( comment === undefined ) return Promise.reject({status: 404, msg: `Comment not found with id: ${id}`});
        return db.query("DELETE from comments WHERE comment_id = $1", [id])
    })
    
    .then(({rows}) => {
        return rows})
}
            
const fetchAllUsers = (users) => {
    return db.query("SELECT username, name, avatar_url FROM users")
    .then(({rows}) => {
        return rows
    })
}
                
module.exports = {
    fetchAllTopics,
    fetchArticleById, 
    fetchAllArticles, 
    fetchCommentsByArticleId,
    insertCommentByArticleId,
    editArticleVoteById,
    removeCommentById,
    fetchAllUsers
}