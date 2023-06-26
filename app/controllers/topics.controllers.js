const { getTopicsModel } = require('../models');

exports.getTopicsController = (req, res) => {
  return getTopicsModel().then((topicsArray) => {
    res.status(200).send(topicsArray);
  });
};
