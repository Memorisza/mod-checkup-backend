import mongoose from 'mongoose'
import postMessage from '../models/post.js'
import subjectMessage from '../models/subject.js';

export const getPosts = async (req, res) => {
    try{
        const posts = await postMessage.find().sort({createdAt: 'desc'});

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const createPost = async (req, res) => {
    const postBody = req.body;

    const newPost = new postMessage(postBody);

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
        const post = await postMessage.findById(req.params.id);

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

    const updatedPost = await postMessage.findByIdAndUpdate(_id, { ... post, _id}, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id.');

    await postMessage.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfully'});
}

export const likePost = async (req, res) => {
    const { id: _id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.');

    const post = await postMessage.findById(_id);
    const updatedPost = await postMessage.findByIdAndUpdate(_id, { like_rating: post.like_rating + 1 }, { new: true });

    res.json(updatedPost);    
}

export const dislikePost = async (req, res) => {
    const { id: _id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.');

    const post = await postMessage.findById(_id);
    const updatedPost = await postMessage.findByIdAndUpdate(_id, { dislike_rating: post.dislike_rating + 1 }, { new: true });

    res.json(updatedPost);    
}

export const getPostBySubject = async (req, res) => {
    const { subject: _subject } = req.params;
    
    try{
        const posts = await postMessage.find({ subject_id: _subject });

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}