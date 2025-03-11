\c nc_news_test

SELECT * FROM topics;
SELECT * FROM users;
SELECT * FROM articles;
SELECT * FROM comments;


\echo 'ticket-4'

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY created_at DESC;


\echo 'ticket-5'

SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
FROM comments
WHERE article_id = 1
ORDER BY comments.created_at DESC;


SELECT article_id FROM articles WHERE article_id = 1;