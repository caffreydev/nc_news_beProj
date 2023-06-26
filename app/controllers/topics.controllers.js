const { getTopicsModel } = require('../models');

exports.getTopicsController = (req, res) => {
  return getTopicsModel()
    .then((topicsArray) => {
      res.status(200).send(topicsArray);
    })
    .catch((e) => {
      res.status(404).send({ message: 'Resource not found' });
    });
};
