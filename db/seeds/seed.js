const db = require("../connection")
const format = require( 'pg-format' )
const { convertTimestampToDate } = require('./utils')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
  .query("DROP TABLE IF EXISTS comments;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS articles;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics;");
  })
  .then(() => {
    return createTopics(topicData);
  })
  .then(() => {
    return createUsers(userData);
  })
  .then(() => {
    return createArticles(articleData);
  })
  .then((articleData) => {
    return createComments(commentData, articleData);
  })
};

function createTopics(topicData) {
  return db.query(`CREATE TABLE topics(
    slug VARCHAR(20) PRIMARY KEY,
    description VARCHAR(500),
    img_url VARCHAR(1000));`)

  .then (() => {
    const formattedTopicData = topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url]
    })
    const insertTopicData = format(`INSERT INTO topics(slug, description, img_url) VALUES %L RETURNING *`, formattedTopicData)
    return db.query(insertTopicData)
  })

  .then((insertTopicData) => {
    return insertTopicData.rows
  })
}

function createUsers(userData) {
  return db.query(`CREATE TABLE users(
    username VARCHAR(20) PRIMARY KEY,
    name VARCHAR(20),
    avatar_url VARCHAR(1000));`)

  .then (() => {
    const formattedUsersData = userData.map((user) => {
      return [user.username, user.name, user.avatar_url]
    })
    const insertUserData = format(`INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`, formattedUsersData)
    return db.query(insertUserData)
  })

  .then((insertUserData) => {
    return insertUserData.rows
  })
}

function createArticles(articleData) {
  return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    topic VARCHAR(100) REFERENCES topics(slug),
    author VARCHAR(100) REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000));`)
    
  .then (() => {
    const formattedArticleData = articleData.map((article) => {
    const convertedDate = convertTimestampToDate(article)
    return [article.title, article.topic, article.author, article.body, convertedDate.created_at, article.votes, article.article_img_url]
    })

    const insertArticleData = format(`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedArticleData)
    return db.query(insertArticleData)
  })

  .then((insertArticleData) => {
    const articleRows = insertArticleData.rows
    return articleRows
  })
}

function createComments(commentData, articleRows) {

  console.log(articleRows, "articleRows within createComments")
  return db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    article_id int REFERENCES articles(article_id),
    body text,
    votes INT DEFAULT 0,
    author VARCHAR(100) REFERENCES users(username),
    created_at TIMESTAMP);`)

  .then (() => {
    const formattedCommentData = commentData.map((comment) => {
      const convertedDate = convertTimestampToDate(comment)
      return [articleRows.article_id, comment.body, comment.votes, comment.author, convertedDate.created_at]
      })

    const insertCommentData = format(`INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L RETURNING *`,formattedCommentData)
    return db.query(insertCommentData)
  })
  
  .then((insertCommentData) => {
    return insertCommentData.rows
  })
}

module.exports = seed;
