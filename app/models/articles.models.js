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
  WHERE articles.article_id=%s
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`,
    articleId
  );
  return db.query(queryString).then(({ rows }) => rows);
};

exports.getAllArticlesModel = (queries) => {
  let topic = 'all';
  let sort_by = 'created_at';
  let order = 'DESC';
  let limit = 10;
  let p = 0;

  if (queries.topic) {
    topic = queries.topic;
  }
  if (queries.sort_by) {
    sort_by = queries.sort_by;
  }
  if (queries.order) {
    order = queries.order;
  }
  if (queries.limit) {
    limit = queries.limit;
    if (Number(limit) !== Math.floor(limit)) {
      return Promise.reject({
        status: 400,
        message: 'bad request',
      });
    }
  }
  if (queries.p) {
    if (Number(queries.p) !== Math.floor(queries.p)) {
      return Promise.reject({
        status: 400,
        message: 'bad request',
      });
    }
    p += limit * (queries.p - 1);
  }

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
  ORDER BY articles.%s %s`,
        sort_by,
        order
      );

      return db.query(queryString).then(({ rows }) => {
        return {
          articles: rows.slice(p, p + Number(limit)),
          total_count: rows.length,
        };
      });
    });
};

exports.getArticleCommentsModel = (articleId, limit, p) => {
  if (!limit) {
    limit = 10;
  } else if (Number(limit) !== Math.floor(limit)) {
    return Promise.reject({
      status: 400,
      message: 'bad request',
    });
  }

  if (!p) {
    p = 0;
  } else if (Number(p) !== Math.floor(p)) {
    return Promise.reject({
      status: 400,
      message: 'bad request',
    });
  } else {
    p = (p - 1) * limit;
  }

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
        return db.query(queryString, [articleId]).then(({ rows }) => {
          return {
            comments: rows.slice(p, p + limit),
            total_comments: rows.length,
          };
        });
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

exports.postArticleModel = (article) => {
  if (!article.body || !article.title) {
    return Promise.reject({
      status: 400,
      message: 'bad request',
    });
  }

  const { author, title, body, topic } = article;
  let article_img_url = 'default';
  if (article.article_img_url) {
    article_img_url = "'" + article.article_img_url + "'";
  }

  const queryString = format(
    `INSERT INTO articles VALUES (
    default,
    '%s',
    '%s',
    '%s',
    '%s',
    default,
    default,
    %s)
    RETURNING *;
    `,
    title,
    topic,
    author,
    body,
    article_img_url
  );

  return db.query(queryString);
};

exports.deleteArticleModel = (articleId) => {
  const queryString = 'DELETE FROM articles WHERE article_id=$1 RETURNING *;';
  return db.query(queryString, [articleId]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `no article with an id of ${articleId}`,
      });
    }
  });
};
