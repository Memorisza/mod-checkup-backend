import express from 'express'
import { addNewComment, editComment, getCommentById, softDeleteComment, likeComment, dislikeComment, getActiveCommentsByPostId, getActiveCommentsByPostIdAndPage } from '../controllers/comments.js';
import checkAuthorize from '../_helpers/checkAuthorize.js'

const router = express.Router();

//Everyone Access
router.get('/:commentId', getCommentById);
router.get('/post/:postId', getActiveCommentsByPostId);

//Require Login
router.post('/', checkAuthorize(), addNewComment);
router.put('/:commentId', checkAuthorize(), editComment);
router.delete('/:commentId', checkAuthorize(), softDeleteComment);
router.patch('/:commentId/like', checkAuthorize(), likeComment);
router.patch('/:commentId/dislike', checkAuthorize(), dislikeComment);

//In Development
// router.get('/csv/export', exportCsvFile);
// router.post('/csv/import', importCsvFile);
router.get('/post/:postId/page/:pageNo/size/:pageSize', getActiveCommentsByPostIdAndPage)

export default router;