import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const likeTableSchema = new Schema({
    like_entity:{
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'entityModel'
    },
    like_owner:{
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

const likeModel = mongoose.model('likeTable', likeTableSchema);
export default likeModel;