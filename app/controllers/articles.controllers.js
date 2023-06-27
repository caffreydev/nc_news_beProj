const { getArticleModel, getAllArticlesModel } = require('../models');

exports.getArticleController = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId) || Math.floor(articleId) !== Number(articleId)) {
    return res
      .status(400)
      .send({ message: 'bad request: article id must be an integer' });
  }

  return getArticleModel(articleId).then((data) => {
    if (data.length === 0) {
      return res.status(404).send({ message: 'resource not found' });
    }

    res.status(200).send(data[0]);
  });
};

exports.getAllArticlesController = (_, res) => {
  getAllArticlesModel().then((data) => {
    res.status(200).send(data);
  });
};
