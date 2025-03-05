const db = require("./db/connection.js")

// Get all of the users
const getAllUsers = () => {
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        console.log("\n\n**All Users**\n")
        rows.forEach(user => {
            return console.log(user.username)
        });
    })
}

// Get all of the articles where the topic is coding
const getAllCodingArticles = () => {
    return db.query(`SELECT * FROM articles WHERE topic = $1`, ["coding"]).then(({rows}) => {
        console.log("\n\n**All Coding Articles**\n")
        rows.forEach(article => {
            return console.log(article.title)
        });
    })
}

// Get all of the comments where the votes are less than zero

const getCommentsWithZeroOrLessVotes = () => {
    return db.query(`SELECT * FROM comments WHERE votes <= $1`, [0]).then(({rows}) => {
        console.log("\n\n**Comments with Zero or Less Votes**\n")
        rows.forEach(comment => {
            return console.log(comment.body)
        });
    })
}

// Get all of the topics

const getAllTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        console.log("\n\n**All Topics**\n")
        rows.forEach(topic => {
            return console.log(topic.slug)
        });
    })
}

// Get all of the articles by user grumpy19

const getArticlesByGrumpy = () => {
    return db.query(`SELECT * FROM articles WHERE author = $1`, ["grumpy19"]).then(({rows}) => {
        console.log("\n\n**All Articles by grumpy19**\n")
        rows.forEach(article => {
            return console.log(article.author, "-", article.title)
        });
    })
}

// Get all of the comments that have more than 10 votes

const getArticlesWithMoreThanTenVotes = () => {
    return db.query(`SELECT * FROM comments WHERE votes > $1`, [10]).then(({rows}) => {
        console.log("\n\n**All Comments with More than Ten Votes**\n")
        rows.forEach(comment => {
            return console.log(comment.author, "-", comment.votes, "-", comment.body)
        });
    })
}




getAllUsers()
getAllCodingArticles()
getCommentsWithZeroOrLessVotes()
getAllTopics()
getArticlesByGrumpy()
getArticlesWithMoreThanTenVotes()



// Checking tables are set up correctly, as per Rose's Slack message

// Get Topics
const getTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        console.log("\n\n**Topics**\n")
        rows.forEach(topic => {
            return console.log(topic)
        });
    })
}

// Get Users
const getUsers = () => {
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        console.log("\n\n**Users**\n")
        rows.forEach(user => {
            return console.log(user)
        });
    })
}

// Get Articles
const getArticles = () => {
    return db.query(`SELECT * FROM articles`).then(({rows}) => {
        console.log("\n\n**Articles**\n")
        rows.forEach(article => {
            return console.log(article)
        });
    })
}

// Get Comments
const getComments = () => {
    return db.query(`SELECT * FROM comments`).then(({rows}) => {
        console.log("\n\n**Comments**\n")
        rows.forEach(comment => {
            return console.log(comment)
        });
    })
}



getTopics()
getUsers()
getArticles()
getComments()
