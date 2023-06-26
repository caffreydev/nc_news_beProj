const { getArticleModel } = require('../models');

exports.getArticleController = (req, res) => {
  const articleId = req.params.article_id;

  if (articleId) {
    return getArticleModel(articleId)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(404).send({ message: 'resource not found' });
      });
  } else {
    res.status(400).send({ message: 'you did not specify an article id' });
  }
};
