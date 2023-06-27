const db = require('../../db/connection');

exports.getArticleModel = (articleId) => {
  const queryString = `SELECT * FROM articles WHERE article_id=$1`;

  return db.query(queryString, [articleId]).then(({ rows }) => rows);
};

exports.getAllArticlesModel = () => {
  let articlesArray;
  let commentsArray;

  const articlesData = db
    .query('SELECT * FROM articles ORDER BY created_at DESC;')
    .then(({ rows }) => {
      articlesArray = rows;
    });
  const commentsData = db.query('SELECT * FROM comments;').then(({ rows }) => {
    commentsArray = rows;
  });

  return Promise.all([articlesData, commentsData]).then(() => {
    return articlesArray.map((articleObj) => {
      let comments = 0;
      let articleId = articleObj.article_id;
      commentsArray.forEach((commentsObj) => {
        if (commentsObj.article_id === articleId) {
          comments++;
        }
      });
      delete articleObj.body;
      articleObj.comment_count = comments;
      return articleObj;
    });
  });
};
