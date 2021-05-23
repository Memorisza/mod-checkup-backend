import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment_detail:{
        type: String,
        required: true,
    },
    like_rating: {
        type: Number,
        default: 0,
    },
    dislike_rating: {
        type: Number,
        default: 0,
    },
    post_id:{
        type: String,
        required: true,
    }
},{
    timestamps: true
})

const commentMessage = mongoose.model('comment', commentSchema);

export default commentMessage;