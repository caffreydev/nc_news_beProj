const { deleteCommentModel, patchCommentModel } = require('../models');

exports.deleteCommentController = (req, res, next) => {
  const commentId = req.params.comment_id;

  return deleteCommentModel(commentId)
    .then(() => {
      return res.status(204).end();
    })
    .catch(next);
};

exports.patchCommentController = (req, res, next) => {
  const commentId = req.params.comment_id;
  const votes = req.body.inc_votes;

  return patchCommentModel(commentId, votes)
    .then((updatedComment) => {
      return res.status(200).send({ updatedComment: updatedComment });
    })
    .catch(next);
};
