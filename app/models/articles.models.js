const db = require('../../db/connection');
const format = require('pg-format');

exports.getArticleModel = (articleId) => {
  const queryString = format(
    'SELECT * FROM articles WHERE article_id=%s',
    articleId
  );

  return db.query(queryString).then(({ rows }) => rows[0]);
};
