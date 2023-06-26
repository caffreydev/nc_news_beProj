const { getArticleModel } = require('../models');

exports.getArticleController = (req, res) => {
  const articleId = req.params.article_id;

  return getArticleModel(articleId)
    .then((data) => {
      if (data.length === 0) {
        throw new error();
      }

      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(404).send({ message: 'resource not found' });
    });
};
