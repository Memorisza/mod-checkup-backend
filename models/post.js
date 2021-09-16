import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
    grade_received: {
        type: String,
        required: true,
        enum: [ 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W' ]
    },
    teacher_rating: {
        type: Number,
        required: true,
        max: 5,
        min: 0
    },
    usefulness_rating: {
        type: Number,
        required: true,
        max: 5,
        min: 0
    },
    participation_rating: {
        type: Number,
        required: true,
        max: 5,
        min: 0
    },
    academic_year: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
        min: 0,
        max: 3
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
    active: {
        type: Boolean,
        default: true
    },
    identity_hidden:{
        type: Boolean,
        required: true,
        default: false
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