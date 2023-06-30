const {
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
  patchArticleVotesModel,
  postCommentModel,
  postArticleModel,
} = require('../models');

exports.getArticleController = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId) || Math.floor(articleId) !== Number(articleId)) {
    return res
      .status(400)
      .send({ message: 'bad request: article id must be an integer' });
  }

  return getArticleModel(articleId)
    .then((article) => {
      if (article.length === 0) {
        return res.status(404).send({ message: 'resource not found' });
      }

      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.getAllArticlesController = (req, res, next) => {
  let topic = 'all';
  let sort_by = 'created_at';
  let order = 'DESC';

  if (req.query.topic) {
    topic = req.query.topic;
  }
  if (req.query.sort_by) {
    sort_by = req.query.sort_by;
  }
  if (req.query.order) {
    order = req.query.order;
  }

  return getAllArticlesModel(topic, sort_by, order)
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};

exports.getArticleCommentsController = (req, res, next) => {
  const articleId = req.params.article_id;

  return getArticleCommentsModel(articleId)
    .then((modelResponse) => {
      return res.status(200).send({ comments: modelResponse.rows });
    })
    .catch(next);
};

exports.patchArticleVotesController = (req, res, next) => {
  if (!req.body || !req.body.inc_votes) {
    return res.status(400).send({
      message:
        'patch request must be accompanied with an object with inc_votes key',
    });
  }

  const articleId = req.params.article_id;

  return patchArticleVotesModel(articleId, req.body.inc_votes)
    .then(({ rows }) => {
      return res.status(200).send({ updatedArticle: rows[0] });
    })
    .catch(next);
};

exports.postCommentController = (req, res, next) => {
  const commentObj = req.body;

  if (!commentObj || !commentObj.username || !commentObj.body) {
    return res.status(400).send({
      message:
        'post request must be accompanied by a comment object with valid username and body keys',
    });
  }
  const articleId = req.params.article_id;

  return postCommentModel(articleId, commentObj.username, commentObj.body)
    .then(({ rows }) => {
      return res.status(201).send({ postedComment: rows[0] });
    })
    .catch(next);
};

exports.postArticleController = (req, res, next) => {
  return postArticleModel(req.body)
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return res.status(201).send({ newArticle: rows[0] });
    })
    .catch(next);
};
