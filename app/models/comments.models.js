const db = require('../../db/connection');

exports.deleteCommentModel = (commentId) => {
  const queryString = `DELETE FROM comments WHERE comment_id=$1 RETURNING *`;

  return db.query(queryString, [commentId]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `no comment with an id of ${commentId}`,
      });
    }
  });
};

exports.patchCommentModel = (commentId, votes) => {
  const queryString = `UPDATE comments SET votes=votes+$2 WHERE comment_id=$1 RETURNING *`;
  return db.query(queryString, [commentId, votes]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `no comment with an id of ${commentId}`,
      });
    }
    return rows[0];
  });
};
