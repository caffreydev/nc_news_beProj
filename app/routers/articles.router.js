const {
  getArticleController,
  getAllArticlesController,
  getArticleCommentsController,
  patchArticleVotesController,
  badPathController,
  postCommentController,
  postArticleController,
} = require('../controllers');

const articleRouter = require('express').Router();

articleRouter.get('/:article_id', getArticleController);
articleRouter.get('/', getAllArticlesController);
articleRouter.get('/:article_id/comments', getArticleCommentsController);
articleRouter.patch('/:article_id', patchArticleVotesController);
articleRouter.post('/:article_id/comments', postCommentController);
articleRouter.post('/', postArticleController);
articleRouter.all('*', badPathController);

module.exports = articleRouter;
