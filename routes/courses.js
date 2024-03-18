var express = require('express');
var router = express.Router();
const CourseService = require('../services/course.service');
const Course = require('../models/course');


// GET /courses
router.get('/', async function(req, res, next) {
    const courses = await Course.find({})
  res.json({data: {
    courses
  }})
});

router.get('/:courseId', async function(req, res, next) {
  const courseId = req.params.courseId
  
  const course = await Course.findById(courseId)

  res.json({data: {
    course
  }})
});

router.post('/new', async function(req, res, next) {
  const body = req.body
  const course = new Course(body)
  await course.save()
res.json({data: {
  course
}})
});

router.put('/:courseId', async function(req, res, next) {
  const courseId = req.params.courseId
  const body = req.body
  const course = await Course.findByIdAndUpdate
  (courseId, body, {new: true})
  res.json({data: {
    course
  }})
}
);

router.delete('/:courseId', async function(req, res, next) {
  const courseId = req.params.courseId
  await Course.findByIdAndDelete(courseId)
  res.json({data: {
    message: 'Course deleted'
  }})
}
);

module.exports = router;
