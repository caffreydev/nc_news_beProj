const {
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
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

exports.getAllArticlesController = (_, res, next) => {
  getAllArticlesModel()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getArticleCommentsController = (req, res, next) => {
  const articleId = req.params.article_id;

  return getArticleCommentsModel(articleId)
    .then((modelResponse) => {
      if (!modelResponse) {
        return res
          .status(404)
          .send({ message: 'no article with this id exists' });
      }
      return res.status(200).send({ comments: modelResponse.rows });
    })
    .catch(next);
};
