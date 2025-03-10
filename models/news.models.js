const db = require("../db/connection");


const fetchAllTopics = (topic) => {
    return db.query("SELECT * FROM topics")
    .then(({rows}) => {
        const slugDescription = []
        rows.forEach(comment => {
            slugDescription.push({"slug": comment.slug, "description": comment.description})
        })
        return slugDescription
        // console.log(slugDescription, "<<slugDescription in model on 12")
    })
}

module.exports = {fetchAllTopics}