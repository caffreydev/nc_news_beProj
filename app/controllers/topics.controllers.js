const { getTopicsModel, postTopicModel } = require('../models');

exports.getTopicsController = (_, res, next) => {
  return getTopicsModel()
    .then(({ rows }) => {
      return res.status(200).send({ topics: rows });
    })
    .catch(next);
};

exports.postTopicController = (req, res, next) => {
  return postTopicModel(req.body)
    .then(({ rows }) => {
      return res.status(201).send({ newTopic: rows[0] });
    })
    .catch(next);
};
