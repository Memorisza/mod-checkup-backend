var mongoose = require('mongoose');
var postModel = require('../models/post.js');

export const getPosts = async (req, res) => {
    try{
        const posts = await postModel.find().sort({createdAt: 'desc'});

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const createPost = async (req, res) => {
    const postBody = req.body;

    const newPost = new postModel(postBody);

    try{
        await newPost.save();

        res.status(201).json(newPost);
    }
    catch(err){
        console.log(err.message);
        res.status(409).json({ message: err.message })
    }
}

export const viewPost = async (req, res) => {
    try{
        const post = await postModel.findById(req.params.id);

        res.status(200).json(post);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.');

    const updatedPost = await postModel.findByIdAndUpdate(_id, { ... post, _id}, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id.');

    await postModel.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfully'});
}

export const likePost = async (req, res) => {
    const { id: _id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.');

    const post = await postModel.findById(_id);
    const updatedPost = await postModel.findByIdAndUpdate(_id, { like_rating: post.like_rating + 1 }, { new: true });

    res.json(updatedPost);    
}

export const dislikePost = async (req, res) => {
    const { id: _id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.');

    const post = await postModel.findById(_id);
    const updatedPost = await postModel.findByIdAndUpdate(_id, { dislike_rating: post.dislike_rating + 1 }, { new: true });

    res.json(updatedPost);    
}

export const getPostBySubject = async (req, res) => {
    const { subject: _subject } = req.params;
    
    try{
        const posts = await postModel.find({ subject_id: _subject });

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}