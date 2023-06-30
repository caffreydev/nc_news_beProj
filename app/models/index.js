const { getTopicsModel } = require('./topics.models');
const { contentsModel } = require('./api.models');
const {
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
  patchArticleVotesModel,
  postCommentModel,
} = require('./articles.models');
const { deleteCommentModel } = require('./comments.models');

const { getAllUsersModel, getUserModel } = require('./users.models');

module.exports = {
  getTopicsModel,
  contentsModel,
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
  patchArticleVotesModel,
  postCommentModel,
  deleteCommentModel,
  getAllUsersModel,
  getUserModel,
};
