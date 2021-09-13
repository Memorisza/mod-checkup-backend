import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dislikeTableSchema = new Schema({
    //With Default
    active: {
        type: Boolean,
        default: true
    },
})