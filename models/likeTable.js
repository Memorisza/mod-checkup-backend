import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const likeTableSchema = new Schema({
    liked_entity:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    like_owner:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    //With Default
    active: {
        type: Boolean,
        default: true
    },
})