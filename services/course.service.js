const Course = require('../models/course');

const CourseService = {
    findAll: async function() {
        const courses = await Course.find({});
        console.log("🚀 ~ findAll:function ~ courses:", courses);
        return courses;
    }
}

module.exports = CourseService;