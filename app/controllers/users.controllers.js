const { userData } = require('../../db/data/test-data');
const { getAllUsersModel, getUserModel } = require('../models');

exports.getAllUsersController = (_, res, next) => {
  return getAllUsersModel()
    .then(({ rows }) => {
      res.status(200).send({ users: rows });
    })
    .catch(next);
};

exports.getUserController = (req, res, next) => {
  return getUserModel(req.params.username)
    .then((userData) => {
      res.status(200).send({ user: userData });
    })
    .catch(next);
};
