const { contentsModel } = require('../models');

exports.contentsController = (req, res, next) => {
  return contentsModel()
    .then((contentsObj) => {
      res.status(200).send({ contents: contentsObj });
    })
    .catch(next);
};
