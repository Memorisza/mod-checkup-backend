import commentModel from '../models/comment.js'
import postModel from '../models/post.js'

export const getActiveCommentsByPostId = async (req, res) => {
    const { postId } = req.params

    try {
        const foundComments = await commentModel.find({ basePost: postId, active: true })

        res.status(200).json(foundComments);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getCommentById = async (req, res) => {
    const { commentId } = req.params;
    try {
        const foundComment = await commentModel.findById(commentId);

        if (!foundComment) {
            res.status(404).json();
        }

        res.status(200).json(foundComment);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const addNewComment = async (req, res) => {
    const commentBody = req.body;

    const newComment = new commentModel(commentBody)
    try {
        const foundPost = await postModel.findOne({ basePost: newComment.basePost })

        if (foundPost != null) {
            await newComment.save();
            res.status(201).json(newComment);
        }
        else{
            res.status(409).json({ message: "Post not found" })
        }
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

export const editComment = async (req, res) => {
    const { commentId } = req.params
    const commentContent = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send('No comment with that id.');

    const updatedComment = await commentModel.findByIdAndUpdate(commentId, { ...commentContent, commentId }, { new: true });

    res.json(updatedComment);
}

export const softDeleteComment = async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send('No comment with that id.');

    const updatedComment = await commentModel.findByIdAndUpdate(commentId, { active: false }, { new: true });

    res.json(updatedComment);
}