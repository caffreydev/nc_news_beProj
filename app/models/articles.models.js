const db = require('../../db/connection');
const format = require('pg-format');

exports.getArticleModel = (articleId) => {
  const queryString = format(
    `SELECT articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  articles.body, 
  count(comments.article_id) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON articles.article_id=comments.article_id
  WHERE articles.article_id=$1
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`,
    articleId
  );
  console.log(queryString);
  return db.query(queryString).then(({ rows }) => rows);
};

exports.getAllArticlesModel = (topic, sort_by, order) => {
  const topicCheck = topic === 'all' ? 'mitch' : topic;
  return db
    .query('SELECT * FROM topics WHERE slug = $1', [topicCheck])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `topic ${topic} not found`,
        });
      }

      let topicString = '';
      if (topic !== 'all') {
        topicString = format("WHERE articles.topic = '%s'", topic);
      }

      const queryString = format(
        `SELECT articles.author, articles.title, articles.article_id, 
    articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    count(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments
    ON articles.article_id=comments.article_id
    ${topicString}
  GROUP BY articles.article_id
  ORDER BY articles.%s %s;`,
        sort_by,
        order
      );

      return db.query(queryString);
    });
};

exports.getArticleCommentsModel = (articleId) => {
  return db
    .query('SELECT article_id FROM articles WHERE article_id=$1', [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `no article with an id of ${articleId}`,
        });
      } else {
        const queryString =
          'SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC';
        return db.query(queryString, [articleId]);
      }
    });
};

exports.postCommentModel = (articleId, username, body) => {
  const queryString = `INSERT INTO comments VALUES (
    default,
    $1,
    $2,
    $3,
    0,
    default
  ) RETURNING *`;

  return db.query(queryString, [body, articleId, username]);
};

exports.patchArticleVotesModel = (articleId, voteChange) => {
  const queryString = `UPDATE articles
   SET votes = votes + $1
   WHERE article_id = $2
   RETURNING *`;

  return db.query(queryString, [voteChange, articleId]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `no article with an id of ${articleId}`,
      });
    }
    return { rows: rows };
  });
};
