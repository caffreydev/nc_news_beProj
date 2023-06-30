const db = require('../../db/connection');

exports.getTopicsModel = () => {
  const queryString = 'SELECT * FROM topics;';

  return db.query(queryString);
};

exports.postTopicModel = (topic) => {
  const queryString = 'INSERT INTO topics VALUES ($1, $2) RETURNING *';

  return db.query(queryString, [topic.slug, topic.description]);
};
