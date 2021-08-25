import express from 'express'

import { getActiveCommentsByPostId } from '../controllers/comments.js';
import { createPost, getPostById, updatePost, likePost, dislikePost, softDeletePost, getActivePosts, getPostsByUserId } from '../controllers/posts.js'

const router = express.Router();

router.get('/', getActivePosts);
router.get('/:postId', getPostById);
router.post('/', createPost);
router.put('/:postId', updatePost);
router.get('/:postId/comments', getActiveCommentsByPostId);
router.patch('/:postId/like', likePost);
router.patch('/:postId/dislike', dislikePost);
router.delete('/:postId', softDeletePost);
router.get('/history/:userId', getPostsByUserId);

export default router;
