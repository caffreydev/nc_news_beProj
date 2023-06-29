const { getAllUsersModel } = require('../models');

exports.getAllUsersController = (_, res, next) => {
  return getAllUsersModel()
    .then(({ rows }) => {
      res.status(200).send({ users: rows });
    })
    .catch(next);
};
