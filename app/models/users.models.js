const db = require('../../db/connection');

exports.getAllUsersModel = () => {
  return db.query('SELECT * FROM users;');
};

exports.getUserModel = (username) => {
  return db
    .query('SELECT * FROM users WHERE username=$1', [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `no user with username of ${username} found`,
        });
      }
      return rows[0];
    });
};
