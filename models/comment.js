import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment_detail:{
        type: String,
        required: true,
    },
    basePost:{
        type: Schema.Types.ObjectId,
        ref: 'review',
        required: true
    },
    commenter:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    active:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const commentMessage = mongoose.model('comment', commentSchema);

export default commentMessage;