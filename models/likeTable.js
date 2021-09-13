import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const likeTableSchema = new Schema({
    //With Default
    active: {
        type: Boolean,
        default: true
    },
})