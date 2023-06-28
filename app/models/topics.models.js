const db = require('../../db/connection');

exports.getTopicsModel = () => {
  const queryString = 'SELECT * FROM topics;';

  return db.query(queryString);
};
