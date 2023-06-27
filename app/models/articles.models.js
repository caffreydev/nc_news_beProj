const db = require('../../db/connection');

exports.getArticleModel = (articleId) => {
  const queryString = `SELECT * FROM articles WHERE article_id=$1`;

  return db.query(queryString, [articleId]).then(({ rows }) => rows);
};

exports.getAllArticlesModel = () => {
  const queryString = `SELECT articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  count(comments.article_id) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON articles.article_id=comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;

  return db.query(queryString).then(({ rows }) => rows);
};
