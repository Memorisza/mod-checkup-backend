import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dislikeTableSchema = new Schema({
    dislike_entity:{
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'entityModel'
    },
    dislike_owner:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    entityModel:{
        type: String,
        required: true,
        enum: ['review', 'comment']
    },
    //With Default
    active: {
        type: Boolean,
        default: true
    },
})

const dislikeModel = mongoose.model('dislikeTable', dislikeTableSchema);
export default dislikeModel;