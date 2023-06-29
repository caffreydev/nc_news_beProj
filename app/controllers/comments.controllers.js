const { deleteCommentModel } = require('../models');

exports.deleteCommentController = (req, res, next) => {
  const commentId = req.params.comment_id;

  return deleteCommentModel(commentId)
    .then(() => {
      return res.status(204).end();
    })
    .catch(next);
};
