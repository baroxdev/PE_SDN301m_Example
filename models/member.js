const mongoose = require('mongoose')
const Schema = mongoose.Schema

const memberSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Member = mongoose.model('Member', memberSchema, 'Members')
module.exports = Member