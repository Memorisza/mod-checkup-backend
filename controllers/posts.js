import mongoose from 'mongoose'
import postModel from '../models/post.js'
import subjectModel from '../models/subject.js'

export const getAllPosts = async (req, res) => {
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
        res.status(409).json({ message: err.message })
    }
}

export const getPostById = async (req, res) => {
    try{
        const post = await postModel.findById(req.params.postId);

        if(post == null){
            res.status(404).json();
        }

        res.status(200).json(post);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const updatePost = async (req, res) => {
    const { postId: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.');

    const updatedPost = await postModel.findByIdAndUpdate(_id, { ... post, _id}, { new: true });

    res.json(updatedPost);
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
        const subjectId = await subjectModel.findOne({subject_abbr: _subject})
        const posts = await postModel.find({ subject_id: subjectId });

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}

export const softDeletePost = async (req, res) => {
    const { postId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id.');

    const updatedPost = await postModel.findByIdAndUpdate(postId, { active: false }, { new: true });

    res.json(updatedPost);    
}