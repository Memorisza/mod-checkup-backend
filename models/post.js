import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
    grade_received: {
        type: String,
        required: true,
    },
    teacher_rating: {
        type: Number,
        required: true,
    },
    usefulness_rating: {
        type: Number,
        required: true,
    },
    participation_rating: {
        type: Number,
        required: true,
    },
    academic_year: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    reviewedSubject: {
        type: Schema.Types.ObjectId,
        ref: 'subject',
        required: true,
    },
    //With Default
    like_rating: {
        type: Number,
        default: 0,
    },
    dislike_rating: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true
    },
    //Optional
    review_teacher:{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    review_detail:{
        type: String,
    },
    section:{
        type: String,
    },
}, {
    timestamps: true,
});

const postMessage = mongoose.model('review', postSchema);

export default postMessage;