var express = require('express');

import { getPosts, createPost, viewPost, updatePost, deletePost, likePost, dislikePost, getPostBySubject } from '../controllers/posts.js'

const router = express.Router();

router.get('/', getPosts);
router.get('/subject/:subject', getPostBySubject);
router.post('/create', createPost);
router.get('/:id', viewPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/like', likePost);
router.patch('/:id/dislike', dislikePost);

export default router;
