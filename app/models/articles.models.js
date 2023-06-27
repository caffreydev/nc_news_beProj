const db = require('../../db/connection');

exports.getArticleModel = (articleId) => {
  const queryString = `SELECT * FROM articles WHERE article_id=$1`;

  return db.query(queryString, [articleId]).then(({ rows }) => rows);
};
