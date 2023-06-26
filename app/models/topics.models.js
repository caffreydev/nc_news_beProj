const db = require('../../db/connection');
const format = require('pg-format');

exports.getTopicsModel = () => {
  const queryString = 'SELECT * FROM topics;';

  return db.query(queryString).then(({ rows }) => rows);
};
