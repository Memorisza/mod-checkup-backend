import express from 'express'

import { createPost, getPostById, updatePost, likePost, dislikePost, softDeletePost, getActivePosts } from '../controllers/posts.js'

const router = express.Router();

router.get('/', getActivePosts);
router.get('/:postId', getPostById);
router.post('/', createPost);
router.put('/:postId', updatePost);
router.patch('/:postId/like', likePost);
router.patch('/:postId/dislike', dislikePost);
router.delete('/:postId', softDeletePost);

export default router;
