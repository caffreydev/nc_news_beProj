const { contentsModel } = require('../models');

exports.contentsController = (req, res) => {
  return contentsModel()
    .then((contentsObj) => {
      res.status(200).send(contentsObj);
    })
    .catch((e) => {
      res.status(404).send({ message: 'Resource not found' });
    });
};
