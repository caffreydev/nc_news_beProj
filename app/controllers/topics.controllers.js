const { getTopicsModel } = require('../models');

exports.getTopicsController = (req, res, next) => {
  return getTopicsModel()
    .then(({ rows }) => {
      return res.status(200).send({ topics: rows });
    })
    .catch(next);
};
