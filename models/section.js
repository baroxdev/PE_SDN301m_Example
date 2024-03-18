const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sectionSchema = new Schema({
    sectionName: {
        type: String,
        required: true
    },
    sectionDescription: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    isMainTask: {type: Boolean, default: false},
course: {type: mongoose.Schema.Types.ObjectId, ref: "Courses", require: true},

}, {
    timestamps: true
})

const Section = mongoose.model('Section', sectionSchema, 'Sections')

module.exports = Section