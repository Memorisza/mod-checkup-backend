import express from 'express'
import { addNewComment, editComment, getCommentById, softDeleteComment, likeComment, dislikeComment, getActiveCommentsByPostId } from '../controllers/comments.js';
import checkAuthorize from '../_helpers/checkAuthorize.js'

const router = express.Router();

//Everyone Access
router.get('/:commentId', getCommentById);
router.get('/:postId/comments', getActiveCommentsByPostId);

//Require Login
router.post('/', checkAuthorize(), addNewComment);
router.put('/:commentId', checkAuthorize(), editComment);
router.delete('/:commentId', checkAuthorize(), softDeleteComment);
router.patch('/:commentId/like', checkAuthorize(), likeComment);
router.patch('/:commentId/dislike', checkAuthorize(), dislikeComment);

export default router;