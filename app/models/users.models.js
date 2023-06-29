const db = require('../../db/connection');

exports.getAllUsersModel = () => {
  return db.query('SELECT * FROM users;');
};
