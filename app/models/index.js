const { getTopicsModel } = require('./topics.models');
const { contentsModel } = require('./api.models');
const {
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
  postCommentModel,
} = require('./articles.models');
const { deleteCommentModel } = require('./comments.models');

module.exports = {
  getTopicsModel,
  contentsModel,
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
  postCommentModel,
  deleteCommentModel,
};
